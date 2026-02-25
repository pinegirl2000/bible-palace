// @ts-nocheck
// ============================================
// Bible Palace — 마스터 에이전트 오케스트레이터
// 4개 서브에이전트를 순차 실행하여 궁전 생성
// NOTE: CLI 전용 — Claude Code 런타임에서 실행 (npx tsx src/agent/index.ts)
// ============================================

import { query } from "@anthropic-ai/claude-code";
import { BIBLE_PALACE_SYSTEM_PROMPT } from "./prompts/system";
import { findKnownKeywords, splitVerseIntoSegments } from "./tools/keyword-extractor";
import { DEFAULT_APARTMENT_LOCI, generateBasicNarrative } from "./tools/story-generator";
import { generateReviewSchedule } from "./tools/spaced-repetition";
import { type ImageStyle } from "./tools/image-prompt-generator";

// 서브에이전트 임포트
import { runSpaceTemplateAgent } from "./sub-agents/space-template-agent";
import { runVisualizationAgent } from "./sub-agents/visualization-agent";
import { runStorytellingAgent } from "./sub-agents/storytelling-agent";

// 타입 임포트
import type { PalaceAgentResult } from "@/types/palace";

// ============================================
// 에이전트 설정
// ============================================
interface AgentConfig {
  model?: string;
  maxTurns?: number;
  imageStyle?: ImageStyle;
  templateKey?: string;
}

const DEFAULT_CONFIG: AgentConfig = {
  model: "claude-sonnet-4-20250514",
  maxTurns: 15,
  imageStyle: "watercolor",
  templateKey: "default_apartment_20",
};

// ============================================
// 메인 에이전트: 4-서브에이전트 파이프라인
// ============================================
export async function runPalaceAgent(
  verseRef: string,
  verseText: string,
  config: AgentConfig = {}
): Promise<PalaceAgentResult> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  console.log(`\n🏛️  Bible Palace Agent 시작`);
  console.log(`📖 구절: ${verseRef}`);
  console.log(`📝 본문: ${verseText.substring(0, 50)}...`);

  // ── Step 1: 구절 분석 (로컬) ──
  console.log(`\n🔍 Step 1: 구절 분석 중...`);
  const segments = splitVerseIntoSegments(verseText);
  const knownKeywords = findKnownKeywords(verseText);

  const verseSegments = segments.map((text, i) => {
    const found = knownKeywords.find((k) => text.includes(k.word));
    return {
      text,
      keyword: found?.word || "",
      image: found?.data.image || "",
      senses: found?.data.senses || [],
      locusIndex: i,
    };
  });

  console.log(`   ✓ ${segments.length}개 세그먼트, ${knownKeywords.length}개 키워드 발견`);

  // ── Step 2: 서브에이전트 #1 — 공간 템플릿 ──
  console.log(`\n🏠 Step 2: 공간 템플릿 준비 중...`);
  const template = await runSpaceTemplateAgent(
    cfg.templateKey || "auto",
    segments.length
  );
  console.log(`   ✓ "${template.name}" (${template.lociCount}개 지점)`);

  // ── Step 3: 서브에이전트 #2 — 시각화 ──
  console.log(`\n🎨 Step 3: 시각화 에이전트 실행 중...`);
  const visualization = await runVisualizationAgent(
    verseSegments,
    template.loci,
    cfg.imageStyle || "watercolor"
  );
  console.log(`   ✓ ${visualization.assignments.length}개 loci 배치 완료`);

  // ── Step 4: 서브에이전트 #3 — 스토리텔링 ──
  console.log(`\n📖 Step 4: 스토리텔링 에이전트 실행 중...`);
  const storytelling = await runStorytellingAgent(
    verseRef,
    verseText,
    visualization.assignments,
    template
  );
  console.log(`   ✓ ${storytelling.connections.length}개 연결 스토리, 내러티브 생성 완료`);

  // ── Step 5: 복습 스케줄 생성 (로컬) ──
  console.log(`\n📅 Step 5: 복습 스케줄 생성 중...`);
  const difficulty = segments.length > 10 ? "hard" : segments.length > 5 ? "moderate" : "easy";
  const today = new Date().toISOString().split("T")[0];
  const schedule = generateReviewSchedule(verseRef, difficulty, today);
  console.log(`   ✓ ${difficulty} 난이도, ${schedule.reviews.length}단계 스케줄`);

  // ── 결과 조합 ──
  const result: PalaceAgentResult = {
    verseRef,
    verseText,
    template,
    lociAssignments: visualization.assignments,
    storyConnections: storytelling.connections,
    fullNarrative: storytelling.fullNarrative,
    mnemonicTips: storytelling.mnemonicTips,
    reviewSchedule: {
      difficulty,
      startDate: today,
      reviews: schedule.reviews,
    },
    imagePrompts: visualization.imagePrompts.map((p) => ({
      locusIndex: p.locusIndex,
      keyword: visualization.assignments.find((a) => a.locusIndex === p.locusIndex)?.keyword || "",
      prompt: p.prompt,
      negativePrompt: p.negativePrompt,
      style: cfg.imageStyle || "watercolor",
    })),
  };

  console.log(`\n✅ 기억의 궁전 생성 완료!`);
  console.log(`   📍 ${result.lociAssignments.length}개 지점 배치`);
  console.log(`   📖 ${result.storyConnections.length}개 이야기 연결`);
  console.log(`   🖼️ ${result.imagePrompts.length}개 이미지 프롬프트`);

  return result;
}

// ============================================
// Claude AI 강화 궁전 생성 (선택적)
// Claude API를 사용하여 더 풍성한 내러티브 생성
// ============================================
export async function runEnhancedPalaceAgent(
  verseRef: string,
  verseText: string,
  config: AgentConfig = {}
) {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // 먼저 로컬 파이프라인으로 기본 구조 생성
  const baseResult = await runPalaceAgent(verseRef, verseText, config);

  // Claude에게 내러티브 강화 요청
  const lociInfo = baseResult.lociAssignments
    .map((a) => `${a.locusIndex + 1}. ${a.locusEmoji} ${a.locusName}: "${a.keyword}" → ${a.imageDescription}`)
    .join("\n");

  const prompt = `
## 기억의 궁전 내러티브 강화 요청

**구절**: ${verseRef}
**본문**: "${verseText}"

### 현재 배치 (${baseResult.lociAssignments.length}개 지점):
${lociInfo}

### 기본 내러티브:
${baseResult.fullNarrative}

---

위 기본 내러티브를 아래 기준으로 강화하세요:
1. 각 지점 전환에 오감(시각, 청각, 촉각, 후각, 미각) 묘사 추가
2. 약간의 과장과 감정적 서프라이즈 추가
3. 원문 구절이 자연스럽게 떠오르도록 키워드를 강조
4. 1인칭 워크스루 형태 유지

한국어로 작성하세요.
`;

  console.log(`\n🤖 Claude AI 내러티브 강화 중...`);

  for await (const message of query({
    prompt,
    options: {
      systemPrompt: BIBLE_PALACE_SYSTEM_PROMPT,
      maxTurns: cfg.maxTurns,
    },
  })) {
    if (message.type === "assistant" && message.message?.content) {
      for (const block of message.message.content) {
        if ("text" in block && block.text) {
          process.stdout.write(block.text);
        }
      }
    }

    if (message.type === "result") {
      if (message.subtype === "success") {
        console.log("\n\n✅ AI 강화 내러티브 생성 완료!");
        return {
          ...baseResult,
          fullNarrative: typeof message.result === "string"
            ? message.result
            : baseResult.fullNarrative,
        };
      }
    }
  }

  return baseResult;
}

// ============================================
// 복습 코칭 에이전트
// ============================================
export async function runReviewCoachAgent(
  verseRef: string,
  verseText: string,
  userAttempt: string,
  sessionScore: number
) {
  const schedule = generateReviewSchedule(
    verseRef,
    sessionScore >= 0.8 ? "easy" : sessionScore >= 0.5 ? "moderate" : "hard",
    new Date().toISOString().split("T")[0]
  );

  const prompt = `
## 복습 코칭 요청

**구절**: ${verseRef}
**원문**: "${verseText}"
**사용자 시도**: "${userAttempt}"
**점수**: ${Math.round(sessionScore * 100)}%

**생성된 복습 스케줄**:
${JSON.stringify(schedule, null, 2)}

---

다음을 해주세요:
1. 사용자의 시도를 원문과 비교하여 피드백
2. 틀린 부분에 대한 기억 강화 팁 (이미지를 더 생생하게 만드는 방법)
3. 다음 복습까지의 격려 메시지
4. 필요시 이미지 연결을 수정/강화하는 제안

따뜻하고 격려하는 톤으로 응답하세요.
`;

  for await (const message of query({
    prompt,
    options: {
      systemPrompt: BIBLE_PALACE_SYSTEM_PROMPT,
      maxTurns: 5,
    },
  })) {
    if (message.type === "assistant" && message.message?.content) {
      for (const block of message.message.content) {
        if ("text" in block && block.text) {
          process.stdout.write(block.text);
        }
      }
    }

    if (message.type === "result" && message.subtype === "success") {
      return message.result;
    }
  }
}

// ============================================
// CLI 실행 (직접 실행 시)
// ============================================
const args = process.argv.slice(2);
if (args.length >= 2) {
  const verseRef = args[0];
  const verseText = args.slice(1).join(" ");
  const useAI = args.includes("--enhance");

  const agentFn = useAI ? runEnhancedPalaceAgent : runPalaceAgent;

  agentFn(verseRef, verseText).catch((err) => {
    console.error("에이전트 실행 실패:", err.message);
    process.exit(1);
  });
} else if (args[0] === "--help") {
  console.log(`
🏛️  Bible Palace Agent — 기억의 궁전 성경 암송 에이전트

사용법:
  npx tsx src/agent/index.ts "요한복음 15:5" "나는 포도나무요 너희는 가지라..."
  npx tsx src/agent/index.ts "시편 23:1-3" "여호와는 나의 목자시니..."
  npx tsx src/agent/index.ts --enhance "시편 23:1-3" "여호와는 나의 목자시니..."

옵션:
  --help     도움말 표시
  --enhance  Claude AI를 사용하여 내러티브 강화
`);
}
