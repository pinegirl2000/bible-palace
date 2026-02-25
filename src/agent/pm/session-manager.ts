// ============================================
// Bible Palace — PM 세션 관리
// 세션 생성, 복구, 저장
// ============================================

import * as fs from "fs";
import * as path from "path";
import type { PMSession } from "./types";

const SESSION_FILE = path.join(__dirname, "../registry/pm-session.json");
const SESSION_MAX_AGE_HOURS = 24;

/** 새 세션을 생성합니다 */
export function createSession(): PMSession {
  return {
    activeProject: null,
    taskHistory: [],
    startedAt: new Date().toISOString(),
  };
}

/**
 * 이전 세션 복구를 시도합니다.
 * 24시간 이내의 세션만 복구합니다.
 */
export function recoverSession(): PMSession | null {
  try {
    if (!fs.existsSync(SESSION_FILE)) return null;

    const raw = fs.readFileSync(SESSION_FILE, "utf-8");
    const session: PMSession = JSON.parse(raw);

    const startedAt = new Date(session.startedAt);
    const hoursDiff = (Date.now() - startedAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > SESSION_MAX_AGE_HOURS) {
      console.log("⏰ 이전 세션이 24시간 이상 지났습니다. 새 세션을 시작합니다.\n");
      return null;
    }

    if (session.activeProject) {
      console.log(`🔄 이전 세션 복구: ${session.activeProject.nameKo} (${session.activeProject.code})`);
      console.log(`   최근 태스크: ${session.taskHistory.length}개\n`);
    }

    return session;
  } catch {
    return null;
  }
}

/** 세션 상태를 파일에 저장합니다 */
export function saveSession(session: PMSession): void {
  try {
    const dir = path.dirname(SESSION_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2), "utf-8");
  } catch {
    // 비 중요 — 실패해도 동작에 영향 없음
  }
}

/** 세션 파일을 삭제합니다 */
export function clearSession(): void {
  try {
    if (fs.existsSync(SESSION_FILE)) {
      fs.unlinkSync(SESSION_FILE);
    }
  } catch {
    // ignore
  }
}
