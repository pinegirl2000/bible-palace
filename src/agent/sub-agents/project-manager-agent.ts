// ============================================
// Bible Palace — Sub-agent #4: Memorization Project Manager
// 진행 상황 요약, 격려, 주간 계획, 그룹 요약
// ============================================

import { prisma } from "@/lib/prisma";

// ============================================
// 인터페이스 정의
// ============================================

/** PM 액션 타입 */
export type PMAction = "status" | "encourage" | "plan_week" | "group_summary";

/** PM 에이전트 결과 */
export interface ProjectManagerResult {
  action: PMAction;
  message: string;        // 한국어 텍스트 출력
  data?: Record<string, unknown>;
}

/** PM 에이전트 컨텍스트 */
export interface PMContext {
  palaceCount?: number;
  memorizedCount?: number;
  currentStreak?: number;
  groupId?: string;
  recentScores?: number[];
}

// ============================================
// 상태 요약 생성
// ============================================

async function generateStatusMessage(
  userId: number,
  context: PMContext
): Promise<ProjectManagerResult> {
  const palaceCount = context.palaceCount ?? 0;
  const memorizedCount = context.memorizedCount ?? 0;
  const currentStreak = context.currentStreak ?? 0;

  // 오늘 복습 예정 궁전 수 조회
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueReviewCount = await prisma.reviewSchedule.count({
    where: {
      userId,
      nextReviewAt: {
        lte: tomorrow,
      },
    },
  });

  // 메시지 구성
  const lines: string[] = [];
  lines.push("📊 현재 진행 상황 요약");
  lines.push("");
  lines.push(`🏛️ 생성한 궁전: ${palaceCount}개`);
  lines.push(`✅ 암송 완료: ${memorizedCount}개`);
  lines.push(`🔥 연속 복습: ${currentStreak}일`);
  lines.push(`📅 오늘 복습 예정: ${dueReviewCount}개`);

  if (dueReviewCount > 0) {
    lines.push("");
    lines.push(`오늘 ${dueReviewCount}개의 궁전을 복습할 차례입니다!`);
  }

  if (memorizedCount > 0 && palaceCount > 0) {
    const completionRate = Math.round((memorizedCount / palaceCount) * 100);
    lines.push("");
    lines.push(`암송 완료율: ${completionRate}%`);
  }

  return {
    action: "status",
    message: lines.join("\n"),
    data: {
      palaceCount,
      memorizedCount,
      currentStreak,
      dueReviewCount,
    },
  };
}

// ============================================
// 격려 메시지 생성
// ============================================

/** 연속 일수별 격려 메시지 */
const STREAK_ENCOURAGEMENTS: Array<{ minDays: number; message: string }> = [
  { minDays: 30, message: "30일 넘게 연속 복습하고 계시다니 정말 대단합니다! 습관이 된 것을 축하합니다!" },
  { minDays: 14, message: "2주 넘게 매일 복습하고 계시네요! 장기 기억으로 빠르게 전환되고 있을 겁니다." },
  { minDays: 7,  message: "일주일 연속 복습! 이 꾸준함이 암송의 열쇠입니다. 계속 이 리듬을 유지하세요!" },
  { minDays: 3,  message: "3일 연속으로 복습하고 계십니다. 좋은 시작입니다! 일주일을 목표로 해봅시다!" },
  { minDays: 1,  message: "오늘도 복습을 하셨군요! 한 걸음 한 걸음이 모여 큰 결실을 맺습니다." },
  { minDays: 0,  message: "오늘 궁전 여행을 시작해 보세요! 첫 발걸음이 가장 중요합니다." },
];

/** 점수별 격려 메시지 */
const SCORE_ENCOURAGEMENTS: Array<{ minAvg: number; message: string }> = [
  { minAvg: 0.9, message: "최근 암송 점수가 매우 높습니다! 이미 많은 구절이 장기 기억에 자리잡고 있습니다." },
  { minAvg: 0.7, message: "점수가 꾸준히 올라가고 있습니다. 이미지를 더 생생하게 만들면 더 빨리 올라갈 거예요!" },
  { minAvg: 0.5, message: "절반 이상을 기억하고 계시네요! 약한 부분의 이미지를 더 과장되게 만들어 보세요." },
  { minAvg: 0.0, message: "모든 시작은 어렵습니다. 궁전을 천천히 걸으며 각 이미지를 3초씩 머무르세요." },
];

/** 궁전 수별 격려 메시지 */
const PALACE_ENCOURAGEMENTS: Array<{ minCount: number; message: string }> = [
  { minCount: 10, message: "10개 이상의 궁전을 보유하고 계시네요! 성경의 보물창고가 풍성해지고 있습니다." },
  { minCount: 5,  message: "5개의 궁전! 각 궁전이 하나님의 말씀을 담은 소중한 공간입니다." },
  { minCount: 1,  message: "첫 궁전을 만드셨군요! 이 궁전이 앞으로 더 많은 궁전의 시작이 될 것입니다." },
  { minCount: 0,  message: "아직 궁전이 없으시네요. 좋아하는 성경 구절로 첫 궁전을 만들어 보세요!" },
];

function generateEncourageMessage(context: PMContext): ProjectManagerResult {
  const streak = context.currentStreak ?? 0;
  const palaceCount = context.palaceCount ?? 0;
  const recentScores = context.recentScores ?? [];

  const lines: string[] = [];
  lines.push("💪 격려의 말씀");
  lines.push("");

  // 연속 일수 기반 격려
  const streakMsg = STREAK_ENCOURAGEMENTS.find((e) => streak >= e.minDays);
  if (streakMsg) {
    lines.push(streakMsg.message);
  }

  // 최근 점수 기반 격려
  if (recentScores.length > 0) {
    const avgScore =
      recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const scoreMsg = SCORE_ENCOURAGEMENTS.find((e) => avgScore >= e.minAvg);
    if (scoreMsg) {
      lines.push("");
      lines.push(scoreMsg.message);
    }
  }

  // 궁전 수 기반 격려
  const palaceMsg = PALACE_ENCOURAGEMENTS.find((e) => palaceCount >= e.minCount);
  if (palaceMsg) {
    lines.push("");
    lines.push(palaceMsg.message);
  }

  // 성경 구절 격려 (고정)
  lines.push("");
  lines.push("\"네 마음을 다하여 여호와를 신뢰하라\" (잠언 3:5)");

  return {
    action: "encourage",
    message: lines.join("\n"),
    data: {
      currentStreak: streak,
      recentAverage:
        recentScores.length > 0
          ? Math.round(
              (recentScores.reduce((a, b) => a + b, 0) /
                recentScores.length) *
                100
            ) / 100
          : null,
    },
  };
}

// ============================================
// 주간 계획 생성
// ============================================

async function generateWeekPlan(
  userId: number,
  context: PMContext
): Promise<ProjectManagerResult> {
  // 복습 예정 궁전 조회 (다음 7일)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const dueReviews = await prisma.reviewSchedule.findMany({
    where: {
      userId,
      nextReviewAt: {
        lte: nextWeek,
      },
    },
    include: {
      palace: {
        select: {
          name: true,
          verseRef: true,
        },
      },
    },
    orderBy: {
      nextReviewAt: "asc",
    },
  });

  const lines: string[] = [];
  lines.push("📋 이번 주 복습 계획");
  lines.push("");

  if (dueReviews.length === 0) {
    lines.push("이번 주 예정된 복습이 없습니다.");
    lines.push("새로운 구절로 궁전을 만들어 보는 건 어떨까요?");
  } else {
    // 날짜별 그룹핑
    const dayMap = new Map<string, typeof dueReviews>();
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

    for (const review of dueReviews) {
      const dateStr = review.nextReviewAt.toISOString().split("T")[0];
      if (!dayMap.has(dateStr)) {
        dayMap.set(dateStr, []);
      }
      dayMap.get(dateStr)!.push(review);
    }

    for (const [dateStr, reviews] of dayMap) {
      const date = new Date(dateStr);
      const dayName = dayNames[date.getDay()];
      const isToday =
        dateStr === today.toISOString().split("T")[0];
      const isPast = date < today;

      const label = isToday
        ? `📌 오늘 (${dayName})`
        : isPast
          ? `⚠️ ${dateStr} (${dayName}) — 밀린 복습`
          : `📅 ${dateStr} (${dayName})`;

      lines.push(label);

      for (const review of reviews) {
        const palaceName = review.palace.name;
        const verseRef = review.palace.verseRef;
        const repNum = review.repetitionNum;
        lines.push(`  • ${palaceName} (${verseRef}) — ${repNum + 1}회차 복습`);
      }
      lines.push("");
    }

    // 요약
    const overdueCount = dueReviews.filter(
      (r) => r.nextReviewAt < today
    ).length;
    const todayCount = dueReviews.filter((r) => {
      const d = r.nextReviewAt.toISOString().split("T")[0];
      return d === today.toISOString().split("T")[0];
    }).length;

    lines.push("---");
    lines.push(
      `총 ${dueReviews.length}개 궁전 복습 예정` +
        (overdueCount > 0 ? ` (${overdueCount}개 밀림)` : "") +
        (todayCount > 0 ? ` | 오늘: ${todayCount}개` : "")
    );

    if (overdueCount > 0) {
      lines.push(
        "밀린 복습부터 먼저 시작하세요! 기억이 흐려지기 전에 궁전을 방문하는 것이 중요합니다."
      );
    }
  }

  return {
    action: "plan_week",
    message: lines.join("\n"),
    data: {
      totalDueReviews: dueReviews.length,
      reviews: dueReviews.map((r) => ({
        palaceName: r.palace.name,
        verseRef: r.palace.verseRef,
        nextReviewAt: r.nextReviewAt.toISOString(),
        repetitionNum: r.repetitionNum,
      })),
    },
  };
}

// ============================================
// 그룹 요약 생성
// ============================================

async function generateGroupSummary(
  userId: number,
  context: PMContext
): Promise<ProjectManagerResult> {
  const groupId = context.groupId;

  if (!groupId) {
    return {
      action: "group_summary",
      message: "그룹 ID가 지정되지 않았습니다. 셀 그룹에 가입하시면 함께 암송 진행 상황을 확인할 수 있습니다.",
    };
  }

  // 그룹 정보 조회
  const group = await prisma.cellGroup.findUnique({
    where: { id: groupId },
    select: {
      name: true,
      members: {
        select: {
          userId: true,
          role: true,
          user: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!group) {
    return {
      action: "group_summary",
      message: "그룹을 찾을 수 없습니다.",
    };
  }

  const lines: string[] = [];
  lines.push(`👥 ${group.name} 그룹 요약`);
  lines.push("");
  lines.push(`멤버 수: ${group.members.length}명`);
  lines.push("");

  // 각 멤버별 간략 통계
  const memberStats = await Promise.all(
    group.members.map(async (member) => {
      const palaceCount = await prisma.palace.count({
        where: { userId: member.userId },
      });

      const recentAttempts = await prisma.memorizationAttempt.findMany({
        where: { userId: member.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { score: true, createdAt: true },
      });

      const avgScore =
        recentAttempts.length > 0
          ? recentAttempts.reduce((sum, a) => sum + a.score, 0) /
            recentAttempts.length
          : 0;

      const lastActive =
        recentAttempts.length > 0 ? recentAttempts[0].createdAt : null;

      return {
        name: member.user.name ?? "익명",
        role: member.role,
        palaceCount,
        avgScore: Math.round(avgScore * 100),
        lastActive,
      };
    })
  );

  // 역할 아이콘
  const roleIcon: Record<string, string> = {
    owner: "👑",
    leader: "🎓",
    member: "👤",
  };

  // 멤버 목록 (역할순 정렬)
  const roleOrder = ["owner", "leader", "member"];
  memberStats.sort(
    (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
  );

  for (const ms of memberStats) {
    const icon = roleIcon[ms.role] ?? "👤";
    const activeStr = ms.lastActive
      ? formatRelativeTime(ms.lastActive)
      : "활동 없음";

    lines.push(
      `${icon} ${ms.name} — 궁전 ${ms.palaceCount}개 | 평균 ${ms.avgScore}% | ${activeStr}`
    );
  }

  // 그룹 전체 통계
  const totalPalaces = memberStats.reduce((s, m) => s + m.palaceCount, 0);
  const groupAvg =
    memberStats.length > 0
      ? Math.round(
          memberStats.reduce((s, m) => s + m.avgScore, 0) /
            memberStats.length
        )
      : 0;

  lines.push("");
  lines.push("---");
  lines.push(`그룹 전체 궁전: ${totalPalaces}개 | 그룹 평균 점수: ${groupAvg}%`);

  // 활발한 멤버 칭찬
  const activeMember = memberStats
    .filter((m) => m.lastActive !== null)
    .sort((a, b) => {
      if (!a.lastActive || !b.lastActive) return 0;
      return b.lastActive.getTime() - a.lastActive.getTime();
    })[0];

  if (activeMember) {
    lines.push("");
    lines.push(`이번 주 가장 활발한 멤버: ${activeMember.name}`);
  }

  return {
    action: "group_summary",
    message: lines.join("\n"),
    data: {
      groupName: group.name,
      memberCount: group.members.length,
      totalPalaces,
      groupAverage: groupAvg,
      members: memberStats,
    },
  };
}

// ============================================
// 유틸리티
// ============================================

/**
 * 상대 시간 포맷 (예: "3시간 전", "2일 전")
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  return `${Math.floor(diffDays / 30)}개월 전`;
}

// ============================================
// 메인 에이전트 함수
// ============================================

/**
 * 프로젝트 매니저 서브에이전트
 *
 * 사용자의 암송 진행 상황을 분석하여 상태 요약, 격려, 주간 계획,
 * 그룹 요약 등을 한국어로 생성합니다.
 *
 * NOTE: 이 함수는 로컬 함수이며, Claude API를 호출하지 않습니다.
 * 템플릿 기반 메시지를 생성합니다.
 *
 * @param userId - 사용자 ID
 * @param action - 수행할 액션
 * @param context - 추가 컨텍스트 정보 (선택)
 */
export async function runProjectManagerAgent(
  userId: number,
  action: PMAction,
  context?: PMContext
): Promise<ProjectManagerResult> {
  const ctx = context ?? {};

  switch (action) {
    case "status":
      return generateStatusMessage(userId, ctx);

    case "encourage":
      return generateEncourageMessage(ctx);

    case "plan_week":
      return generateWeekPlan(userId, ctx);

    case "group_summary":
      return generateGroupSummary(userId, ctx);

    default: {
      // exhaustive check
      const _exhaustive: never = action;
      throw new Error(`Unknown PM action: ${_exhaustive}`);
    }
  }
}
