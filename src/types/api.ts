// ============================================
// Bible Palace — API 관련 타입 정의
// ============================================

/** 표준 API 응답 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 궁전 생성 요청 */
export interface CreatePalaceRequest {
  verseRef: string;
  verseText: string;
  templateKey?: string;       // default: "default_apartment_20"
  imageStyle?: string;        // default: "watercolor"
}

/** 암송 시도 제출 요청 */
export interface SubmitAttemptRequest {
  palaceId: string;
  userText: string;
}

/** 그룹 생성 요청 */
export interface CreateGroupRequest {
  name: string;
  description?: string;
}

/** 그룹 가입 요청 */
export interface JoinGroupRequest {
  inviteCode: string;
}

/** 이미지 생성 요청 */
export interface GenerateImageRequest {
  prompt: string;
  width?: number;
  height?: number;
  style?: string;
}

/** 이미지 생성 결과 */
export interface ImageGenerationResult {
  url: string;
  provider: "flux" | "pollinations" | "canvas";
  width: number;
  height: number;
  prompt: string;
}
