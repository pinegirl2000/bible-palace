// ============================================
// Bible Palace — Group Join API
// POST: 초대 코드로 그룹 가입
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/group/[id]/join
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { inviteCode } = body;

    if (!inviteCode) {
      return NextResponse.json({ error: "초대 코드를 입력하세요" }, { status: 400 });
    }

    // 초대 코드로 그룹 찾기
    const group = await prisma.cellGroup.findUnique({
      where: { inviteCode: inviteCode.toUpperCase() },
    });

    if (!group) {
      return NextResponse.json({ error: "유효하지 않은 초대 코드입니다" }, { status: 404 });
    }

    // 이미 멤버인지 확인
    const existing = await prisma.cellGroupMember.findUnique({
      where: { groupId_userId: { groupId: group.id, userId } },
    });

    if (existing) {
      return NextResponse.json({ error: "이미 이 그룹의 멤버입니다" }, { status: 409 });
    }

    await prisma.cellGroupMember.create({
      data: {
        groupId: group.id,
        userId,
        role: "member",
      },
    });

    return NextResponse.json({
      data: { groupId: group.id, groupName: group.name },
      message: `${group.name} 그룹에 가입했습니다`,
    });
  } catch (error) {
    console.error("Group join POST error:", error);
    return NextResponse.json({ error: "그룹 가입에 실패했습니다" }, { status: 500 });
  }
}
