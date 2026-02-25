// ============================================
// Bible Palace — Review Stats API
// GET: 사용자의 복습 통계
// ============================================

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/review/stats
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // 병렬로 통계 조회
    const [
      totalPalaces,
      totalAttempts,
      avgScoreResult,
      upcomingSchedules,
      recentAttempts,
      badges,
    ] = await Promise.all([
      prisma.palace.count({ where: { userId } }),
      prisma.memorizationAttempt.count({ where: { userId } }),
      prisma.memorizationAttempt.aggregate({
        where: { userId },
        _avg: { score: true },
      }),
      prisma.reviewSchedule.findMany({
        where: {
          userId,
          nextReviewAt: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        },
        include: { palace: { select: { name: true, verseRef: true } } },
        orderBy: { nextReviewAt: "asc" },
      }),
      prisma.memorizationAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: { score: true, createdAt: true },
      }),
      prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
      }),
    ]);

    // 암송 성공한 궁전 수 (최근 시도 score >= 0.8)
    const memorizedCount = await prisma.palace.count({
      where: {
        userId,
        attempts: {
          some: { score: { gte: 0.8 } },
        },
      },
    });

    // 연속 복습 일수 계산
    const streak = calculateStreak(recentAttempts.map((a) => a.createdAt));

    const now = new Date();
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const todayReviews = upcomingSchedules.filter(
      (s) => s.nextReviewAt <= todayEnd
    );

    return NextResponse.json({
      data: {
        totalPalaces,
        totalMemorized: memorizedCount,
        currentStreak: streak,
        totalAttempts,
        averageScore: Math.round((avgScoreResult._avg.score || 0) * 100),
        upcomingReviews: upcomingSchedules.length,
        todayReviews: todayReviews.map((s) => ({
          palaceId: s.palaceId,
          palaceName: s.palace.name,
          verseRef: s.palace.verseRef,
          nextReviewAt: s.nextReviewAt.toISOString(),
          isOverdue: s.nextReviewAt <= now,
        })),
        badges: badges.map((ub) => ({
          name: ub.badge.name,
          iconEmoji: ub.badge.iconEmoji,
          description: ub.badge.description,
          earnedAt: ub.earnedAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Review stats GET error:", error);
    return NextResponse.json({ error: "통계를 불러오는데 실패했습니다" }, { status: 500 });
  }
}

/** 연속 복습 일수 계산 */
function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const uniqueDays = new Set(
    dates.map((d) => d.toISOString().split("T")[0])
  );
  const sortedDays = Array.from(uniqueDays).sort().reverse();

  const today = new Date().toISOString().split("T")[0];
  if (sortedDays[0] !== today) {
    // 오늘 복습하지 않았으면 어제부터 체크
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (sortedDays[0] !== yesterday) return 0;
  }

  let streak = 1;
  for (let i = 0; i < sortedDays.length - 1; i++) {
    const current = new Date(sortedDays[i]);
    const prev = new Date(sortedDays[i + 1]);
    const diff = (current.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
