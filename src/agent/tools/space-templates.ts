// ============================================
// Bible Palace Agent Tool — 공간 템플릿
// 기억의 궁전에 사용할 공간 레이아웃 정의
// ============================================

import type { SeparatorType } from "@/types/palace";
import { FULL_APARTMENT_LOCI, APARTMENT_LOCI_10 } from "./story-generator";

// ============================================
// 인터페이스
// ============================================

export interface SpaceTemplate {
  key: string;
  name: string;
  nameEn: string;
  description: string;
  lociCount: number;
  loci: SpaceLocusInfo[];
}

export interface SpaceLocusInfo {
  index: number;
  name: string;
  nameEn: string;
  emoji: string;
  description: string;
  separatorBefore?: SeparatorType;
}

// ============================================
// 템플릿 레지스트리
// ============================================

/**
 * LocusInfo → SpaceLocusInfo 변환 헬퍼
 * (keyword, image 필드 제거 — 템플릿은 순수 공간 정보만)
 */
function toSpaceLoci(
  loci: Array<{
    index: number;
    name: string;
    nameEn: string;
    emoji: string;
    description: string;
    separatorBefore?: SeparatorType;
  }>
): SpaceLocusInfo[] {
  return loci.map((l) => ({
    index: l.index,
    name: l.name,
    nameEn: l.nameEn,
    emoji: l.emoji,
    description: l.description,
    separatorBefore: l.separatorBefore,
  }));
}

/**
 * 사전 정의된 공간 템플릿들
 */
export const SPACE_TEMPLATES: Record<string, SpaceTemplate> = {
  default_apartment_20: {
    key: "default_apartment_20",
    name: "기본 아파트 (20개)",
    nameEn: "Default Apartment (20 loci)",
    description:
      "아파트 입구부터 베란다까지 20개 지점을 순회하는 기본 기억의 궁전. " +
      "긴 구절이나 여러 절을 외울 때 적합합니다.",
    lociCount: 20,
    loci: toSpaceLoci(FULL_APARTMENT_LOCI),
  },

  default_apartment_10: {
    key: "default_apartment_10",
    name: "기본 아파트 (10개)",
    nameEn: "Default Apartment (10 loci)",
    description:
      "엘리베이터부터 베란다까지 10개 핵심 지점을 순회하는 축약 궁전. " +
      "짧은 구절(1-2절)을 외울 때 적합합니다.",
    lociCount: 10,
    loci: toSpaceLoci(APARTMENT_LOCI_10),
  },
};

// ============================================
// 공개 함수
// ============================================

/**
 * 키(key)로 공간 템플릿을 조회합니다.
 *
 * @param key - 템플릿 키 (예: "default_apartment_20")
 * @returns 해당 SpaceTemplate 또는 undefined
 */
export function getTemplate(key: string): SpaceTemplate | undefined {
  return SPACE_TEMPLATES[key];
}

/**
 * 사용 가능한 모든 템플릿 키 목록을 반환합니다.
 */
export function listTemplateKeys(): string[] {
  return Object.keys(SPACE_TEMPLATES);
}

/**
 * 템플릿에서 처음 count개의 Loci를 반환합니다.
 * 구절 세그먼트 수에 맞춰 필요한 만큼만 잘라 사용합니다.
 *
 * @param key   - 템플릿 키
 * @param count - 필요한 Loci 수
 * @returns SpaceLocusInfo 배열 (count개까지)
 *
 * @example
 * ```ts
 * // 구절이 7개 세그먼트로 나뉘었을 때
 * const loci = getTemplateLoci("default_apartment_20", 7);
 * // → 처음 7개 위치(index 0-6)만 반환
 * ```
 */
export function getTemplateLoci(
  key: string,
  count: number
): SpaceLocusInfo[] {
  const template = SPACE_TEMPLATES[key];
  if (!template) {
    // 폴백: 20개 기본 템플릿에서 가져오기
    const fallback = SPACE_TEMPLATES["default_apartment_20"];
    if (!fallback) return [];
    return fallback.loci.slice(0, count);
  }

  // count가 템플릿 Loci 수보다 크면 전체 반환
  if (count >= template.lociCount) {
    return [...template.loci];
  }

  return template.loci.slice(0, count);
}

/**
 * 세그먼트 수에 가장 적합한 템플릿을 자동 선택합니다.
 *
 * @param segmentCount - 구절 세그먼트 수
 * @returns 추천 템플릿 키
 */
export function recommendTemplate(segmentCount: number): string {
  if (segmentCount <= 10) {
    return "default_apartment_10";
  }
  return "default_apartment_20";
}
