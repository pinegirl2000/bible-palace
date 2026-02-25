// ============================================
// Bible Palace — Sub-agent #3: Storytelling Guide
// Loci 사이를 잇는 풍성한 내러티브 생성
// ============================================

import type { LociAssignment, StoryConnection, SeparatorType } from "@/types/palace";
import {
  getTransition,
  FULL_APARTMENT_LOCI,
  type LocusInfo,
} from "../tools/story-generator";

// ============================================
// 인터페이스 정의
// ============================================

/** 공간 템플릿 (story-generator의 FULL_APARTMENT_LOCI 기반) */
export interface SpaceTemplate {
  key: string;
  name: string;
  lociCount: number;
  loci: SpaceLocusInfo[];
}

/** 공간 내 개별 위치 정보 */
export interface SpaceLocusInfo {
  index: number;
  name: string;
  nameEn: string;
  emoji: string;
  description: string;
  separatorBefore?: SeparatorType;
}

/** 감각 앵커 */
export interface SensoryAnchor {
  locusIndex: number;
  locusName: string;
  senses: {
    sight: string;
    sound: string;
    touch: string;
    smell?: string;
    taste?: string;
  };
}

/** 스토리텔링 에이전트 결과 */
export interface StorytellingResult {
  connections: StoryConnection[];     // 인접 loci 간 이야기 연결
  fullNarrative: string;              // 전체 1인칭 워크스루 (한국어)
  mnemonicTips: string[];             // 기억 강화 팁
  sensoryAnchors: SensoryAnchor[];    // 각 locus별 감각 트리거
}

// ============================================
// 구분자별 감각 묘사 사전
// ============================================

interface SeparatorSensory {
  transitionType: StoryConnection["transitionType"];
  sight: string;
  sound: string;
  touch: string;
  smell?: string;
  narrativePhrase: string;
}

const SEPARATOR_SENSORY: Record<SeparatorType, SeparatorSensory> = {
  "문": {
    transitionType: "open",
    sight: "나무 문틀 사이로 빛이 새어 들어옵니다",
    sound: "문이 삐걱 열리는 소리가 울려 퍼집니다",
    touch: "차가운 금속 손잡이를 잡아 돌립니다",
    smell: "새로운 공간의 공기가 밀려옵니다",
    narrativePhrase: "문을 열고 들어서면",
  },
  "낮은칸막이": {
    transitionType: "walk",
    sight: "허리 높이의 칸막이 너머로 다음 공간이 보입니다",
    sound: "발걸음 소리가 바닥에 울립니다",
    touch: "칸막이 위를 손으로 스치며 지나갑니다",
    narrativePhrase: "낮은 칸막이를 지나",
  },
  "가구": {
    transitionType: "turn",
    sight: "큰 가구 옆을 돌아가면 새로운 공간이 펼쳐집니다",
    sound: "가구에 손이 스치는 작은 소리",
    touch: "나무 표면의 매끈한 질감이 느껴집니다",
    smell: "나무와 광택제 냄새가 은은히 풍깁니다",
    narrativePhrase: "가구 옆을 돌아",
  },
  "커튼": {
    transitionType: "reach",
    sight: "부드러운 천이 살랑거리며 너머가 희미하게 보입니다",
    sound: "커튼이 스르륵 밀리는 소리",
    touch: "부드러운 천이 손끝에 스칩니다",
    smell: "섬유유연제의 은은한 향이 납니다",
    narrativePhrase: "커튼을 젖히고",
  },
  "유리": {
    transitionType: "look",
    sight: "투명한 유리 너머로 다음 공간이 선명하게 보입니다",
    sound: "유리문이 미끄러지듯 열리는 소리",
    touch: "차갑고 매끄러운 유리 표면을 밀어냅니다",
    narrativePhrase: "유리문을 밀고",
  },
  "낮은가구": {
    transitionType: "walk",
    sight: "낮은 가구 위에 놓인 물건들이 눈에 들어옵니다",
    sound: "걸음을 옮기며 가구 위 물건이 살짝 흔들립니다",
    touch: "가구 모서리를 손으로 짚으며 지나갑니다",
    narrativePhrase: "낮은 가구를 지나",
  },
};

// ============================================
// 기억 강화 팁 풀
// ============================================

const MNEMONIC_TIP_POOL: string[] = [
  "이미지를 더 과장되게 만드세요 - 크기를 10배로 키우거나 반짝이는 색을 입혀보세요.",
  "움직임을 추가하세요 - 정적인 이미지보다 동적인 장면이 기억에 남습니다.",
  "감정을 연결하세요 - 웃음, 놀라움, 감동 등 감정이 기억을 강화합니다.",
  "소리를 상상하세요 - 각 장면에서 나는 소리를 크게 떠올려 보세요.",
  "냄새를 상상하세요 - 후각은 기억과 가장 강하게 연결된 감각입니다.",
  "촉감을 느껴보세요 - 손끝으로 만지는 상상을 하면 기억이 견고해집니다.",
  "이야기에 유머를 넣으세요 - 우스꽝스러울수록 더 잘 기억됩니다.",
  "개인적 경험과 연결하세요 - 자신만의 추억이 깃든 이미지가 강력합니다.",
  "색을 선명하게 하세요 - 회색보다 원색이, 흐릿함보다 선명함이 기억에 남습니다.",
  "각 장면을 3초씩 천천히 머무르세요 - 서두르지 마세요.",
  "이야기를 소리 내어 말해보세요 - 청각 정보가 추가되어 기억이 강화됩니다.",
  "걸어가는 느낌을 실제로 상상하세요 - 발바닥의 감촉까지 느껴보세요.",
];

// ============================================
// 감각 앵커 생성
// ============================================

function buildSensoryAnchor(
  locusIndex: number,
  assignment: LociAssignment,
  locusInfo: LocusInfo | undefined
): SensoryAnchor {
  // assignment.senses 배열에서 감각 정보 추출
  const senseMap: Record<string, string> = {};
  for (const s of assignment.senses) {
    const colonIdx = s.indexOf(":");
    if (colonIdx > 0) {
      const key = s.substring(0, colonIdx).trim();
      const val = s.substring(colonIdx + 1).trim();
      senseMap[key] = val;
    }
  }

  // 기본 감각 데이터는 locus description에서 유추
  const locusDesc = locusInfo?.description ?? "";

  return {
    locusIndex,
    locusName: assignment.locusName,
    senses: {
      sight: senseMap["시각"] || `${assignment.locusEmoji} ${assignment.imageDescription}`,
      sound: senseMap["청각"] || extractSoundFromDescription(locusDesc),
      touch: senseMap["촉각"] || extractTouchFromDescription(locusDesc),
      smell: senseMap["후각"] || extractSmellFromDescription(locusDesc) || undefined,
      taste: senseMap["미각"] || undefined,
    },
  };
}

function extractSoundFromDescription(desc: string): string {
  if (desc.includes("소리")) return desc;
  if (desc.includes("울림")) return "공간에 소리가 울려 퍼집니다";
  if (desc.includes("졸졸")) return "물이 졸졸 흐르는 소리";
  if (desc.includes("딩동")) return "딩동 소리가 울립니다";
  return "조용한 공간에 발소리만 울립니다";
}

function extractTouchFromDescription(desc: string): string {
  if (desc.includes("따뜻")) return "따뜻한 온기가 느껴집니다";
  if (desc.includes("차가")) return "차가운 감촉이 손끝에 전해집니다";
  if (desc.includes("부드")) return "부드러운 질감이 느껴집니다";
  if (desc.includes("거친")) return "거친 표면이 손바닥에 닿습니다";
  return "공간의 공기가 피부에 닿습니다";
}

function extractSmellFromDescription(desc: string): string | null {
  if (desc.includes("냄새")) return desc;
  if (desc.includes("향")) return desc;
  if (desc.includes("세제")) return "세제 향이 은은히 풍깁니다";
  if (desc.includes("비누")) return "비누 향이 납니다";
  return null;
}

// ============================================
// 연결 스토리 생성
// ============================================

function buildConnection(
  from: LociAssignment,
  to: LociAssignment,
  toLocus: LocusInfo | undefined
): StoryConnection {
  const separator = toLocus?.separatorBefore;
  const separatorSensory = separator ? SEPARATOR_SENSORY[separator] : null;

  // 기본 전환 문구 가져오기
  const baseTransition = getTransition(from.locusIndex, to.locusIndex);

  // 구분자 감각 정보를 포함한 이야기 구성
  let story: string;
  let sensoryDetail: string | undefined;

  if (separatorSensory) {
    story = `${from.locusEmoji} ${from.locusName}에서 "${from.keyword}" 이미지를 뒤로 하고, ${separatorSensory.narrativePhrase} ${to.locusEmoji} ${to.locusName}에 도착합니다. 여기서 "${to.keyword}" — ${to.imageDescription}(이/가) 기다리고 있습니다.`;
    sensoryDetail = `${separatorSensory.sight}. ${separatorSensory.sound}. ${separatorSensory.touch}.`;
  } else {
    story = `${from.locusEmoji} ${from.locusName}에서 "${from.keyword}" 이미지를 뒤로 하고, ${baseTransition} ${to.locusEmoji} ${to.locusName}에서 "${to.keyword}" — ${to.imageDescription}(이/가) 나타납니다.`;
  }

  return {
    fromLocusIndex: from.locusIndex,
    toLocusIndex: to.locusIndex,
    story,
    transitionType: separatorSensory?.transitionType ?? "walk",
    sensoryDetail,
  };
}

// ============================================
// 전체 내러티브 생성
// ============================================

function buildFullNarrative(
  verseRef: string,
  lociAssignments: LociAssignment[],
  connections: StoryConnection[],
  sensoryAnchors: SensoryAnchor[]
): string {
  if (lociAssignments.length === 0) {
    return "";
  }

  const parts: string[] = [];

  // 도입부
  parts.push(`[${verseRef} 기억의 궁전 워크스루]`);
  parts.push("");
  parts.push("나는 아파트 건물 앞에 서 있습니다. 심호흡을 한 번 하고, 기억의 여정을 시작합니다.");
  parts.push("");

  // 첫 번째 위치
  const first = lociAssignments[0];
  const firstAnchor = sensoryAnchors.find(a => a.locusIndex === first.locusIndex);
  parts.push(`${first.locusEmoji} **${first.locusName}**에 도착합니다.`);
  parts.push(`여기서 "${first.keyword}"을(를) 봅니다 — ${first.imageDescription}.`);
  if (firstAnchor) {
    parts.push(`(${firstAnchor.senses.sight})`);
  }
  parts.push(`"${first.segmentText}"`);
  parts.push("");

  // 각 연결 이야기
  for (let i = 0; i < connections.length; i++) {
    const conn = connections[i];
    const toAssignment = lociAssignments[i + 1];
    const toAnchor = sensoryAnchors.find(a => a.locusIndex === conn.toLocusIndex);

    parts.push(conn.story);
    if (conn.sensoryDetail) {
      parts.push(`  [감각] ${conn.sensoryDetail}`);
    }
    if (toAnchor) {
      const senseLines: string[] = [];
      senseLines.push(`  시각: ${toAnchor.senses.sight}`);
      senseLines.push(`  청각: ${toAnchor.senses.sound}`);
      senseLines.push(`  촉각: ${toAnchor.senses.touch}`);
      if (toAnchor.senses.smell) senseLines.push(`  후각: ${toAnchor.senses.smell}`);
      if (toAnchor.senses.taste) senseLines.push(`  미각: ${toAnchor.senses.taste}`);
      parts.push(senseLines.join("\n"));
    }
    if (toAssignment) {
      parts.push(`"${toAssignment.segmentText}"`);
    }
    parts.push("");
  }

  // 마무리
  parts.push("기억의 궁전 여정이 끝났습니다. 이제 눈을 감고, 아파트 입구부터 다시 한 번 천천히 걸어보세요.");

  return parts.join("\n");
}

// ============================================
// 기억 팁 선택
// ============================================

function selectMnemonicTips(assignmentCount: number): string[] {
  // 할당 수에 비례하여 팁 수 결정 (최소 3개, 최대 6개)
  const tipCount = Math.min(6, Math.max(3, Math.ceil(assignmentCount / 2)));
  const tips: string[] = [];
  const usedIndices = new Set<number>();

  while (tips.length < tipCount && tips.length < MNEMONIC_TIP_POOL.length) {
    const idx = Math.floor(Math.random() * MNEMONIC_TIP_POOL.length);
    if (!usedIndices.has(idx)) {
      usedIndices.add(idx);
      tips.push(MNEMONIC_TIP_POOL[idx]);
    }
  }

  return tips;
}

// ============================================
// 기본 공간 템플릿 생성 (FULL_APARTMENT_LOCI 기반)
// ============================================

export function getDefaultSpaceTemplate(): SpaceTemplate {
  return {
    key: "default_apartment_20",
    name: "기본 아파트 (20개)",
    lociCount: FULL_APARTMENT_LOCI.length,
    loci: FULL_APARTMENT_LOCI.map((l): SpaceLocusInfo => ({
      index: l.index,
      name: l.name,
      nameEn: l.nameEn,
      emoji: l.emoji,
      description: l.description,
      separatorBefore: l.separatorBefore,
    })),
  };
}

// ============================================
// 메인 에이전트 함수
// ============================================

/**
 * 스토리텔링 가이드 서브에이전트
 *
 * LociAssignment 배열을 받아 인접 위치 간 연결 이야기를 생성하고,
 * 전체 1인칭 내러티브, 기억 강화 팁, 감각 앵커를 반환합니다.
 *
 * NOTE: 이 함수는 로컬 함수이며, Claude API를 호출하지 않습니다.
 * 기존 story-generator.ts의 getTransition()과 TRANSITIONS를 기반으로 합니다.
 */
export async function runStorytellingAgent(
  verseRef: string,
  verseText: string,
  lociAssignments: LociAssignment[],
  template: SpaceTemplate
): Promise<StorytellingResult> {
  // 1. 감각 앵커 생성
  const sensoryAnchors: SensoryAnchor[] = lociAssignments.map((assignment) => {
    const locusInfo = FULL_APARTMENT_LOCI.find(l => l.index === assignment.locusIndex);
    return buildSensoryAnchor(assignment.locusIndex, assignment, locusInfo);
  });

  // 2. 인접 loci 간 연결 스토리 생성
  const connections: StoryConnection[] = [];
  for (let i = 0; i < lociAssignments.length - 1; i++) {
    const from = lociAssignments[i];
    const to = lociAssignments[i + 1];
    const toLocus = FULL_APARTMENT_LOCI.find(l => l.index === to.locusIndex);
    connections.push(buildConnection(from, to, toLocus));
  }

  // 3. 기억 강화 팁 선택
  const mnemonicTips = selectMnemonicTips(lociAssignments.length);

  // 4. 전체 내러티브 생성
  const fullNarrative = buildFullNarrative(
    verseRef,
    lociAssignments,
    connections,
    sensoryAnchors
  );

  return {
    connections,
    fullNarrative,
    mnemonicTips,
    sensoryAnchors,
  };
}
