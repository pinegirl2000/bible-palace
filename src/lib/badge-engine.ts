// ============================================
// Bible Palace — Badge Engine
// 배지 정의, 시딩, 자동 수여 시스템
// ============================================

import { prisma } from "./prisma";

// ============================================
// 인터페이스 정의
// ============================================

/** 배지 정의 */
export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  iconEmoji: string;
  condition: string;       // "palace_count:1", "memorized_count:5", "streak_days:7"
  category: "memorization" | "streak" | "group" | "mastery";
}

// ============================================
// 배지 정의 목록
// ============================================

export const BADGE_DEFINITIONS: BadgeDef[] = [
  {
    id: "first_palace",
    name: "첫 궁전",
    description: "첫 번째 기억의 궁전을 만들었습니다",
    iconEmoji: "🏛️",
    condition: "palace_count:1",
    category: "memorization",
  },
  {
    id: "verse_5",
    name: "5구절 암송",
    description: "5개의 구절을 성공적으로 암송했습니다",
    iconEmoji: "⭐",
    condition: "memorized_count:5",
    category: "memorization",
  },
  {
    id: "verse_10",
    name: "10구절 암송",
    description: "10개의 구절을 성공적으로 암송했습니다",
    iconEmoji: "🌟",
    condition: "memorized_count:10",
    category: "memorization",
  },
  {
    id: "streak_7",
    name: "7일 연속",
    description: "7일 연속으로 복습했습니다",
    iconEmoji: "🔥",
    condition: "streak_days:7",
    category: "streak",
  },
  {
    id: "streak_30",
    name: "30일 연속",
    description: "30일 연속으로 복습했습니다",
    iconEmoji: "💎",
    condition: "streak_days:30",
    category: "streak",
  },
  {
    id: "perfect_score",
    name: "완벽한 회상",
    description: "100% 정확도로 구절을 암송했습니다",
    iconEmoji: "👑",
    condition: "perfect_attempts:1",
    category: "mastery",
  },
  {
    id: "group_leader",
    name: "셀 리더",
    description: "셀 그룹의 리더가 되었습니다",
    iconEmoji: "🎓",
    condition: "group_role:leader",
    category: "group",
  },
  {
    id: "psalm_master",
    name: "시편 마스터",
    description: "시편의 구절을 5개 이상 암송했습니다",
    iconEmoji: "📜",
    condition: "book_memorized:시편:5",
    category: "mastery",
  },
];

// ============================================
// 조건 파싱
// ============================================

interface ParsedCondition {
  type: string;
  params: string[];
}

function parseCondition(condition: string): ParsedCondition {
  const parts = condition.split(":");
  return {
    type: parts[0],
    params: parts.slice(1),
  };
}

// ============================================
// 사용자 통계 조회
// ============================================

interface UserStats {
  palaceCount: number;
  memorizedCount: number;     // score >= 0.8 인 궁전 수
  streakDays: number;
  perfectAttempts: number;    // score === 1.0 인 시도 수
  groupRoles: string[];       // 사용자의 그룹 역할 목록
  bookMemorized: Map<string, number>; // 책이름 → 암송 궁전 수
}

async function getUserStats(userId: number): Promise<UserStats> {
  // 1. 궁전 수
  const palaceCount = await prisma.palace.count({
    where: { userId },
  });

  // 2. 암송 완료 궁전 수 (최고 점수 >= 0.8인 궁전)
  const palacesWithAttempts = await prisma.palace.findMany({
    where: { userId },
    select: {
      id: true,
      verseRef: true,
      attempts: {
        select: { score: true },
        orderBy: { score: "desc" },
        take: 1,
      },
    },
  });

  const memorizedCount = palacesWithAttempts.filter(
    (p) => p.attempts.length > 0 && p.attempts[0].score >= 0.8
  ).length;

  // 3. 연속 복습 일수 (streak) 계산
  const streakDays = await calculateStreak(userId);

  // 4. 완벽한 시도 수 (score >= 0.95)
  const perfectAttempts = await prisma.memorizationAttempt.count({
    where: {
      userId,
      score: { gte: 0.95 },
    },
  });

  // 5. 그룹 역할
  const groupMemberships = await prisma.cellGroupMember.findMany({
    where: { userId },
    select: { role: true },
  });
  const groupRoles = groupMemberships.map((m) => m.role);

  // 6. 책별 암송 수
  const bookMemorized = new Map<string, number>();
  for (const palace of palacesWithAttempts) {
    if (palace.attempts.length > 0 && palace.attempts[0].score >= 0.8) {
      // verseRef에서 책 이름 추출 (예: "시편 23:1-6" → "시편")
      const bookName = palace.verseRef.split(/\s+/)[0];
      bookMemorized.set(bookName, (bookMemorized.get(bookName) ?? 0) + 1);
    }
  }

  return {
    palaceCount,
    memorizedCount,
    streakDays,
    perfectAttempts,
    groupRoles,
    bookMemorized,
  };
}

/**
 * 연속 복습 일수를 계산합니다.
 * 오늘부터 거슬러 올라가며 매일 시도가 있는지 확인합니다.
 */
async function calculateStreak(userId: number): Promise<number> {
  const attempts = await prisma.memorizationAttempt.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 365, // 최대 1년치
  });

  if (attempts.length === 0) return 0;

  // 날짜별 그룹핑
  const dateSet = new Set<string>();
  for (const attempt of attempts) {
    const dateStr = attempt.createdAt.toISOString().split("T")[0];
    dateSet.add(dateStr);
  }

  // 오늘부터 연속일 계산
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split("T")[0];

    if (dateSet.has(dateStr)) {
      streak++;
    } else {
      // 오늘 아직 시도 안 한 경우 어제부터 카운트
      if (i === 0) continue;
      break;
    }
  }

  return streak;
}

// ============================================
// 조건 평가
// ============================================

function evaluateCondition(
  condition: ParsedCondition,
  stats: UserStats
): boolean {
  switch (condition.type) {
    case "palace_count": {
      const required = parseInt(condition.params[0], 10);
      return stats.palaceCount >= required;
    }

    case "memorized_count": {
      const required = parseInt(condition.params[0], 10);
      return stats.memorizedCount >= required;
    }

    case "streak_days": {
      const required = parseInt(condition.params[0], 10);
      return stats.streakDays >= required;
    }

    case "perfect_attempts": {
      const required = parseInt(condition.params[0], 10);
      return stats.perfectAttempts >= required;
    }

    case "group_role": {
      const requiredRole = condition.params[0];
      return stats.groupRoles.some(
        (role) => role === requiredRole || role === "owner"
      );
    }

    case "book_memorized": {
      // "book_memorized:시편:5"
      const bookName = condition.params[0];
      const required = parseInt(condition.params[1], 10);
      const count = stats.bookMemorized.get(bookName) ?? 0;
      return count >= required;
    }

    default:
      return false;
  }
}

// ============================================
// 공개 API
// ============================================

/**
 * 모든 배지 정의를 DB에 시딩합니다.
 * 이미 존재하는 배지는 업데이트합니다.
 */
export async function seedBadges(): Promise<void> {
  for (const badge of BADGE_DEFINITIONS) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: {
        name: badge.name,
        description: badge.description,
        iconEmoji: badge.iconEmoji,
        condition: badge.condition,
        category: badge.category,
      },
      create: {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        iconEmoji: badge.iconEmoji,
        condition: badge.condition,
        category: badge.category,
      },
    });
  }
}

/**
 * 사용자의 현재 통계를 확인하여 새로 획득한 배지를 수여합니다.
 *
 * @param userId - 사용자 ID
 * @returns 새로 획득한 배지 목록
 */
export async function checkAndAwardBadges(
  userId: number
): Promise<BadgeDef[]> {
  // 1. 사용자 통계 조회
  const stats = await getUserStats(userId);

  // 2. 이미 획득한 배지 ID 목록
  const earnedBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.badgeId));

  // 3. 각 배지 조건 확인 및 수여
  const newlyAwarded: BadgeDef[] = [];

  for (const badge of BADGE_DEFINITIONS) {
    // 이미 획득한 배지 건너뛰기
    if (earnedBadgeIds.has(badge.id)) continue;

    // 조건 파싱 및 평가
    const condition = parseCondition(badge.condition);
    const qualifies = evaluateCondition(condition, stats);

    if (qualifies) {
      // DB에 배지가 있는지 확인 (seedBadges 안 한 경우 대비)
      const dbBadge = await prisma.badge.findUnique({
        where: { id: badge.id },
      });

      if (dbBadge) {
        // 배지 수여
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });
        newlyAwarded.push(badge);
      }
    }
  }

  return newlyAwarded;
}
