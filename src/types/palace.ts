// ============================================
// Bible Palace — Palace 관련 타입 정의
// ============================================

/** 구분자 유형: 아파트 공간 사이를 나누는 요소 */
export type SeparatorType =
  | "문"         // door
  | "낮은칸막이"  // low partition
  | "가구"       // furniture
  | "커튼"       // curtain
  | "유리"       // glass
  | "낮은가구";   // low furniture

/** 궁전 내 개별 위치(Locus) 정의 */
export interface LocusDefinition {
  index: number;          // 0-19
  name: string;           // "아파트 입구"
  nameEn: string;         // "Apartment Entrance"
  emoji: string;          // 🏢
  description: string;    // 감각적 묘사
  separatorBefore?: SeparatorType; // 이전 위치와의 구분자
}

/** 공간 템플릿 */
export interface PalaceTemplate {
  key: string;            // "default_apartment_20"
  name: string;           // "기본 아파트 (20개)"
  nameEn: string;         // "Default Apartment (20 loci)"
  description: string;
  lociCount: number;
  loci: LocusDefinition[];
}

/** Loci에 배치된 구절 세그먼트 */
export interface LociAssignment {
  locusIndex: number;
  locusName: string;
  locusEmoji: string;
  segmentText: string;       // 원문 분절
  keyword: string;           // 핵심 키워드
  imageDescription: string;  // 한국어 이미지 묘사
  imageUrl?: string;         // 생성된 이미지 URL
  imagePrompt: string;       // FLUX용 영어 프롬프트
  senses: string[];          // 오감 묘사
}

/** 위치 간 스토리 연결 */
export interface StoryConnection {
  fromLocusIndex: number;
  toLocusIndex: number;
  story: string;              // 한국어 연결 이야기
  transitionType: "walk" | "look" | "reach" | "turn" | "open";
  sensoryDetail?: string;     // 감각 전환 묘사
}

/** 기억 궁전 세션 (생성 결과) */
export interface PalaceSession {
  id: string;
  verseRef: string;
  verseText: string;
  templateKey: string;
  lociAssignments: LociAssignment[];
  storyConnections: StoryConnection[];
  fullNarrative: string;       // 1인칭 전체 워크스루
  mnemonicTips: string[];      // 기억 강화 팁
  createdAt: Date;
}

/** 궁전 생성 에이전트 결과 */
export interface PalaceAgentResult {
  verseRef: string;
  verseText: string;
  template: PalaceTemplate;
  lociAssignments: LociAssignment[];
  storyConnections: StoryConnection[];
  fullNarrative: string;
  mnemonicTips: string[];
  reviewSchedule: ReviewSchedulePreview;
  imagePrompts: ImagePromptInfo[];
}

/** 복습 일정 미리보기 */
export interface ReviewSchedulePreview {
  difficulty: "easy" | "moderate" | "hard";
  startDate: string;
  reviews: Array<{
    reviewNumber: number;
    date: string;
    daysAfterStart: number;
    recommendation: string;
  }>;
}

/** 이미지 프롬프트 정보 */
export interface ImagePromptInfo {
  locusIndex: number;
  keyword: string;
  prompt: string;
  negativePrompt: string;
  style: string;
}
