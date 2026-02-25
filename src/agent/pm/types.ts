// ============================================
// Bible Palace — PM Agent 타입 정의
// 개발 프로젝트 매니저 에이전트용 인터페이스
// ============================================

/** 프로젝트 레지스트리 항목 */
export interface ProjectEntry {
  code: string;                    // "BP"
  name: string;                    // "Bible Palace"
  nameKo: string;                  // "바이블 팰리스"
  directory: string;               // absolute path
  description: string;
  tech: string[];
  entryPoints: Record<string, string>;
  keyFiles: string[];
  scripts: Record<string, string | null>;
  active: boolean;
  createdAt: string;
}

/** 프로젝트 레지스트리 전체 */
export interface ProjectRegistry {
  version: string;
  projects: ProjectEntry[];
}

/** 서브에이전트 역할 */
export type SubAgentRole =
  | "coder"          // 코드 생성/수정
  | "analyzer"       // 코드 분석/리포트
  | "tester"         // 테스트 실행/검증
  | "reviewer"       // 코드 리뷰
  | "documenter"     // 문서 작성
  | "debugger";      // 버그 디버깅

/** 분해된 서브태스크 */
export interface SubTask {
  id: string;                     // "task_001"
  role: SubAgentRole;
  title: string;                  // 한국어 제목
  description: string;            // 상세 설명
  contextFiles: string[];         // 서브에이전트에 전달할 파일 경로
  dependsOn: string[];            // 선행 태스크 ID
  maxTurns: number;
  status: "pending" | "running" | "done" | "failed";
  result?: SubTaskResult;
}

/** 서브태스크 실행 결과 */
export interface SubTaskResult {
  success: boolean;
  output: string;
  filesModified?: string[];
  error?: string;
}

/** 태스크 분해 결과 */
export interface TaskDecomposition {
  originalTask: string;
  summary: string;
  subTasks: SubTask[];
}

/** PM 세션 상태 */
export interface PMSession {
  activeProject: ProjectEntry | null;
  taskHistory: Array<{
    task: string;
    decomposition: TaskDecomposition;
    completedAt?: string;
  }>;
  startedAt: string;
}
