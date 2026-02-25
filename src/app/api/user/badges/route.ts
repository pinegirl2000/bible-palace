// ============================================
// Bible Palace — User Badges API
// GET: 사용자 배지 목록
// ============================================

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/badges
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // 모든 배지 + 사용자 획득 여부
    const [allBadges, userBadges] = await Promise.all([
      prisma.badge.findMany({ orderBy: { category: "asc" } }),
      prisma.userBadge.findMany({
        where: { userId },
        select: { badgeId: true, earnedAt: true },
      }),
    ]);

    const earnedMap = new Map(
      userBadges.map((ub) => [ub.badgeId, ub.earnedAt])
    );

    const badges = allBadges.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      iconEmoji: badge.iconEmoji,
      category: badge.category,
      earned: earnedMap.has(badge.id),
      earnedAt: earnedMap.get(badge.id)?.toISOString() || null,
    }));

    return NextResponse.json({
      data: {
        badges,
        earnedCount: userBadges.length,
        totalCount: allBadges.length,
      },
    });
  } catch (error) {
    console.error("Badges GET error:", error);
    return NextResponse.json({ error: "배지 목록을 불러오는데 실패했습니다" }, { status: 500 });
  }
}
