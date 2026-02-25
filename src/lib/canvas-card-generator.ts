// ============================================
// Bible Palace — 기억 카드 데이터 생성기
// FLUX 이미지 위에 한국어 텍스트를 오버레이하는
// React 컴포넌트용 데이터 구조 및 헬퍼
// ============================================

// ============================================
// 인터페이스
// ============================================

/** 카드 오버레이 텍스트 레이어 */
export interface CardTextLayer {
  /** 텍스트 내용 */
  text: string;
  /** 레이어 유형 */
  type: "verseRef" | "keyword" | "segment" | "senses" | "locusLabel";
  /** 글꼴 크기 (px) */
  fontSize: number;
  /** 글꼴 두께 */
  fontWeight: "normal" | "bold";
  /** 텍스트 색상 (CSS) */
  color: string;
  /** 배경 색상 (반투명, CSS) */
  backgroundColor: string;
  /** 세로 위치 ("top" | "center" | "bottom") */
  position: "top" | "center" | "bottom";
  /** 세로 오프셋 (px) — position 기준 추가 이동 */
  offsetY: number;
  /** 가로 정렬 */
  textAlign: "left" | "center" | "right";
  /** 좌우 패딩 (px) */
  paddingX: number;
  /** 상하 패딩 (px) */
  paddingY: number;
}

/** 완성된 기억 카드 데이터 */
export interface MemorizationCard {
  /** 고유 ID (locusIndex 기반) */
  id: string;
  /** 구절 참조 (예: "요한복음 15:5") */
  verseRef: string;
  /** 배치된 Locus 인덱스 */
  locusIndex: number;
  /** Locus 이름 (한국어) */
  locusName: string;
  /** Locus 이모지 */
  locusEmoji: string;
  /** 핵심 키워드 */
  keyword: string;
  /** 원문 세그먼트 */
  segmentText: string;
  /** 이미지 설명 (한국어) */
  imageDescription: string;
  /** 오감 묘사 */
  senses: string[];
  /** 이미지 URL (FLUX 생성 또는 Pollinations) */
  imageUrl: string;
  /** 이미지 프롬프트 (영문) */
  imagePrompt: string;
  /** 텍스트 오버레이 레이어들 */
  textLayers: CardTextLayer[];
  /** 카드 너비 (px) */
  width: number;
  /** 카드 높이 (px) */
  height: number;
}

/** 카드 스타일 프리셋 */
export interface CardStylePreset {
  name: string;
  /** 카드 너비 */
  width: number;
  /** 카드 높이 */
  height: number;
  /** 키워드 글꼴 크기 */
  keywordFontSize: number;
  /** 구절 글꼴 크기 */
  segmentFontSize: number;
  /** 참조 글꼴 크기 */
  refFontSize: number;
  /** 키워드 색상 */
  keywordColor: string;
  /** 텍스트 배경 색상 (반투명) */
  textBgColor: string;
}

// ============================================
// 프리셋
// ============================================

export const CARD_STYLE_PRESETS: Record<string, CardStylePreset> = {
  default: {
    name: "기본",
    width: 512,
    height: 512,
    keywordFontSize: 36,
    segmentFontSize: 18,
    refFontSize: 14,
    keywordColor: "#FFFFFF",
    textBgColor: "rgba(0, 0, 0, 0.55)",
  },
  compact: {
    name: "컴팩트",
    width: 400,
    height: 400,
    keywordFontSize: 28,
    segmentFontSize: 14,
    refFontSize: 12,
    keywordColor: "#FFFFFF",
    textBgColor: "rgba(0, 0, 0, 0.6)",
  },
  wide: {
    name: "와이드",
    width: 768,
    height: 432,
    keywordFontSize: 32,
    segmentFontSize: 16,
    refFontSize: 14,
    keywordColor: "#FFFDE7",
    textBgColor: "rgba(33, 33, 33, 0.5)",
  },
};

// ============================================
// 카드 데이터 생성 함수
// ============================================

/**
 * 기억 카드 데이터를 생성합니다.
 *
 * 이 함수는 Canvas 렌더링을 직접 수행하지 않고,
 * React 컴포넌트가 Canvas 또는 DOM으로 렌더링할 수 있는
 * 구조화된 데이터를 반환합니다.
 *
 * @param params   - 카드 내용 파라미터
 * @param preset   - 스타일 프리셋 키 (기본: "default")
 * @returns MemorizationCard 데이터
 *
 * @example
 * ```tsx
 * const card = generateCardData({
 *   verseRef: "요한복음 15:5",
 *   locusIndex: 0,
 *   locusName: "아파트 입구",
 *   locusEmoji: "🏢",
 *   keyword: "포도나무",
 *   segmentText: "나는 포도나무요",
 *   imageDescription: "보라색 포도가 주렁주렁 매달린 거대한 나무",
 *   senses: ["시각: 보라색", "후각: 달콤"],
 *   imageUrl: "https://image.pollinations.ai/...",
 *   imagePrompt: "A vivid grapevine..."
 * });
 *
 * // React 컴포넌트에서:
 * <MemorizationCardView card={card} />
 * ```
 */
export function generateCardData(
  params: {
    verseRef: string;
    locusIndex: number;
    locusName: string;
    locusEmoji: string;
    keyword: string;
    segmentText: string;
    imageDescription: string;
    senses: string[];
    imageUrl: string;
    imagePrompt: string;
  },
  preset: string = "default"
): MemorizationCard {
  const style = CARD_STYLE_PRESETS[preset] ?? CARD_STYLE_PRESETS["default"];

  const textLayers = buildTextLayers(params, style);

  return {
    id: `card-${params.verseRef}-locus${params.locusIndex}`,
    verseRef: params.verseRef,
    locusIndex: params.locusIndex,
    locusName: params.locusName,
    locusEmoji: params.locusEmoji,
    keyword: params.keyword,
    segmentText: params.segmentText,
    imageDescription: params.imageDescription,
    senses: params.senses,
    imageUrl: params.imageUrl,
    imagePrompt: params.imagePrompt,
    textLayers,
    width: style.width,
    height: style.height,
  };
}

/**
 * 여러 LociAssignment에서 카드 데이터를 일괄 생성합니다.
 *
 * @param assignments - LociAssignment 배열 (imageUrl이 채워져 있어야 함)
 * @param verseRef    - 구절 참조
 * @param preset      - 스타일 프리셋 키
 * @returns MemorizationCard 배열
 */
export function generateCardDataBatch(
  assignments: Array<{
    locusIndex: number;
    locusName: string;
    locusEmoji: string;
    keyword: string;
    segmentText: string;
    imageDescription: string;
    senses: string[];
    imageUrl?: string;
    imagePrompt: string;
  }>,
  verseRef: string,
  preset: string = "default"
): MemorizationCard[] {
  return assignments.map((a) =>
    generateCardData(
      {
        verseRef,
        locusIndex: a.locusIndex,
        locusName: a.locusName,
        locusEmoji: a.locusEmoji,
        keyword: a.keyword,
        segmentText: a.segmentText,
        imageDescription: a.imageDescription,
        senses: a.senses,
        imageUrl: a.imageUrl ?? "",
        imagePrompt: a.imagePrompt,
      },
      preset
    )
  );
}

// ============================================
// 내부 헬퍼
// ============================================

/**
 * 카드에 표시할 텍스트 레이어 목록을 생성합니다.
 */
function buildTextLayers(
  params: {
    verseRef: string;
    locusName: string;
    locusEmoji: string;
    keyword: string;
    segmentText: string;
    senses: string[];
  },
  style: CardStylePreset
): CardTextLayer[] {
  const layers: CardTextLayer[] = [];

  // 1. 상단: 구절 참조 + Locus 레이블
  layers.push({
    text: `${params.verseRef}`,
    type: "verseRef",
    fontSize: style.refFontSize,
    fontWeight: "normal",
    color: "#FFFFFF",
    backgroundColor: style.textBgColor,
    position: "top",
    offsetY: 0,
    textAlign: "left",
    paddingX: 12,
    paddingY: 6,
  });

  layers.push({
    text: `${params.locusEmoji} ${params.locusName}`,
    type: "locusLabel",
    fontSize: style.refFontSize,
    fontWeight: "normal",
    color: "#E0E0E0",
    backgroundColor: style.textBgColor,
    position: "top",
    offsetY: style.refFontSize + 14,
    textAlign: "left",
    paddingX: 12,
    paddingY: 4,
  });

  // 2. 중앙: 핵심 키워드 (크고 굵게)
  layers.push({
    text: params.keyword,
    type: "keyword",
    fontSize: style.keywordFontSize,
    fontWeight: "bold",
    color: style.keywordColor,
    backgroundColor: style.textBgColor,
    position: "center",
    offsetY: 0,
    textAlign: "center",
    paddingX: 20,
    paddingY: 10,
  });

  // 3. 하단: 원문 세그먼트
  layers.push({
    text: params.segmentText,
    type: "segment",
    fontSize: style.segmentFontSize,
    fontWeight: "normal",
    color: "#FFFFFF",
    backgroundColor: style.textBgColor,
    position: "bottom",
    offsetY: 0,
    textAlign: "center",
    paddingX: 16,
    paddingY: 8,
  });

  // 4. 하단 위: 오감 묘사 (있으면)
  if (params.senses.length > 0) {
    const sensesText = params.senses.slice(0, 3).join(" | ");
    layers.push({
      text: sensesText,
      type: "senses",
      fontSize: Math.max(style.refFontSize - 2, 10),
      fontWeight: "normal",
      color: "#B0BEC5",
      backgroundColor: style.textBgColor,
      position: "bottom",
      offsetY: -(style.segmentFontSize + 20),
      textAlign: "center",
      paddingX: 12,
      paddingY: 4,
    });
  }

  return layers;
}

/**
 * 카드 ID에서 Locus 인덱스를 추출합니다.
 *
 * @param cardId - 카드 ID (예: "card-요한복음 15:5-locus3")
 * @returns Locus 인덱스 또는 -1
 */
export function parseLocusIndexFromCardId(cardId: string): number {
  const match = cardId.match(/locus(\d+)$/);
  return match ? parseInt(match[1], 10) : -1;
}

/**
 * 카드 데이터를 간단한 텍스트 요약으로 변환합니다.
 * (접근성, 디버깅, 텍스트 전용 모드 등에서 사용)
 */
export function cardToTextSummary(card: MemorizationCard): string {
  return [
    `[${card.verseRef}] ${card.locusEmoji} ${card.locusName}`,
    `  키워드: ${card.keyword}`,
    `  원문: "${card.segmentText}"`,
    `  이미지: ${card.imageDescription}`,
    card.senses.length > 0 ? `  오감: ${card.senses.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
