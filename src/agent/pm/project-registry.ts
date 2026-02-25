// ============================================
// Bible Palace — 프로젝트 레지스트리 관리
// projects.json 로드, 검색, 저장
// ============================================

import * as fs from "fs";
import * as path from "path";
import type { ProjectRegistry, ProjectEntry } from "./types";

const REGISTRY_PATH = path.join(__dirname, "../registry/projects.json");

/** 레지스트리 파일을 로드합니다 */
export function loadRegistry(): ProjectRegistry {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { version: "1.0.0", projects: [] };
  }
}

/** 프로젝트 코드로 검색합니다 (대소문자 무시) */
export function findProject(
  registry: ProjectRegistry,
  code: string
): ProjectEntry | undefined {
  return registry.projects.find(
    (p) => p.code.toUpperCase() === code.toUpperCase() && p.active
  );
}

/** 활성 프로젝트 목록을 반환합니다 */
export function listProjects(registry: ProjectRegistry): ProjectEntry[] {
  return registry.projects.filter((p) => p.active);
}

/** 레지스트리를 파일에 저장합니다 */
export function saveRegistry(registry: ProjectRegistry): void {
  const dir = path.dirname(REGISTRY_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf-8");
}

/** 디렉토리에서 프로젝트 정보를 자동 감지합니다 */
export function detectProjectInfo(directory: string): Partial<ProjectEntry> {
  const info: Partial<ProjectEntry> = { directory };

  const pkgPath = path.join(directory, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    info.name = pkg.name;
    info.scripts = {};
    for (const [key, val] of Object.entries(pkg.scripts ?? {})) {
      info.scripts[key] = val as string;
    }

    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const tech: string[] = [];
    if (deps.next) tech.push("next.js");
    if (deps.prisma || deps["@prisma/client"]) tech.push("prisma");
    if (deps.ioredis || deps.redis) tech.push("redis");
    if (deps.typescript) tech.push("typescript");
    if (deps.tailwindcss || deps["@tailwindcss/postcss"]) tech.push("tailwindcss");
    if (deps.react) tech.push("react");
    info.tech = tech;
  }

  // 엔트리포인트 자동 감지
  const entryPoints: Record<string, string> = {};
  const candidates = [
    ["web", "src/app"],
    ["agent", "src/agent"],
    ["api", "src/app/api"],
    ["db", "prisma/schema.prisma"],
  ];
  for (const [key, rel] of candidates) {
    if (fs.existsSync(path.join(directory, rel))) {
      entryPoints[key] = rel;
    }
  }
  if (Object.keys(entryPoints).length > 0) {
    info.entryPoints = entryPoints;
  }

  return info;
}
