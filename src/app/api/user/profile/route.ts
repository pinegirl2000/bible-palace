// ============================================
// Bible Palace — User Profile API
// GET: 프로필 + 통계 / PUT: 프로필 업데이트
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validations";

// GET /api/user/profile
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const [user, palaceCount, memorizedCount, attemptStats, badges, groups] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, name: true, avatarUrl: true },
        }),
        prisma.palace.count({ where: { userId } }),
        prisma.palace.count({
          where: { userId, attempts: { some: { score: { gte: 0.8 } } } },
        }),
        prisma.memorizationAttempt.aggregate({
          where: { userId },
          _count: true,
          _avg: { score: true },
        }),
        prisma.userBadge.findMany({
          where: { userId },
          include: { badge: true },
          orderBy: { earnedAt: "desc" },
        }),
        prisma.cellGroupMember.findMany({
          where: { userId },
          include: { group: { select: { id: true, name: true } } },
        }),
      ]);

    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        ...user,
        stats: {
          totalPalaces: palaceCount,
          totalMemorized: memorizedCount,
          totalAttempts: attemptStats._count,
          averageScore: Math.round((attemptStats._avg.score || 0) * 100),
        },
        badges: badges.map((ub) => ({
          id: ub.badge.id,
          name: ub.badge.name,
          iconEmoji: ub.badge.iconEmoji,
          description: ub.badge.description,
          earnedAt: ub.earnedAt.toISOString(),
        })),
        groups: groups.map((g) => ({
          id: g.group.id,
          name: g.group.name,
          role: g.role,
        })),
      },
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "프로필을 불러오는데 실패했습니다" }, { status: 500 });
  }
}

// PUT /api/user/profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const validated = profileUpdateSchema.parse(body);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.avatarUrl && { avatarUrl: validated.avatarUrl }),
      },
      select: { id: true, email: true, name: true, avatarUrl: true },
    });

    return NextResponse.json({ data: updated, message: "프로필이 업데이트되었습니다" });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "프로필 업데이트에 실패했습니다" }, { status: 500 });
  }
}
