// @ts-nocheck
// ============================================
// Bible Palace — 프로젝트 매니저 에이전트
// 대화형 CLI로 프로젝트 인식 + 태스크 분배
// 실행: npm run agent:pm (또는 npx tsx src/agent/pm.ts)
// ============================================

import * as readline from "readline";
import { loadRegistry, findProject, listProjects } from "./pm/project-registry";
import { decomposeTask } from "./pm/task-decomposer";
import { runSubAgent } from "./pm/sub-agent-runner";
import { createSession, recoverSession, saveSession } from "./pm/session-manager";
import type { PMSession } from "./pm/types";

// ============================================
// 대화형 REPL
// ============================================

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = (q: string): Promise<string> =>
    new Promise((resolve) => rl.question(q, resolve));

  console.log("╔══════════════════════════════════════════╗");
  console.log("║   Bible Palace — 프로젝트 매니저 에이전트   ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // ── 1. 레지스트리 로드 ──
  const registry = loadRegistry();

  if (registry.projects.length === 0) {
    console.log("등록된 프로젝트가 없습니다. registry/projects.json에 프로젝트를 추가하세요.");
    rl.close();
    return;
  }

  // ── 2. 세션 복구 시도 ──
  let session: PMSession = recoverSession() ?? createSession();

  // ── 3. 프로젝트 선택 ──
  if (!session.activeProject) {
    await selectProject(session, registry, prompt);
    if (!session.activeProject) {
      rl.close();
      return;
    }
  }

  saveSession(session);

  // ── 4. 명령어 안내 ──
  console.log("─────────────────────────────────────");
  console.log("명령어:");
  console.log("  [태스크 입력]  → 서브에이전트에게 태스크 분배");
  console.log("  switch        → 프로젝트 전환");
  console.log("  history       → 작업 이력 보기");
  console.log("  info          → 현재 프로젝트 정보");
  console.log("  exit          → 종료");
  console.log("─────────────────────────────────────\n");

  // ── 5. 대화형 태스크 루프 ──
  while (true) {
    const taskInput = await prompt("📝 태스크: ");
    const trimmed = taskInput.trim();

    if (!trimmed) continue;

    // ── 특수 명령 처리 ──
    if (trimmed.toLowerCase() === "exit") {
      console.log("\nPM 에이전트를 종료합니다.");
      saveSession(session);
      break;
    }

    if (trimmed.toLowerCase() === "switch") {
      await selectProject(session, registry, prompt);
      saveSession(session);
      continue;
    }

    if (trimmed.toLowerCase() === "history") {
      showHistory(session);
      continue;
    }

    if (trimmed.toLowerCase() === "info") {
      showProjectInfo(session);
      continue;
    }

    // ── 태스크 분해 ──
    console.log("\n🔍 태스크 분석 중...\n");

    try {
      const decomposition = await decomposeTask(trimmed, session.activeProject!);

      console.log(`📋 태스크 분해 결과:`);
      console.log(`   요약: ${decomposition.summary}`);
      console.log(`   서브태스크: ${decomposition.subTasks.length}개\n`);

      for (const st of decomposition.subTasks) {
        const depStr = st.dependsOn.length > 0 ? ` (의존: ${st.dependsOn.join(", ")})` : "";
        console.log(`   [${st.id}] (${st.role}) ${st.title}${depStr}`);
        if (st.contextFiles.length > 0) {
          console.log(`         파일: ${st.contextFiles.join(", ")}`);
        }
      }

      const confirm = await prompt("\n실행하시겠습니까? (y/n): ");
      if (confirm.trim().toLowerCase() !== "y") {
        console.log("태스크를 취소했습니다.\n");
        continue;
      }

      // ── 서브에이전트 순차 실행 ──
      console.log("");
      for (const subTask of decomposition.subTasks) {
        // 의존성 검증
        const depsMet = subTask.dependsOn.every(
          (dep) => decomposition.subTasks.find((t) => t.id === dep)?.status === "done"
        );

        if (!depsMet) {
          console.log(`⚠️  [${subTask.id}] 선행 태스크 미완료 — 건너뜀`);
          subTask.status = "failed";
          subTask.result = { success: false, output: "", error: "의존 태스크 미완료" };
          continue;
        }

        console.log(`\n🚀 [${subTask.id}] ${subTask.title} 실행 중...\n`);
        subTask.status = "running";

        const result = await runSubAgent(subTask, session.activeProject!);

        subTask.status = result.success ? "done" : "failed";
        subTask.result = result;

        if (result.success) {
          console.log(`\n✅ [${subTask.id}] 완료`);
          if (result.filesModified?.length) {
            console.log(`   수정된 파일: ${result.filesModified.join(", ")}`);
          }
        } else {
          console.log(`\n❌ [${subTask.id}] 실패: ${result.error}`);
        }
      }

      // 이력 기록
      const done = decomposition.subTasks.filter((t) => t.status === "done").length;
      const total = decomposition.subTasks.length;
      console.log(`\n📊 결과: ${done}/${total} 서브태스크 완료\n`);

      session.taskHistory.push({
        task: trimmed,
        decomposition,
        completedAt: new Date().toISOString(),
      });
      saveSession(session);

    } catch (err: any) {
      console.error(`\n❌ 태스크 처리 실패: ${err.message}\n`);
    }
  }

  rl.close();
}

// ============================================
// 헬퍼 함수
// ============================================

async function selectProject(
  session: PMSession,
  registry: any,
  prompt: (q: string) => Promise<string>
) {
  const projects = listProjects(registry);

  console.log("등록된 프로젝트 목록:\n");
  for (const p of projects) {
    console.log(`  [${p.code}] ${p.nameKo} — ${p.description}`);
    console.log(`        디렉토리: ${p.directory}`);
    console.log(`        기술: ${p.tech.join(", ")}\n`);
  }

  const code = await prompt("프로젝트 코드를 입력하세요: ");
  const project = findProject(registry, code.trim().toUpperCase());

  if (!project) {
    console.error(`\n'${code.trim()}' 프로젝트를 찾을 수 없습니다.\n`);
    session.activeProject = null;
    return;
  }

  session.activeProject = project;
  console.log(`\n✅ 프로젝트 선택: ${project.nameKo} (${project.directory})\n`);
}

function showHistory(session: PMSession) {
  if (session.taskHistory.length === 0) {
    console.log("\n아직 작업 이력이 없습니다.\n");
    return;
  }

  console.log("\n📜 작업 이력:\n");
  for (let i = 0; i < session.taskHistory.length; i++) {
    const entry = session.taskHistory[i];
    const subCount = entry.decomposition.subTasks.length;
    const doneCount = entry.decomposition.subTasks.filter((t) => t.status === "done").length;
    const time = entry.completedAt
      ? new Date(entry.completedAt).toLocaleTimeString("ko-KR")
      : "진행중";
    console.log(`  ${i + 1}. [${time}] ${entry.task} (${doneCount}/${subCount} 완료)`);
  }
  console.log("");
}

function showProjectInfo(session: PMSession) {
  const p = session.activeProject;
  if (!p) {
    console.log("\n선택된 프로젝트가 없습니다.\n");
    return;
  }

  console.log(`\n📁 프로젝트 정보:`);
  console.log(`   이름: ${p.nameKo} (${p.name})`);
  console.log(`   코드: ${p.code}`);
  console.log(`   디렉토리: ${p.directory}`);
  console.log(`   기술: ${p.tech.join(", ")}`);
  console.log(`   설명: ${p.description}`);
  console.log(`   엔트리포인트:`);
  for (const [key, val] of Object.entries(p.entryPoints)) {
    console.log(`     ${key}: ${val}`);
  }
  console.log(`   스크립트:`);
  for (const [key, val] of Object.entries(p.scripts)) {
    if (val) console.log(`     ${key}: ${val}`);
  }
  console.log("");
}

// ============================================
// CLI 실행
// ============================================

const args = process.argv.slice(2);

if (args[0] === "--help") {
  console.log(`
🏛️  Bible Palace — 프로젝트 매니저 에이전트

사용법:
  npx tsx src/agent/pm.ts          대화형 모드 시작
  npx tsx src/agent/pm.ts --help   도움말 표시

대화형 모드에서:
  - 태스크를 입력하면 서브에이전트에게 자동 분배
  - switch: 프로젝트 전환
  - history: 작업 이력
  - info: 프로젝트 정보
  - exit: 종료

세션 복구:
  - 이전 세션이 24시간 이내이면 자동 복구
  - 프로젝트와 작업 이력이 유지됩니다
`);
} else {
  main().catch((err) => {
    console.error("PM 에이전트 실행 실패:", err.message);
    process.exit(1);
  });
}
