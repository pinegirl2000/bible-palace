// ============================================
// Bible Palace — Review Attempt API
// POST: 암송 시도 제출 + SM-2 업데이트
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { attemptSubmitSchema } from "@/lib/validations";
import { calculateNextReview, scoreToQuality } from "@/agent/tools/spaced-repetition";

// POST /api/review/attempt
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const validated = attemptSubmitSchema.parse(body);

    // 1. 궁전 조회
    const palace = await prisma.palace.findFirst({
      where: { id: validated.palaceId, userId },
    });

    if (!palace) {
      return NextResponse.json({ error: "궁전을 찾을 수 없습니다" }, { status: 404 });
    }

    // 2. 점수 계산 (간단한 문자열 유사도)
    const score = calculateSimpleScore(palace.verseText, validated.userText);
    const quality = scoreToQuality(score);

    // 3. 피드백 생성
    const feedback = generateFeedback(score);

    // 4. 암송 시도 기록
    const attempt = await prisma.memorizationAttempt.create({
      data: {
        userId,
        palaceId: validated.palaceId,
        userText: validated.userText,
        score,
        quality,
        feedback,
      },
    });

    // 5. SM-2 복습 스케줄 업데이트
    const schedule = await prisma.reviewSchedule.findUnique({
      where: {
        userId_palaceId: { userId, palaceId: validated.palaceId },
      },
    });

    let nextReview;
    if (schedule) {
      const sm2Result = calculateNextReview({
        quality,
        repetitionNum: schedule.repetitionNum,
        easeFactor: schedule.easeFactor,
        intervalDays: schedule.intervalDays,
      });

      await prisma.reviewSchedule.update({
        where: { id: schedule.id },
        data: {
          repetitionNum: sm2Result.repetitionNum,
          easeFactor: sm2Result.easeFactor,
          intervalDays: sm2Result.intervalDays,
          nextReviewAt: new Date(sm2Result.nextReviewAt),
          lastReviewedAt: new Date(),
        },
      });

      nextReview = sm2Result;
    }

    return NextResponse.json({
      data: {
        attemptId: attempt.id,
        score: Math.round(score * 100),
        quality,
        feedback,
        nextReviewAt: nextReview?.nextReviewAt,
        recommendation: nextReview?.recommendation,
      },
    });
  } catch (error) {
    console.error("Review attempt POST error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "입력값이 올바르지 않습니다" }, { status: 400 });
    }
    return NextResponse.json({ error: "암송 시도 제출에 실패했습니다" }, { status: 500 });
  }
}

/** 간단한 문자열 유사도 계산 */
function calculateSimpleScore(original: string, attempt: string): number {
  const normalize = (s: string) =>
    s.replace(/\s+/g, " ").trim().toLowerCase();

  const origNorm = normalize(original);
  const attemptNorm = normalize(attempt);

  if (origNorm === attemptNorm) return 1.0;
  if (attemptNorm.length === 0) return 0.0;

  // 단어 기반 비교
  const origWords = origNorm.split(" ");
  const attemptWords = attemptNorm.split(" ");
  let matchCount = 0;

  for (const word of origWords) {
    if (attemptWords.includes(word)) {
      matchCount++;
    }
  }

  return origWords.length > 0 ? matchCount / origWords.length : 0;
}

/** 점수 기반 피드백 생성 */
function generateFeedback(score: number): string {
  if (score >= 0.95) return "완벽합니다! 🎉 구절을 정확하게 기억하고 있습니다.";
  if (score >= 0.8) return "훌륭합니다! 👏 대부분의 내용을 잘 기억하고 있습니다. 조금만 더 다듬으면 완벽해질 거예요.";
  if (score >= 0.6) return "잘 하고 있습니다! 💪 기억의 궁전을 다시 한 번 걸어보면서 빠진 부분을 보충해보세요.";
  if (score >= 0.4) return "좋은 시작입니다! 🌱 궁전의 각 지점 이미지를 더 생생하게 떠올려 보세요.";
  if (score >= 0.2) return "포기하지 마세요! 궁전을 천천히 걸으면서 각 위치의 이미지를 하나씩 연결해 보세요.";
  return "처음부터 궁전을 다시 걸어볼까요? 각 지점에서 멈추고 이미지를 선명하게 그려보세요. 🏛️";
}
