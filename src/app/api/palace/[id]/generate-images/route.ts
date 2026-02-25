// ============================================
// Bible Palace — Image Generation API
// POST: 궁전 loci에 대한 이미지 생성 트리거
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/palace/[id]/generate-images
export async function POST(
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
          where: {
            imagePrompt: { not: null },
            imageUrl: null, // 아직 이미지가 없는 loci만
          },
          orderBy: { locusIndex: "asc" },
        },
      },
    });

    if (!palace) {
      return NextResponse.json({ error: "궁전을 찾을 수 없습니다" }, { status: 404 });
    }

    if (palace.loci.length === 0) {
      return NextResponse.json({ message: "생성할 이미지가 없습니다" });
    }

    // 비동기로 이미지 생성 (fire-and-forget)
    // 실제 이미지 생성은 image-service.ts의 generateImage 사용
    const pendingLoci = palace.loci.map((locus) => ({
      locusId: locus.id,
      locusIndex: locus.locusIndex,
      prompt: locus.imagePrompt!,
    }));

    // 이미지 생성을 백그라운드로 실행
    generateImagesInBackground(pendingLoci).catch(console.error);

    return NextResponse.json({
      message: `${pendingLoci.length}개의 이미지 생성이 시작되었습니다`,
      data: { pending: pendingLoci.length },
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ error: "이미지 생성에 실패했습니다" }, { status: 500 });
  }
}

async function generateImagesInBackground(
  loci: Array<{ locusId: string; locusIndex: number; prompt: string }>
) {
  for (const locus of loci) {
    try {
      // Pollinations.ai URL (무료, 즉시 사용 가능)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(locus.prompt)}?width=512&height=512&model=flux&nologo=true`;

      await prisma.palaceLocus.update({
        where: { id: locus.locusId },
        data: { imageUrl },
      });
    } catch (error) {
      console.error(`Locus ${locus.locusIndex} image gen failed:`, error);
    }
  }
}
