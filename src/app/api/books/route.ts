// ============================================
// GET /api/books — 성경 66권 목록 조회
// Redis 캐싱으로 초고속 응답
// ============================================
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/redis";

export async function GET() {
  try {
    const books = await cached(
      "books:all",
      () =>
        prisma.book.findMany({
          orderBy: { orderNum: "asc" },
          select: {
            id: true,
            name: true,
            nameEn: true,
            abbreviation: true,
            testament: true,
            orderNum: true,
            chapterCount: true,
          },
        }),
      86400 // 24시간 캐시 (성경 목록은 변하지 않음)
    );

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
