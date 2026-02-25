// ============================================
// Bible Palace — Palace API Routes
// POST: 새 궁전 생성 (방/물건 기반) / GET: 사용자 궁전 목록
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRoomById } from "@/data/rooms";

// ── Types for the new request format ──────────

interface AssignmentInput {
  roomId: string;
  objectId: string;
  objectName: string;
  verseRef: string;
  verseText: string;
  imageUrl: string;
}

interface PalaceCreateBody {
  name: string;
  templateId?: string;
  assignments: AssignmentInput[];
}

// GET /api/palace — 사용자의 궁전 목록
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const palaces = await prisma.palace.findMany({
      where: { userId },
      include: {
        loci: {
          orderBy: { locusIndex: "asc" },
          select: {
            locusIndex: true,
            locusName: true,
            keyword: true,
            imageUrl: true,
          },
        },
        reviewSchedules: {
          select: {
            nextReviewAt: true,
            repetitionNum: true,
            difficulty: true,
          },
        },
        _count: {
          select: { attempts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: palaces });
  } catch (error) {
    console.error("Palace GET error:", error);
    return NextResponse.json({ error: "궁전 목록을 불러오는데 실패했습니다" }, { status: 500 });
  }
}

// POST /api/palace — 새 궁전 생성 (방/물건 기반)
export async function POST(request: NextRequest) {
  try {
    // 1. 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body: PalaceCreateBody = await request.json();

    // 2. 기본 검증
    if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
      return NextResponse.json({ error: "궁전 이름을 입력하세요" }, { status: 400 });
    }
    if (!Array.isArray(body.assignments) || body.assignments.length === 0) {
      return NextResponse.json({ error: "최소 1개의 구절을 배치하세요" }, { status: 400 });
    }

    // 3. verseRef 요약 생성 — "마태복음 6:33 외 3건" 형태
    const uniqueRefs = [...new Set(body.assignments.map((a) => a.verseRef))];
    let combinedVerseRef: string;
    if (uniqueRefs.length === 1) {
      combinedVerseRef = uniqueRefs[0];
    } else {
      combinedVerseRef = `${uniqueRefs[0]} 외 ${uniqueRefs.length - 1}건`;
    }

    // 4. verseText 합치기
    const combinedVerseText = body.assignments
      .map((a) => `[${a.verseRef}] ${a.verseText}`)
      .join("\n");

    // 5. 궁전 기본 정보 생성
    const palace = await prisma.palace.create({
      data: {
        userId,
        name: body.name.trim(),
        verseRef: combinedVerseRef,
        verseText: combinedVerseText,
        templateKey: body.templateId || "apartment",
        imageStyle: "flux",
      },
    });

    // 6. 각 assignment에 대해 PalaceLocus 생성
    const lociData = body.assignments.map((a, index) => {
      // 방 이름 조회 — rooms 데이터에서 찾기
      const room = getRoomById(a.roomId);
      const roomName = room ? room.name : a.roomId;
      const locusName = `${roomName} > ${a.objectName}`;

      return {
        palaceId: palace.id,
        locusIndex: index,
        locusName,
        segmentText: a.verseText,
        keyword: a.objectName,
        imageUrl: a.imageUrl,
      };
    });

    await prisma.palaceLocus.createMany({
      data: lociData,
    });

    // 7. 초기 복습 스케줄 생성 (SM-2 초기값)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.reviewSchedule.create({
      data: {
        userId,
        palaceId: palace.id,
        difficulty: "moderate",
        nextReviewAt: tomorrow,
      },
    });

    return NextResponse.json(
      {
        data: { id: palace.id },
        message: "궁전이 생성되었습니다.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Palace POST error:", error);
    return NextResponse.json({ error: "궁전 생성에 실패했습니다" }, { status: 500 });
  }
}
