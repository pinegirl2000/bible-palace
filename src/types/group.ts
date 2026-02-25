// ============================================
// Bible Palace — 셀 그룹 관련 타입 정의
// ============================================

/** 셀 그룹 */
export interface CellGroupData {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  ownerId: number;
  ownerName: string;
  memberCount: number;
  createdAt: Date;
}

/** 그룹 멤버 정보 */
export interface CellGroupMemberInfo {
  userId: number;
  userName: string;
  avatarUrl?: string;
  role: "owner" | "leader" | "member";
  memorizedCount: number;
  currentStreak: number;
  lastActiveAt?: Date;
}

/** 그룹 상세 (멤버 포함) */
export interface CellGroupDetail extends CellGroupData {
  members: CellGroupMemberInfo[];
  totalMemorized: number;     // 전체 그룹 암송 수
  weeklyProgress: number;     // 이번 주 활동 수
}

/** 그룹 진행 상황 */
export interface GroupProgressData {
  groupId: string;
  groupName: string;
  members: Array<{
    userId: number;
    userName: string;
    avatarUrl?: string;
    memorizedCount: number;
    currentStreak: number;
    weeklyAttempts: number;
    averageScore: number;
    recentBadges: BadgeEarned[];
  }>;
  leaderboard: LeaderboardEntry[];
}

/** 리더보드 항목 */
export interface LeaderboardEntry {
  rank: number;
  userId: number;
  userName: string;
  avatarUrl?: string;
  memorizedCount: number;
  currentStreak: number;
  score: number;
}

/** 획득한 배지 */
export interface BadgeEarned {
  badgeId: string;
  name: string;
  iconEmoji: string;
  earnedAt: Date;
}

/** 배지 정의 */
export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  iconEmoji: string;
  condition: string;          // "palace_count:1", "memorized_count:5", etc.
  category: "memorization" | "streak" | "group" | "mastery";
}

/** 사용자 프로필 */
export interface UserProfile {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
  stats: {
    totalPalaces: number;
    totalMemorized: number;
    currentStreak: number;
    longestStreak: number;
    totalAttempts: number;
    averageScore: number;
  };
  badges: BadgeEarned[];
  groups: CellGroupData[];
}
