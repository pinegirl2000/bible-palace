// ============================================
// Bible Palace Agent Tool — 키워드 추출기
// 성경 구절 → 구체적 시각 이미지 키워드
// ============================================

export interface VerseSegment {
  text: string;
  keyword: string;
  image: string;
  senses: string[];
  locusIndex?: number;
}

export interface KeywordResult {
  verseRef: string;
  fullText: string;
  segments: VerseSegment[];
  theme: string;
  emotionalTone: string;
}

// 성경 키워드 → 구체적 이미지 매핑 (기본 사전)
const KEYWORD_IMAGE_MAP: Record<string, { image: string; emoji: string; senses: string[] }> = {
  // 자연/식물
  "포도나무": { image: "보라색 포도가 주렁주렁 매달린 거대한 나무", emoji: "🍇", senses: ["시각: 보라색", "후각: 달콤", "촉각: 거친 줄기"] },
  "양": { image: "하얀 털 복슬복슬한 양 떼", emoji: "🐑", senses: ["시각: 흰색 양", "촉각: 부드러운 털", "청각: 메에~"] },
  "목자": { image: "긴 지팡이 든 목자", emoji: "🧑‍🌾", senses: ["시각: 지팡이", "청각: 호루라기"] },
  "물": { image: "맑고 반짝이는 시냇물", emoji: "💧", senses: ["시각: 투명한 물", "청각: 졸졸", "촉각: 차가움"] },
  "빛": { image: "눈부시게 빛나는 황금빛 광선", emoji: "✨", senses: ["시각: 황금빛", "촉각: 따뜻함"] },
  "길": { image: "뻗어나가는 돌길", emoji: "🛤️", senses: ["시각: 돌길", "촉각: 딱딱한 돌", "청각: 발소리"] },
  "문": { image: "거대한 아치형 나무문", emoji: "🚪", senses: ["시각: 아치형", "촉각: 나무 질감", "청각: 삐걱"] },
  "바위": { image: "거대한 화강암 바위", emoji: "🪨", senses: ["시각: 회색", "촉각: 단단하고 차가움"] },
  "불": { image: "타오르는 주홍색 불꽃", emoji: "🔥", senses: ["시각: 주홍색", "촉각: 뜨거움", "청각: 타닥타닥"] },
  "바람": { image: "머리카락을 휘날리는 강한 바람", emoji: "🌬️", senses: ["촉각: 시원함", "청각: 쉬이~"] },

  // 추상 개념 → 구체적 이미지
  "사랑": { image: "심장 모양의 빛나는 루비 보석", emoji: "❤️", senses: ["시각: 붉은 빛", "촉각: 따뜻한 온기"] },
  "진리": { image: "환하게 빛나는 황금 등불", emoji: "💡", senses: ["시각: 밝은 빛", "촉각: 따뜻함"] },
  "믿음": { image: "흔들림 없는 닻", emoji: "⚓", senses: ["시각: 금속 닻", "촉각: 무겁고 단단"] },
  "소망": { image: "떠오르는 새벽 태양", emoji: "🌅", senses: ["시각: 주황-금색", "촉각: 점점 따뜻해짐"] },
  "평안": { image: "잔잔한 호수 위 작은 배", emoji: "⛵", senses: ["시각: 고요한 수면", "청각: 물결 찰랑"] },
  "은혜": { image: "하늘에서 내리는 금빛 비", emoji: "🌧️", senses: ["시각: 금빛 물방울", "촉각: 부드러운 빗방울"] },
  "구원": { image: "절벽에서 뻗어온 밧줄", emoji: "🪢", senses: ["시각: 굵은 밧줄", "촉각: 거친 질감"] },
  "죄": { image: "무거운 검은 쇠사슬", emoji: "⛓️", senses: ["시각: 검은색", "촉각: 차갑고 무거움", "청각: 철컹"] },
  "영생": { image: "시들지 않는 황금빛 나무", emoji: "🌳", senses: ["시각: 황금 잎", "촉각: 생명의 온기"] },
  "십자가": { image: "언덕 위 빛나는 나무 십자가", emoji: "✝️", senses: ["시각: 빛줄기", "촉각: 거친 나무"] },
  "하나님": { image: "구름 위에서 내려오는 찬란한 빛", emoji: "☁️", senses: ["시각: 눈부신 빛", "청각: 웅장한 울림"] },
  "예수": { image: "빛나는 흰 옷 입은 인물", emoji: "🕊️", senses: ["시각: 눈부신 흰빛", "촉각: 평안한 온기"] },
  "성령": { image: "하늘에서 내려오는 비둘기와 불꽃", emoji: "🔥", senses: ["시각: 비둘기+불꽃", "청각: 바람 소리"] },
};

/**
 * 구절 텍스트에서 알려진 키워드를 찾아 이미지 매핑
 */
export function findKnownKeywords(text: string): Array<{ word: string; data: typeof KEYWORD_IMAGE_MAP[string] }> {
  const found: Array<{ word: string; data: typeof KEYWORD_IMAGE_MAP[string] }> = [];
  for (const [keyword, data] of Object.entries(KEYWORD_IMAGE_MAP)) {
    if (text.includes(keyword)) {
      found.push({ word: keyword, data });
    }
  }
  return found;
}

/**
 * 구절을 의미 단위로 분절하는 간단한 규칙 기반 분리기
 * (AI 에이전트가 더 정교한 분절을 수행)
 */
export function splitVerseIntoSegments(text: string): string[] {
  // 쉼표, 마침표, 세미콜론, 접속사 기준 분리
  const delimiters = /[,;.]\s|(?:\s+(?:그러나|그러므로|또한|그리고|이는|곧|너희|나는|내가|주|그|이)\s)/g;
  const segments = text.split(delimiters).filter(s => s.trim().length > 0);
  return segments.map(s => s.trim());
}

/**
 * 키워드 이미지 사전 전체 반환 (에이전트 도구용)
 */
export function getKeywordDictionary(): typeof KEYWORD_IMAGE_MAP {
  return KEYWORD_IMAGE_MAP;
}
