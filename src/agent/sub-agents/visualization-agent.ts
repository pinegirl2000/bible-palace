// ============================================
// Bible Palace Sub-Agent #2 — 시각화 에이전트
// 구절 세그먼트 × Loci → 이미지 프롬프트 + 배치
// ============================================

import type { LociAssignment } from "@/types/palace";
import type { ImageStyle } from "../tools/image-prompt-generator";
import type { SpaceLocusInfo } from "../tools/space-templates";
import type { VerseSegment } from "../tools/keyword-extractor";

import { findKnownKeywords } from "../tools/keyword-extractor";
import {
  generateImagePrompt,
  type ImagePromptResult,
} from "../tools/image-prompt-generator";

// ============================================
// 인터페이스
// ============================================

export interface VisualizationResult {
  /** Loci에 배치된 구절 세그먼트 (이미지 프롬프트 포함) */
  assignments: LociAssignment[];
  /** 각 위치별 이미지 프롬프트 정보 */
  imagePrompts: Array<{
    locusIndex: number;
    prompt: string;
    negativePrompt: string;
  }>;
}

export interface VisualizationOptions {
  /** 구절 참조 (예: "요한복음 15:5") */
  verseRef?: string;
  /** 전체 구절 텍스트 (키워드 사전 매칭에 사용) */
  fullVerseText?: string;
}

// ============================================
// 메인 함수
// ============================================

/**
 * 시각화 에이전트를 실행합니다.
 *
 * 1. 세그먼트를 Loci에 순차적으로 매칭합니다.
 * 2. 기존 키워드 사전에서 알려진 이미지를 검색합니다.
 * 3. 각 세그먼트에 대한 이미지 프롬프트를 생성합니다.
 * 4. LociAssignment 배열과 이미지 프롬프트를 반환합니다.
 *
 * @param segments   - 구절 세그먼트 배열 (keyword-extractor 결과)
 * @param loci       - 공간 Loci 배열 (space-templates 결과)
 * @param imageStyle - 이미지 스타일 프리셋
 * @param options    - 추가 옵션 (verseRef 등)
 * @returns VisualizationResult
 *
 * @example
 * ```ts
 * const result = await runVisualizationAgent(
 *   segments,       // keyword-extractor에서 나온 세그먼트
 *   loci,           // space-template-agent에서 나온 Loci
 *   "watercolor",   // 이미지 스타일
 *   { verseRef: "요한복음 15:5", fullVerseText: "나는 포도나무요..." }
 * );
 * ```
 */
export async function runVisualizationAgent(
  segments: VerseSegment[],
  loci: SpaceLocusInfo[],
  imageStyle: ImageStyle,
  options?: VisualizationOptions
): Promise<VisualizationResult> {
  const verseRef = options?.verseRef ?? "";
  const fullVerseText = options?.fullVerseText ?? "";

  // ── 1. 알려진 키워드 사전 매칭 ──────────────────
  const knownKeywords = fullVerseText
    ? findKnownKeywords(fullVerseText)
    : [];

  // keyword → image 매핑 (빠른 조회용)
  const knownKeywordMap = new Map(
    knownKeywords.map((k) => [k.word, k.data])
  );

  // ── 2. 세그먼트 ↔ Loci 매칭 ──────────────────
  const matchCount = Math.min(segments.length, loci.length);
  const assignments: LociAssignment[] = [];
  const imagePrompts: VisualizationResult["imagePrompts"] = [];

  for (let i = 0; i < matchCount; i++) {
    const segment = segments[i];
    const locus = loci[i];

    // 알려진 키워드 사전에서 이미지 찾기
    const knownData = knownKeywordMap.get(segment.keyword);

    // 이미지 설명: 사전에 있으면 사전 값, 없으면 세그먼트의 image 필드
    const imageDescription = knownData?.image ?? segment.image;

    // 오감 묘사: 사전에 있으면 사전 값과 세그먼트 값 병합
    const senses = mergeSenses(
      knownData?.senses ?? [],
      segment.senses
    );

    // ── 3. 이미지 프롬프트 생성 ──────────────────
    const promptResult: ImagePromptResult = generateImagePrompt(
      segment.keyword,
      verseRef,
      locus.nameEn,
      imageDescription,
      imageStyle
    );

    // ── 4. LociAssignment 조립 ──────────────────
    const assignment: LociAssignment = {
      locusIndex: locus.index,
      locusName: locus.name,
      locusEmoji: locus.emoji,
      segmentText: segment.text,
      keyword: segment.keyword,
      imageDescription,
      imagePrompt: promptResult.prompt,
      senses,
      // imageUrl은 이미지 생성 후 채워짐 (여기서는 미정)
    };

    assignments.push(assignment);

    imagePrompts.push({
      locusIndex: locus.index,
      prompt: promptResult.prompt,
      negativePrompt: promptResult.negativePrompt,
    });
  }

  return {
    assignments,
    imagePrompts,
  };
}

// ============================================
// 내부 헬퍼
// ============================================

/**
 * 두 개의 오감 묘사 배열을 병합합니다.
 * 중복을 제거하고, 사전 묘사(primary)가 우선합니다.
 */
function mergeSenses(primary: string[], secondary: string[]): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const sense of [...primary, ...secondary]) {
    // 감각 유형 추출 (예: "시각: 보라색" → "시각")
    const senseType = sense.split(":")[0]?.trim();
    if (senseType && !seen.has(senseType)) {
      seen.add(senseType);
      merged.push(sense);
    }
  }

  return merged;
}

/**
 * 이미지 프롬프트 결과에서 요약 정보를 추출합니다.
 * (디버깅/로깅 용도)
 */
export function summarizeVisualization(
  result: VisualizationResult
): string {
  const lines = result.assignments.map((a) => {
    const sensesStr =
      a.senses.length > 0 ? ` [${a.senses.join(", ")}]` : "";
    return `  ${a.locusEmoji} ${a.locusName} (${a.locusIndex}): "${a.keyword}" — ${a.imageDescription}${sensesStr}`;
  });

  return [
    `시각화 결과 (${result.assignments.length}개 배치):`,
    ...lines,
    `이미지 프롬프트: ${result.imagePrompts.length}개 생성됨`,
  ].join("\n");
}
