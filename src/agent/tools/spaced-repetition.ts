// ============================================
// Bible Palace Agent Tool — 간격 반복 스케줄러
// SM-2 알고리즘 (에빙하우스 망각곡선 기반)
// ============================================

export interface SM2Input {
  quality: number;           // 0-5 (0=완전 블랭크, 5=완벽한 회상)
  repetitionNum: number;     // 현재 반복 횟수
  easeFactor: number;        // 현재 난이도 계수 (기본 2.5)
  intervalDays: number;      // 현재 간격(일)
}

export interface SM2Result {
  repetitionNum: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: string;      // ISO 8601
  recommendation: string;    // 한국어 안내 메시지
}

export interface ReviewSchedule {
  verseRef: string;
  difficulty: "easy" | "moderate" | "hard";
  startDate: string;
  reviews: Array<{
    reviewNumber: number;
    date: string;
    daysAfterStart: number;
    recommendation: string;
  }>;
}

/**
 * SM-2 간격 반복 알고리즘
 * 에빙하우스 망각곡선에 기반하여 최적 복습 시점을 계산
 */
export function calculateNextReview(input: SM2Input): SM2Result {
  const { quality, repetitionNum, easeFactor, intervalDays } = input;

  // 새 난이도 계수 계산
  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEF = Math.max(1.3, newEF);

  let newInterval: number;
  let newRepetition: number;
  let recommendation: string;

  if (quality < 3) {
    // 회상 실패 → 처음부터 다시
    newRepetition = 0;
    newInterval = 1;
    recommendation = "회상이 어려웠습니다. 궁전을 처음부터 천천히 다시 걸어보세요. 이미지를 더 생생하게 만들어 봅시다.";
  } else {
    newRepetition = repetitionNum + 1;

    // 에빙하우스 초기 간격 → SM-2 동적 간격
    if (newRepetition === 1) {
      newInterval = 1;
      recommendation = "첫 복습! 궁전을 걸으며 각 지점의 이미지를 선명하게 떠올려 보세요.";
    } else if (newRepetition === 2) {
      newInterval = 3;
      recommendation = "3일차 복습입니다. 이미지가 흐려지기 전에 궁전을 방문하세요.";
    } else if (newRepetition === 3) {
      newInterval = 7;
      recommendation = "일주일차! 궁전 속 이야기를 처음부터 끝까지 떠올려 보세요.";
    } else if (newRepetition === 4) {
      newInterval = 14;
      recommendation = "2주차입니다. 이제 궁전 없이 구절을 떠올려 보세요.";
    } else if (newRepetition === 5) {
      newInterval = 30;
      recommendation = "한 달차! 장기 기억으로 자리잡고 있습니다. 필사도 해보세요.";
    } else {
      newInterval = Math.round(intervalDays * newEF);
      recommendation = `${newInterval}일 후 복습합니다. 이 구절은 거의 완벽하게 기억되고 있습니다!`;
    }

    // 품질에 따른 추가 안내
    if (quality === 3) {
      recommendation += " (힌트: 이미지를 더 과장되게 만들면 기억에 도움이 됩니다)";
    } else if (quality === 5) {
      recommendation += " 완벽합니다! 🎉";
    }
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);

  return {
    repetitionNum: newRepetition,
    easeFactor: Math.round(newEF * 100) / 100,
    intervalDays: newInterval,
    nextReviewAt: nextDate.toISOString().split("T")[0],
    recommendation,
  };
}

/**
 * 복습 세션 점수(0.0~1.0)를 SM-2 품질(0~5)로 변환
 */
export function scoreToQuality(score: number): number {
  return Math.round(Math.min(1, Math.max(0, score)) * 5);
}

/**
 * 구절에 대한 전체 복습 스케줄 생성
 */
export function generateReviewSchedule(
  verseRef: string,
  difficulty: "easy" | "moderate" | "hard",
  startDate: string
): ReviewSchedule {
  const intervals: Record<string, number[]> = {
    easy: [1, 3, 7, 14, 30, 60],
    moderate: [1, 2, 5, 10, 20, 40],
    hard: [1, 1, 3, 5, 10, 20, 30],
  };

  const recommendations: Record<string, string[]> = {
    easy: [
      "궁전을 빠르게 걸어보세요",
      "이미지만 떠올려 보세요",
      "구절을 소리 내어 읽어보세요",
      "필사해 보세요",
      "다른 사람에게 설명해 보세요",
      "자연스럽게 떠오르면 성공! 🎉",
    ],
    moderate: [
      "궁전을 천천히 걸어보세요",
      "각 지점 이미지를 선명히 하세요",
      "이야기 연결을 다시 확인하세요",
      "힌트 없이 시도하세요",
      "필사와 함께 복습하세요",
      "완벽에 가까워지고 있습니다!",
    ],
    hard: [
      "궁전을 아주 천천히 걸으세요",
      "이미지를 더 강렬하게 만드세요",
      "3개씩 끊어 복습하세요",
      "이야기를 소리 내어 말하세요",
      "한 절씩 필사하세요",
      "점점 좋아지고 있습니다!",
      "장기 기억으로 전환 중입니다 🎉",
    ],
  };

  const schedule = intervals[difficulty];
  const msgs = recommendations[difficulty];

  return {
    verseRef,
    difficulty,
    startDate,
    reviews: schedule.map((days, idx) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + days);
      return {
        reviewNumber: idx + 1,
        date: date.toISOString().split("T")[0],
        daysAfterStart: days,
        recommendation: msgs[idx] || "꾸준히 복습하세요!",
      };
    }),
  };
}
