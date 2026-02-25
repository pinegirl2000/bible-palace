// ============================================
// Bible Palace — Group Detail API
// GET: 그룹 상세 + 멤버 진행도
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/group/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(session.user.id);

    // 멤버 자격 확인
    const membership = await prisma.cellGroupMember.findUnique({
      where: { groupId_userId: { groupId: id, userId } },
    });

    if (!membership) {
      return NextResponse.json({ error: "이 그룹의 멤버가 아닙니다" }, { status: 403 });
    }

    const group = await prisma.cellGroup.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "그룹을 찾을 수 없습니다" }, { status: 404 });
    }

    // 각 멤버의 통계 조회
    const memberStats = await Promise.all(
      group.members.map(async (m) => {
        const [palaceCount, avgScore, recentAttempt] = await Promise.all([
          prisma.palace.count({ where: { userId: m.userId } }),
          prisma.memorizationAttempt.aggregate({
            where: { userId: m.userId },
            _avg: { score: true },
          }),
          prisma.memorizationAttempt.findFirst({
            where: { userId: m.userId },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ]);

        return {
          userId: m.user.id,
          userName: m.user.name || "익명",
          avatarUrl: m.user.avatarUrl,
          role: m.role,
          palaceCount,
          averageScore: Math.round((avgScore._avg.score || 0) * 100),
          lastActiveAt: recentAttempt?.createdAt?.toISOString() || null,
        };
      })
    );

    return NextResponse.json({
      data: {
        id: group.id,
        name: group.name,
        description: group.description,
        inviteCode: group.inviteCode,
        ownerId: group.ownerId,
        memberCount: group.members.length,
        members: memberStats,
      },
    });
  } catch (error) {
    console.error("Group detail GET error:", error);
    return NextResponse.json({ error: "그룹 상세를 불러오는데 실패했습니다" }, { status: 500 });
  }
}
