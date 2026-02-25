// ============================================
// Bible Palace — Group Manager
// 셀 그룹 생성, 가입, 탈퇴, 진행 현황
// ============================================

import { prisma } from "./prisma";
import { nanoid } from "nanoid";

// ============================================
// 인터페이스 정의
// ============================================

/** 그룹 진행 현황 결과 */
export interface GroupProgressResult {
  groupId: string;
  groupName: string;
  members: Array<{
    userId: number;
    userName: string;
    role: string;
    palaceCount: number;
    memorizedCount: number;
    averageScore: number;
    lastActiveAt: Date | null;
  }>;
}

// ============================================
// 그룹 생성
// ============================================

/**
 * 새 셀 그룹을 생성합니다.
 *
 * @param ownerId - 그룹 소유자(생성자) 사용자 ID
 * @param name - 그룹 이름
 * @param description - 그룹 설명 (선택)
 * @returns 생성된 그룹 ID와 초대 코드
 */
export async function createGroup(
  ownerId: number,
  name: string,
  description?: string
): Promise<{ id: string; inviteCode: string }> {
  // 8자리 고유 초대 코드 생성
  const inviteCode = nanoid(8).toUpperCase();

  const group = await prisma.cellGroup.create({
    data: {
      name,
      description: description ?? null,
      inviteCode,
      ownerId,
      members: {
        create: {
          userId: ownerId,
          role: "owner",
        },
      },
    },
    select: {
      id: true,
      inviteCode: true,
    },
  });

  return {
    id: group.id,
    inviteCode: group.inviteCode,
  };
}

// ============================================
// 그룹 가입
// ============================================

/**
 * 초대 코드로 셀 그룹에 가입합니다.
 *
 * @param userId - 가입할 사용자 ID
 * @param inviteCode - 그룹 초대 코드
 * @returns 가입한 그룹 ID와 이름
 * @throws 초대 코드가 유효하지 않거나, 이미 가입된 경우
 */
export async function joinGroup(
  userId: number,
  inviteCode: string
): Promise<{ groupId: string; groupName: string }> {
  // 초대 코드로 그룹 찾기
  const group = await prisma.cellGroup.findUnique({
    where: { inviteCode },
    select: { id: true, name: true },
  });

  if (!group) {
    throw new Error("유효하지 않은 초대 코드입니다.");
  }

  // 이미 가입 여부 확인
  const existing = await prisma.cellGroupMember.findUnique({
    where: {
      groupId_userId: {
        groupId: group.id,
        userId,
      },
    },
  });

  if (existing) {
    throw new Error("이미 이 그룹에 가입되어 있습니다.");
  }

  // 멤버로 추가
  await prisma.cellGroupMember.create({
    data: {
      groupId: group.id,
      userId,
      role: "member",
    },
  });

  return {
    groupId: group.id,
    groupName: group.name,
  };
}

// ============================================
// 그룹 탈퇴
// ============================================

/**
 * 셀 그룹에서 탈퇴합니다.
 *
 * @param userId - 탈퇴할 사용자 ID
 * @param groupId - 그룹 ID
 * @throws 그룹 소유자가 탈퇴하려는 경우, 멤버가 아닌 경우
 */
export async function leaveGroup(
  userId: number,
  groupId: string
): Promise<void> {
  // 멤버십 확인
  const membership = await prisma.cellGroupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
    select: { id: true, role: true },
  });

  if (!membership) {
    throw new Error("이 그룹의 멤버가 아닙니다.");
  }

  // 소유자는 직접 탈퇴 불가 (소유권 이전 후 탈퇴해야 함)
  if (membership.role === "owner") {
    throw new Error(
      "그룹 소유자는 직접 탈퇴할 수 없습니다. 소유권을 이전한 후 탈퇴하세요."
    );
  }

  // 멤버십 삭제
  await prisma.cellGroupMember.delete({
    where: { id: membership.id },
  });
}

// ============================================
// 그룹 진행 현황
// ============================================

/**
 * 셀 그룹의 전체 진행 현황을 조회합니다.
 *
 * @param groupId - 그룹 ID
 * @returns 그룹 정보와 멤버별 진행 현황
 * @throws 그룹이 존재하지 않는 경우
 */
export async function getGroupProgress(
  groupId: string
): Promise<GroupProgressResult> {
  // 그룹 기본 정보 + 멤버 목록
  const group = await prisma.cellGroup.findUnique({
    where: { id: groupId },
    select: {
      id: true,
      name: true,
      members: {
        select: {
          userId: true,
          role: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!group) {
    throw new Error("그룹을 찾을 수 없습니다.");
  }

  // 각 멤버의 진행 현황 조회
  const membersProgress = await Promise.all(
    group.members.map(async (member) => {
      // 궁전 수
      const palaceCount = await prisma.palace.count({
        where: { userId: member.userId },
      });

      // 암송 완료 궁전 수 (최고 점수 >= 0.8)
      const palacesWithBest = await prisma.palace.findMany({
        where: { userId: member.userId },
        select: {
          attempts: {
            select: { score: true },
            orderBy: { score: "desc" },
            take: 1,
          },
        },
      });

      const memorizedCount = palacesWithBest.filter(
        (p) => p.attempts.length > 0 && p.attempts[0].score >= 0.8
      ).length;

      // 평균 점수
      const scoreAgg = await prisma.memorizationAttempt.aggregate({
        where: { userId: member.userId },
        _avg: { score: true },
      });

      // 마지막 활동 시간
      const lastAttempt = await prisma.memorizationAttempt.findFirst({
        where: { userId: member.userId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      });

      return {
        userId: member.userId,
        userName: member.user.name ?? "익명",
        role: member.role,
        palaceCount,
        memorizedCount,
        averageScore: Math.round((scoreAgg._avg.score ?? 0) * 100) / 100,
        lastActiveAt: lastAttempt?.createdAt ?? null,
      };
    })
  );

  return {
    groupId: group.id,
    groupName: group.name,
    members: membersProgress,
  };
}
