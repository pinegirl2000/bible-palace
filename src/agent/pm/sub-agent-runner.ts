// @ts-nocheck
// ============================================
// Bible Palace — 서브에이전트 실행기
// 역할별 프롬프트로 Claude Code SDK query() 호출
// ============================================

import { query } from "@anthropic-ai/claude-code";
import { getRolePrompt } from "./prompts/role-prompts";
import type { SubTask, SubTaskResult, ProjectEntry } from "./types";
import * as fs from "fs";
import * as path from "path";

/** 파일 컨텍스트를 빌드합니다 (서브에이전트에 전달할 코드) */
function buildFileContext(project: ProjectEntry, filePaths: string[]): string {
  const parts: string[] = [];

  for (const relPath of filePaths) {
    const fullPath = path.join(project.directory, relPath);
    try {
      const content = fs.readFileSync(fullPath, "utf-8");
      // 너무 긴 파일은 200줄로 자름
      const lines = content.split("\n");
      const truncated = lines.length > 200
        ? lines.slice(0, 200).join("\n") + `\n... (${lines.length - 200}줄 더)`
        : content;
      parts.push(`### ${relPath}\n\`\`\`typescript\n${truncated}\n\`\`\`\n`);
    } catch {
      parts.push(`### ${relPath}\n(파일을 읽을 수 없습니다)\n`);
    }
  }

  return parts.join("\n");
}

/**
 * 서브에이전트를 실행합니다.
 *
 * @param subTask - 실행할 서브태스크
 * @param project - 활성 프로젝트
 * @returns SubTaskResult
 */
export async function runSubAgent(
  subTask: SubTask,
  project: ProjectEntry
): Promise<SubTaskResult> {
  const rolePrompt = getRolePrompt(subTask.role, project);
  const fileContext = buildFileContext(project, subTask.contextFiles);

  const taskInstruction = subTask.role === "analyzer"
    ? "분석 결과를 구조화된 형식으로 반환하세요."
    : subTask.role === "coder"
      ? "코드를 수정한 후, 수정한 파일 목록과 변경 사항 요약을 알려주세요."
      : subTask.role === "tester"
        ? "테스트를 실행하고 결과를 요약하세요."
        : subTask.role === "debugger"
          ? "버그 원인을 찾아 수정하고 설명하세요."
          : "";

  const prompt = `
## 프로젝트: ${project.nameKo}
디렉토리: ${project.directory}

## 관련 파일
${fileContext}

## 태스크
${subTask.title}

## 상세 설명
${subTask.description}

---

${taskInstruction}
한국어로 응답하세요.
`;

  try {
    let output = "";

    for await (const message of query({
      prompt,
      options: {
        systemPrompt: rolePrompt,
        maxTurns: subTask.maxTurns,
      },
    })) {
      if (message.type === "assistant" && message.message?.content) {
        for (const block of message.message.content) {
          if ("text" in block && block.text) {
            process.stdout.write(block.text);
            output += block.text;
          }
        }
      }

      if (message.type === "result") {
        if (message.subtype === "success") {
          output = typeof message.result === "string"
            ? message.result
            : output;
        }
      }
    }

    const filesModified = extractModifiedFiles(output);

    return {
      success: true,
      output,
      filesModified: filesModified.length > 0 ? filesModified : undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      output: "",
      error: err.message ?? String(err),
    };
  }
}

/** 출력에서 수정된 파일 경로를 추출합니다 (휴리스틱) */
function extractModifiedFiles(output: string): string[] {
  const patterns = output.match(
    /(?:수정|생성|변경|편집|created|modified|updated).*?(?:src\/|prisma\/|package)\S+/gi
  );
  if (!patterns) return [];

  const files = patterns.map((m) => {
    const match = m.match(/(src\/|prisma\/|package)\S+/);
    return match ? match[0].replace(/[,.:;)}\]`'"]+$/, "") : "";
  }).filter(Boolean);

  return [...new Set(files)];
}
