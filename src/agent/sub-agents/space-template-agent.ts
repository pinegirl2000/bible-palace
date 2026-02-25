// ============================================
// Bible Palace Sub-Agent #1 — 공간 템플릿 에이전트
// 구절 세그먼트 수에 맞는 공간 템플릿 선택/조정
// ============================================

import {
  type SpaceTemplate,
  type SpaceLocusInfo,
  getTemplate,
  getTemplateLoci,
  recommendTemplate,
  SPACE_TEMPLATES,
} from "../tools/space-templates";

// ============================================
// 인터페이스
// ============================================

export interface SpaceTemplateAgentOptions {
  /** 특정 위치 이름 목록으로 커스텀 오버라이드 */
  customLocations?: string[];
}

// ============================================
// 메인 함수
// ============================================

/**
 * 공간 템플릿 에이전트를 실행합니다.
 *
 * 1. 지정된 templateKey에서 템플릿을 가져옵니다.
 * 2. verseSegmentCount에 맞게 Loci를 부분 집합으로 자릅니다.
 * 3. (선택) customLocations가 있으면 해당 이름으로 Loci를 오버라이드합니다.
 * 4. 완성된 SpaceTemplate을 반환합니다.
 *
 * @param templateKey        - 공간 템플릿 키 (예: "default_apartment_20")
 * @param verseSegmentCount  - 구절 분절 수 (= 필요한 Loci 수)
 * @param customLocations    - (선택) 커스텀 위치 이름 목록
 * @returns 조정된 SpaceTemplate
 *
 * @example
 * ```ts
 * const template = await runSpaceTemplateAgent(
 *   "default_apartment_20",
 *   8,
 * );
 * // → 20개 중 처음 8개 Loci만 포함된 템플릿
 * ```
 */
export async function runSpaceTemplateAgent(
  templateKey: string,
  verseSegmentCount: number,
  customLocations?: string[]
): Promise<SpaceTemplate> {
  // ── 1. 템플릿 조회 ──────────────────────────
  let resolvedKey = templateKey;

  // 키가 "auto"이면 세그먼트 수에 따라 자동 선택
  if (resolvedKey === "auto") {
    resolvedKey = recommendTemplate(verseSegmentCount);
  }

  const baseTemplate = getTemplate(resolvedKey);
  if (!baseTemplate) {
    // 알 수 없는 키 → 기본 20개 템플릿으로 폴백
    console.warn(
      `[SpaceTemplateAgent] Unknown template key "${templateKey}", falling back to default_apartment_20`
    );
    resolvedKey = "default_apartment_20";
  }

  // ── 2. Loci를 세그먼트 수에 맞게 자르기 ─────────
  const subsetLoci = getTemplateLoci(resolvedKey, verseSegmentCount);

  // ── 3. 커스텀 위치 오버라이드 ──────────────────
  let finalLoci: SpaceLocusInfo[];

  if (customLocations && customLocations.length > 0) {
    finalLoci = applyCustomLocations(subsetLoci, customLocations);
  } else {
    finalLoci = subsetLoci;
  }

  // ── 4. 감각 묘사 보강 (기본 템플릿은 이미 포함) ──
  finalLoci = enrichSensoryDescriptions(finalLoci);

  // ── 5. 최종 템플릿 조립 ─────────────────────
  const source = getTemplate(resolvedKey) ?? SPACE_TEMPLATES["default_apartment_20"];

  const result: SpaceTemplate = {
    key: resolvedKey,
    name: source?.name ?? "커스텀 공간",
    nameEn: source?.nameEn ?? "Custom Space",
    description: source?.description ?? "",
    lociCount: finalLoci.length,
    loci: finalLoci,
  };

  return result;
}

// ============================================
// 내부 헬퍼
// ============================================

/**
 * 커스텀 위치 이름을 기존 Loci에 오버라이드합니다.
 * customLocations 배열의 각 항목이 해당 인덱스의 Locus 이름을 대체합니다.
 */
function applyCustomLocations(
  baseLoci: SpaceLocusInfo[],
  customNames: string[]
): SpaceLocusInfo[] {
  // 커스텀 이름 수만큼만 Loci 생성
  const count = Math.min(customNames.length, baseLoci.length);
  const result: SpaceLocusInfo[] = [];

  for (let i = 0; i < count; i++) {
    const base = baseLoci[i];
    const customName = customNames[i].trim();

    result.push({
      ...base,
      // 인덱스는 0부터 재할당
      index: i,
      // 커스텀 이름이 제공되면 덮어쓰기
      name: customName || base.name,
      // 영문 이름은 커스텀인 경우 동일하게 (AI가 나중에 번역 가능)
      nameEn: customName ? customName : base.nameEn,
      // 설명도 커스텀이면 일반적인 묘사로 변경
      description: customName
        ? `${customName} — 오감을 동원해 이 장소를 떠올려 보세요`
        : base.description,
    });
  }

  return result;
}

/**
 * Loci의 감각 묘사가 충분한지 확인하고, 부족하면 보강합니다.
 * 현재는 기본 템플릿에 이미 묘사가 포함되어 있으므로,
 * description이 비어있는 경우에만 기본값을 채웁니다.
 */
function enrichSensoryDescriptions(
  loci: SpaceLocusInfo[]
): SpaceLocusInfo[] {
  return loci.map((locus) => {
    if (!locus.description || locus.description.trim().length === 0) {
      return {
        ...locus,
        description: `${locus.emoji} ${locus.name} — 이 장소의 냄새, 소리, 촉감을 상상해 보세요`,
      };
    }
    return locus;
  });
}

/**
 * 주어진 세그먼트 수에 대해 추천 템플릿 정보를 반환합니다.
 * (UI에서 사용자에게 템플릿 선택지를 보여줄 때 활용)
 */
export function getTemplateRecommendation(segmentCount: number): {
  recommended: string;
  alternatives: string[];
  reason: string;
} {
  const recommended = recommendTemplate(segmentCount);

  const alternatives = Object.keys(SPACE_TEMPLATES).filter(
    (k) => k !== recommended
  );

  const reason =
    segmentCount <= 10
      ? `구절이 ${segmentCount}개 세그먼트로 짧아서 10개 Loci 템플릿을 추천합니다.`
      : `구절이 ${segmentCount}개 세그먼트로 길어서 20개 Loci 템플릿을 추천합니다.`;

  return { recommended, alternatives, reason };
}
