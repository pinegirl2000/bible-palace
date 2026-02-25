// ============================================
// GET /api/verses?bookId=1&chapter=1 — 절 조회
// Redis 캐싱 적용
// ============================================
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/redis";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("bookId");
  const chapter = searchParams.get("chapter");

  if (!bookId || !chapter) {
    return NextResponse.json(
      { error: "bookId and chapter are required" },
      { status: 400 }
    );
  }

  try {
    const cacheKey = `verses:${bookId}:${chapter}`;

    const verses = await cached(
      cacheKey,
      () =>
        prisma.verse.findMany({
          where: {
            chapter: {
              bookId: parseInt(bookId),
              chapterNum: parseInt(chapter),
            },
          },
          orderBy: { verseNum: "asc" },
          select: {
            id: true,
            verseNum: true,
            text: true,
            textEn: true,
          },
        }),
      86400 // 24시간 캐시
    );

    return NextResponse.json({ verses });
  } catch (error) {
    console.error("Failed to fetch verses:", error);
    return NextResponse.json(
      { error: "Failed to fetch verses" },
      { status: 500 }
    );
  }
}
