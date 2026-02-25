// ============================================
// Bible Palace — Group Leave API
// DELETE: 그룹 탈퇴
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/group/[id]/leave
export async function DELETE(
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

    const membership = await prisma.cellGroupMember.findUnique({
      where: { groupId_userId: { groupId: id, userId } },
    });

    if (!membership) {
      return NextResponse.json({ error: "이 그룹의 멤버가 아닙니다" }, { status: 404 });
    }

    if (membership.role === "owner") {
      return NextResponse.json({ error: "그룹 소유자는 탈퇴할 수 없습니다. 그룹을 삭제하거나 다른 멤버에게 소유권을 이전하세요." }, { status: 400 });
    }

    await prisma.cellGroupMember.delete({
      where: { id: membership.id },
    });

    return NextResponse.json({ message: "그룹에서 탈퇴했습니다" });
  } catch (error) {
    console.error("Group leave DELETE error:", error);
    return NextResponse.json({ error: "그룹 탈퇴에 실패했습니다" }, { status: 500 });
  }
}
