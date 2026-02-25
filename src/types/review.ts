// ============================================
// Bible Palace — 복습/테스트 관련 타입 정의
// ============================================

/** 복습 일정 데이터 (DB 기반) */
export interface ReviewScheduleData {
  id: string;
  palaceId: string;
  palaceName: string;
  verseRef: string;
  difficulty: "easy" | "moderate" | "hard";
  repetitionNum: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: string;       // ISO 8601
  lastReviewedAt?: string;
  isOverdue: boolean;
}

/** 복습 항목 */
export interface ReviewItem {
  reviewNumber: number;
  date: string;
  daysAfterStart: number;
  recommendation: string;
  completed: boolean;
  score?: number;
}

/** 암송 시도 결과 */
export interface MemorizationAttemptResult {
  id: string;
  palaceId: string;
  userText: string;
  score: number;              // 0.0 - 1.0
  quality: number;            // SM-2 quality 0-5
  matchedSegments: boolean[]; // 각 세그먼트 매칭 여부
  missingKeywords: string[];  // 놓친 키워드
  feedback: string;           // 한국어 피드백
  nextReviewAt: string;       // 다음 복습일
  newBadges?: BadgeInfo[];    // 새로 획득한 배지
  createdAt: Date;
}

/** 배지 정보 (간략) */
export interface BadgeInfo {
  id: string;
  name: string;
  iconEmoji: string;
  description: string;
}

/** 사용자 복습 통계 */
export interface ReviewStats {
  totalPalaces: number;
  totalMemorized: number;     // score >= 0.8 인 궁전 수
  currentStreak: number;      // 연속 복습 일수
  longestStreak: number;
  totalAttempts: number;
  averageScore: number;
  upcomingReviews: number;    // 오늘/내일 예정 복습 수
  todayReviews: ReviewScheduleData[];
}

/** 힌트 데이터 */
export interface HintData {
  locusIndex: number;
  locusName: string;
  locusEmoji: string;
  keyword: string;
  imageDescription: string;
  revealed: boolean;
}
