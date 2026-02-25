// ============================================
// GET /api/search?q=사랑 — 성경 검색 API
// PostgreSQL Full-Text Search 활용
// ============================================
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/redis";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "20");

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: "검색어는 2글자 이상 입력하세요" },
      { status: 400 }
    );
  }

  try {
    const cacheKey = `search:${query}:${limit}`;

    const results = await cached(
      cacheKey,
      () =>
        prisma.verse.findMany({
          where: {
            text: { contains: query },
          },
          take: limit,
          select: {
            id: true,
            verseNum: true,
            text: true,
            chapter: {
              select: {
                chapterNum: true,
                book: {
                  select: {
                    name: true,
                    abbreviation: true,
                  },
                },
              },
            },
          },
        }),
      1800 // 30분 캐시
    );

    return NextResponse.json({
      query,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json(
      { error: "검색에 실패했습니다" },
      { status: 500 }
    );
  }
}
