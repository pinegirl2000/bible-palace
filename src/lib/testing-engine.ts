// ============================================
// Bible Palace — Testing Engine
// 암송 시도 평가 및 힌트 시스템
// ============================================

import { splitVerseIntoSegments } from "@/agent/tools/keyword-extractor";
import { scoreToQuality } from "@/agent/tools/spaced-repetition";

// ============================================
// 인터페이스 정의
// ============================================

/** 암송 시도 평가 결과 */
export interface AttemptEvaluation {
  score: number;              // 0.0 - 1.0
  quality: number;            // SM-2 quality 0-5
  matchedSegments: boolean[]; // 각 세그먼트 매칭 여부
  missingKeywords: string[];  // 놓친 키워드
  feedback: string;           // 한국어 피드백
  details: {
    totalSegments: number;
    matchedCount: number;
    partialMatches: number;
  };
}

/** 힌트 대상 Locus 정보 */
export interface HintLocus {
  locusIndex: number;
  locusName: string;
  emoji: string;
  keyword: string;
  imageDescription: string;
}

/** 힌트 결과 */
export interface HintResult {
  hint: string;
  locusName: string;
  emoji: string;
  locusIndex: number;
}

// ============================================
// 레벤슈타인 거리 (단순 문자열 유사도)
// ============================================

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  // 빈 문자열 처리
  if (m === 0) return n;
  if (n === 0) return m;

  // DP 테이블
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => 0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // 삭제
        dp[i][j - 1] + 1,      // 삽입
        dp[i - 1][j - 1] + cost // 대체
      );
    }
  }

  return dp[m][n];
}

/**
 * 두 문자열 간 유사도 (0.0 ~ 1.0)
 * Levenshtein 거리 기반
 */
function stringSimilarity(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) return 1.0;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(a, b);
  return 1.0 - dist / maxLen;
}

// ============================================
// 텍스트 정규화
// ============================================

/**
 * 비교를 위한 텍스트 정규화
 * - 공백 통일
 * - 구두점 제거
 * - 소문자(영어) 처리
 */
function normalizeText(text: string): string {
  return text
    .replace(/[.,;:!?'"()[\]{}—–\-…·「」『』""'']/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// ============================================
// 세그먼트 비교
// ============================================

/** 매칭 임계값 */
const MATCH_THRESHOLD = 0.65;      // 세그먼트 일치 판정
const PARTIAL_THRESHOLD = 0.40;    // 부분 일치 판정

interface SegmentMatchResult {
  matched: boolean;
  partial: boolean;
  similarity: number;
}

/**
 * 원본 세그먼트와 시도 텍스트에서 가장 유사한 부분을 찾아 비교
 */
function matchSegment(
  originalSegment: string,
  attemptText: string
): SegmentMatchResult {
  const normOriginal = normalizeText(originalSegment);
  const normAttempt = normalizeText(attemptText);

  if (normOriginal.length === 0) {
    return { matched: true, partial: false, similarity: 1.0 };
  }

  // 전체 시도 텍스트에서 세그먼트 검색
  // 1. 전체 유사도 확인
  const fullSim = stringSimilarity(normOriginal, normAttempt);
  if (fullSim >= MATCH_THRESHOLD) {
    return { matched: true, partial: false, similarity: fullSim };
  }

  // 2. 슬라이딩 윈도우로 부분 매칭
  const segLen = normOriginal.length;
  const windowSize = Math.min(segLen + 10, normAttempt.length);
  let bestSim = 0;

  for (let start = 0; start <= normAttempt.length - Math.max(1, segLen - 10); start++) {
    const window = normAttempt.substring(start, start + windowSize);
    const sim = stringSimilarity(normOriginal, window);
    if (sim > bestSim) {
      bestSim = sim;
    }
    if (bestSim >= MATCH_THRESHOLD) break;
  }

  return {
    matched: bestSim >= MATCH_THRESHOLD,
    partial: bestSim >= PARTIAL_THRESHOLD && bestSim < MATCH_THRESHOLD,
    similarity: bestSim,
  };
}

// ============================================
// 키워드 확인
// ============================================

function checkKeywords(
  keywords: string[],
  attemptText: string
): string[] {
  const normAttempt = normalizeText(attemptText);
  const missing: string[] = [];

  for (const kw of keywords) {
    const normKw = normalizeText(kw);
    if (normKw.length === 0) continue;

    // 정확한 포함 확인
    if (normAttempt.includes(normKw)) {
      continue;
    }

    // 유사도 기반 확인 (오타 허용)
    let found = false;
    const words = normAttempt.split(" ");
    for (const word of words) {
      if (stringSimilarity(normKw, word) >= 0.7) {
        found = true;
        break;
      }
    }

    if (!found) {
      missing.push(kw);
    }
  }

  return missing;
}

// ============================================
// 피드백 생성 (한국어)
// ============================================

function generateFeedback(
  score: number,
  matchedCount: number,
  totalSegments: number,
  partialMatches: number,
  missingKeywords: string[]
): string {
  const parts: string[] = [];

  // 점수대별 주요 피드백
  if (score >= 0.95) {
    parts.push("완벽에 가까운 암송입니다! 놀랍습니다.");
  } else if (score >= 0.8) {
    parts.push("아주 잘 기억하고 있습니다! 거의 완벽합니다.");
  } else if (score >= 0.6) {
    parts.push("좋은 시도입니다! 대부분 기억하고 있지만 몇 부분을 더 연습하면 좋겠습니다.");
  } else if (score >= 0.4) {
    parts.push("절반 정도 기억하고 있습니다. 궁전을 다시 천천히 걸어보세요.");
  } else if (score >= 0.2) {
    parts.push("아직 많은 부분이 빠져 있습니다. 궁전 이미지를 더 생생하게 떠올려 봅시다.");
  } else {
    parts.push("처음부터 다시 궁전을 걸어보는 것을 추천합니다. 각 이미지를 선명하게 만들어 보세요.");
  }

  // 세그먼트 정보
  parts.push(`(${totalSegments}개 구절 중 ${matchedCount}개 일치${partialMatches > 0 ? `, ${partialMatches}개 부분 일치` : ""})`);

  // 놓친 키워드 안내
  if (missingKeywords.length > 0 && missingKeywords.length <= 5) {
    parts.push(`놓친 키워드: ${missingKeywords.map(k => `"${k}"`).join(", ")}`);
    parts.push("이 키워드들의 이미지를 더 강렬하게 만들어 보세요.");
  } else if (missingKeywords.length > 5) {
    const shown = missingKeywords.slice(0, 3).map(k => `"${k}"`).join(", ");
    parts.push(`놓친 키워드: ${shown} 외 ${missingKeywords.length - 3}개`);
    parts.push("궁전을 처음부터 천천히 다시 걸으며 각 이미지를 확인해 보세요.");
  }

  return parts.join(" ");
}

// ============================================
// 메인 평가 함수
// ============================================

/**
 * 사용자의 암송 시도를 원본 구절과 비교하여 평가합니다.
 *
 * @param originalText - 원본 성경 구절 텍스트
 * @param attemptText - 사용자가 입력한 텍스트
 * @param keywords - (선택) 확인할 핵심 키워드 목록
 * @returns AttemptEvaluation - 평가 결과
 */
export function evaluateAttempt(
  originalText: string,
  attemptText: string,
  keywords?: string[]
): AttemptEvaluation {
  // 세그먼트 분리
  const segments = splitVerseIntoSegments(originalText);
  const totalSegments = segments.length;

  // 빈 시도 처리
  if (normalizeText(attemptText).length === 0) {
    return {
      score: 0,
      quality: 0,
      matchedSegments: segments.map(() => false),
      missingKeywords: keywords ?? [],
      feedback: "텍스트가 입력되지 않았습니다. 궁전의 첫 번째 장소부터 떠올려 보세요.",
      details: {
        totalSegments,
        matchedCount: 0,
        partialMatches: 0,
      },
    };
  }

  // 각 세그먼트 비교
  const matchResults = segments.map(seg => matchSegment(seg, attemptText));
  const matchedSegments = matchResults.map(r => r.matched);
  const matchedCount = matchResults.filter(r => r.matched).length;
  const partialMatches = matchResults.filter(r => r.partial).length;

  // 점수 계산: 완전 일치 1.0, 부분 일치 0.4, 불일치 0.0
  const rawScore = totalSegments > 0
    ? matchResults.reduce((sum, r) => {
        if (r.matched) return sum + 1.0;
        if (r.partial) return sum + 0.4;
        return sum;
      }, 0) / totalSegments
    : 0;

  // 전체 텍스트 유사도로 보정 (30% 반영)
  const overallSim = stringSimilarity(
    normalizeText(originalText),
    normalizeText(attemptText)
  );
  const score = Math.min(1.0, rawScore * 0.7 + overallSim * 0.3);
  const roundedScore = Math.round(score * 100) / 100;

  // SM-2 품질 변환
  const quality = scoreToQuality(roundedScore);

  // 키워드 확인
  const missingKeywords = keywords
    ? checkKeywords(keywords, attemptText)
    : [];

  // 피드백 생성
  const feedback = generateFeedback(
    roundedScore,
    matchedCount,
    totalSegments,
    partialMatches,
    missingKeywords
  );

  return {
    score: roundedScore,
    quality,
    matchedSegments,
    missingKeywords,
    feedback,
    details: {
      totalSegments,
      matchedCount,
      partialMatches,
    },
  };
}

// ============================================
// 힌트 시스템
// ============================================

/**
 * 다음 힌트를 반환합니다.
 *
 * @param lociAssignments - Loci 배치 정보 배열
 * @param revealedCount - 이미 공개된 힌트 수
 * @returns 다음 힌트 정보 또는 null (모두 공개된 경우)
 */
export function getHint(
  lociAssignments: HintLocus[],
  revealedCount: number
): HintResult | null {
  if (revealedCount >= lociAssignments.length) {
    return null;
  }

  const locus = lociAssignments[revealedCount];
  return {
    hint: `${locus.emoji} ${locus.locusName}에서 "${locus.keyword}" — ${locus.imageDescription}`,
    locusName: locus.locusName,
    emoji: locus.emoji,
    locusIndex: locus.locusIndex,
  };
}
