// ============================================
// Bible Palace — Review Schedule API
// GET: 사용자의 다가오는 복습 일정
// ============================================

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/review/schedule
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const now = new Date();

    const schedules = await prisma.reviewSchedule.findMany({
      where: { userId },
      include: {
        palace: {
          select: {
            id: true,
            name: true,
            verseRef: true,
            verseText: true,
            imageStyle: true,
          },
        },
      },
      orderBy: { nextReviewAt: "asc" },
    });

    const data = schedules.map((s) => ({
      id: s.id,
      palaceId: s.palaceId,
      palaceName: s.palace.name,
      verseRef: s.palace.verseRef,
      difficulty: s.difficulty,
      repetitionNum: s.repetitionNum,
      easeFactor: s.easeFactor,
      intervalDays: s.intervalDays,
      nextReviewAt: s.nextReviewAt.toISOString(),
      lastReviewedAt: s.lastReviewedAt?.toISOString() || null,
      isOverdue: s.nextReviewAt <= now,
    }));

    // 오늘 복습해야 할 것들
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    const todayReviews = data.filter(
      (s) => new Date(s.nextReviewAt) <= todayEnd
    );

    return NextResponse.json({
      data: {
        all: data,
        today: todayReviews,
        todayCount: todayReviews.length,
        totalCount: data.length,
      },
    });
  } catch (error) {
    console.error("Review schedule GET error:", error);
    return NextResponse.json({ error: "복습 일정을 불러오는데 실패했습니다" }, { status: 500 });
  }
}
