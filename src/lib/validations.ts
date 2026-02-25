// ============================================
// Bible Palace — Zod Validation Schemas
// API 요청 검증
// ============================================

import { z } from "zod";

/** 궁전 생성 요청 검증 */
export const palaceCreateSchema = z.object({
  verseRef: z.string().min(1, "구절 참조를 입력하세요").max(100),
  verseText: z.string().min(1, "구절 본문을 입력하세요").max(5000),
  templateKey: z.string().optional().default("default_apartment_20"),
  imageStyle: z.enum(["watercolor", "stainedGlass", "icon", "modern", "oilPainting"]).optional().default("watercolor"),
});

/** 암송 시도 제출 검증 */
export const attemptSubmitSchema = z.object({
  palaceId: z.string().min(1),
  userText: z.string().min(1, "암송 내용을 입력하세요").max(5000),
});

/** 그룹 생성 요청 검증 */
export const groupCreateSchema = z.object({
  name: z.string().min(1, "그룹 이름을 입력하세요").max(200),
  description: z.string().max(1000).optional(),
});

/** 그룹 가입 요청 검증 */
export const groupJoinSchema = z.object({
  inviteCode: z.string().min(1, "초대 코드를 입력하세요").max(20),
});

/** 이미지 생성 요청 검증 */
export const imageGenerateSchema = z.object({
  prompt: z.string().min(1).max(2000),
  width: z.number().min(256).max(1024).optional().default(512),
  height: z.number().min(256).max(1024).optional().default(512),
  style: z.string().optional(),
});

/** 사용자 프로필 업데이트 검증 */
export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().max(500).optional(),
});
