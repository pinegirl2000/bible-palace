// @ts-nocheck
// ============================================
// Bible Palace — 태스크 분해기
// Claude Code SDK로 태스크를 서브태스크로 분해
// ============================================

import { query } from "@anthropic-ai/claude-code";
import { PM_SYSTEM_PROMPT } from "./prompts/pm-system";
import type { ProjectEntry, TaskDecomposition, SubTask, SubAgentRole } from "./types";
import * as fs from "fs";
import * as path from "path";

/** 프로젝트 키 파일들을 읽어 컨텍스트 문자열을 생성합니다 */
function buildProjectContext(project: ProjectEntry): string {
  const parts: string[] = [];

  parts.push(`# 프로젝트: ${project.nameKo} (${project.code})`);
  parts.push(`디렉토리: ${project.directory}`);
  parts.push(`기술 스택: ${project.tech.join(", ")}`);
  parts.push(`설명: ${project.description}\n`);

  // 키 파일 읽기 (최대 80줄)
  for (const relPath of project.keyFiles) {
    const fullPath = path.join(project.directory, relPath);
    try {
      const content = fs.readFileSync(fullPath, "utf-8");
      const truncated = content.split("\n").slice(0, 80).join("\n");
      parts.push(`## ${relPath}\n\`\`\`\n${truncated}\n\`\`\`\n`);
    } catch {
      // 파일 읽기 실패 시 건너뜀
    }
  }

  // 엔트리포인트 디렉토리 구조 탐색
  for (const [key, dir] of Object.entries(project.entryPoints)) {
    const fullDir = path.join(project.directory, dir);
    try {
      const stat = fs.statSync(fullDir);
      if (stat.isDirectory()) {
        const files = listFilesRecursive(fullDir, 50);
        const relFiles = files.map((f) => path.relative(project.directory, f));
        parts.push(`## ${key} 디렉토리 (${dir}/)\n${relFiles.join("\n")}\n`);
      }
    } catch {
      // 디렉토리 접근 실패 시 건너뜀
    }
  }

  return parts.join("\n");
}

/** 디렉토리의 파일 목록을 재귀적으로 가져옵니다 (최대 limit개) */
function listFilesRecursive(dir: string, limit: number): string[] {
  const results: string[] = [];

  function walk(currentDir: string) {
    if (results.length >= limit) return;
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (results.length >= limit) break;
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
          walk(fullPath);
        } else if (entry.isFile()) {
          results.push(fullPath);
        }
      }
    } catch {
      // 접근 불가 디렉토리 건너뜀
    }
  }

  walk(dir);
  return results;
}

/** JSON 문자열에서 JSON 객체를 추출합니다 (markdown 코드블록 지원) */
function extractJSON(text: string): { summary?: string; subTasks?: any[] } {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = match ? match[1] : text;
  try {
    return JSON.parse(jsonStr.trim());
  } catch {
    return { summary: text, subTasks: [] };
  }
}

/**
 * 태스크를 Claude Code SDK로 분해합니다.
 *
 * @param taskDescription - 사용자가 입력한 태스크 설명
 * @param project - 현재 활성 프로젝트
 * @returns TaskDecomposition
 */
export async function decomposeTask(
  taskDescription: string,
  project: ProjectEntry
): Promise<TaskDecomposition> {
  const projectContext = buildProjectContext(project);

  const prompt = `
## 프로젝트 컨텍스트
${projectContext}

## 사용자 태스크
"${taskDescription}"

---

위 태스크를 분석하고, 서브태스크로 분해하세요. JSON 형식으로만 응답하세요.
`;

  let jsonResult = "";

  for await (const message of query({
    prompt,
    options: {
      systemPrompt: PM_SYSTEM_PROMPT,
      maxTurns: 3,
    },
  })) {
    if (message.type === "result" && message.subtype === "success") {
      jsonResult = typeof message.result === "string" ? message.result : "";
    }
  }

  const parsed = extractJSON(jsonResult);

  return {
    originalTask: taskDescription,
    summary: parsed.summary ?? taskDescription,
    subTasks: (parsed.subTasks ?? []).map((st: any, i: number) => ({
      id: st.id ?? `task_${String(i + 1).padStart(3, "0")}`,
      role: (st.role ?? "coder") as SubAgentRole,
      title: st.title ?? `서브태스크 ${i + 1}`,
      description: st.description ?? "",
      contextFiles: st.contextFiles ?? [],
      dependsOn: st.dependsOn ?? [],
      maxTurns: st.maxTurns ?? 10,
      status: "pending" as const,
    })),
  };
}
