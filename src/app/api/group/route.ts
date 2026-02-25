// ============================================
// Bible Palace — Group API Routes
// POST: 셀 그룹 생성 / GET: 사용자 그룹 목록
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { groupCreateSchema } from "@/lib/validations";
import { nanoid } from "nanoid";

// GET /api/group — 사용자가 속한 그룹 목록
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const memberships = await prisma.cellGroupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            _count: { select: { members: true } },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const groups = memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
      description: m.group.description,
      inviteCode: m.group.inviteCode,
      role: m.role,
      memberCount: m.group._count.members,
      joinedAt: m.joinedAt.toISOString(),
    }));

    return NextResponse.json({ data: groups });
  } catch (error) {
    console.error("Group GET error:", error);
    return NextResponse.json({ error: "그룹 목록을 불러오는데 실패했습니다" }, { status: 500 });
  }
}

// POST /api/group — 새 셀 그룹 생성
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const validated = groupCreateSchema.parse(body);

    const inviteCode = nanoid(8).toUpperCase();

    const group = await prisma.$transaction(async (tx) => {
      const newGroup = await tx.cellGroup.create({
        data: {
          name: validated.name,
          description: validated.description,
          inviteCode,
          ownerId: userId,
        },
      });

      // 생성자를 owner로 자동 가입
      await tx.cellGroupMember.create({
        data: {
          groupId: newGroup.id,
          userId,
          role: "owner",
        },
      });

      return newGroup;
    });

    return NextResponse.json({
      data: {
        id: group.id,
        name: group.name,
        inviteCode: group.inviteCode,
      },
      message: "셀 그룹이 생성되었습니다",
    }, { status: 201 });
  } catch (error) {
    console.error("Group POST error:", error);
    return NextResponse.json({ error: "그룹 생성에 실패했습니다" }, { status: 500 });
  }
}
