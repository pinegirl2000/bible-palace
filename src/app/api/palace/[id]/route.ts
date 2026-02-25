// ============================================
// Bible Palace — Palace Detail API
// GET: 궁전 상세 / DELETE: 궁전 삭제
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/palace/[id] — 궁전 상세 (loci 포함)
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

    const palace = await prisma.palace.findFirst({
      where: { id, userId },
      include: {
        loci: {
          orderBy: { locusIndex: "asc" },
        },
        palaceVerses: {
          include: {
            verse: {
              include: {
                chapter: {
                  include: { book: true },
                },
              },
            },
          },
          orderBy: { orderNum: "asc" },
        },
        reviewSchedules: true,
        _count: {
          select: { attempts: true },
        },
      },
    });

    if (!palace) {
      return NextResponse.json({ error: "궁전을 찾을 수 없습니다" }, { status: 404 });
    }

    return NextResponse.json({ data: palace });
  } catch (error) {
    console.error("Palace detail GET error:", error);
    return NextResponse.json({ error: "궁전 상세를 불러오는데 실패했습니다" }, { status: 500 });
  }
}

// DELETE /api/palace/[id] — 궁전 삭제
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

    // 소유권 확인
    const palace = await prisma.palace.findFirst({
      where: { id, userId },
    });

    if (!palace) {
      return NextResponse.json({ error: "궁전을 찾을 수 없습니다" }, { status: 404 });
    }

    await prisma.palace.delete({ where: { id } });

    return NextResponse.json({ message: "궁전이 삭제되었습니다" });
  } catch (error) {
    console.error("Palace DELETE error:", error);
    return NextResponse.json({ error: "궁전 삭제에 실패했습니다" }, { status: 500 });
  }
}
