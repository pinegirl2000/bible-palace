// ============================================
// Bible Palace — 이미지 생성 서비스
// FLUX.1-schnell (HuggingFace) + Pollinations 폴백
// ============================================

// ============================================
// 인터페이스
// ============================================

export interface ImageGenerationResult {
  /** 생성된 이미지 URL (data URL 또는 외부 URL) */
  url: string;
  /** 사용된 제공자 */
  provider: "flux" | "pollinations" | "canvas";
  /** 이미지 너비 (px) */
  width: number;
  /** 이미지 높이 (px) */
  height: number;
  /** 사용된 프롬프트 */
  prompt: string;
}

export interface ImageGenerationOptions {
  width?: number;
  height?: number;
  /** Pollinations 전용: 재현성을 위한 시드 */
  seed?: number;
  /** 선호 제공자 (지정하지 않으면 자동 폴백) */
  provider?: "flux" | "pollinations";
}

// ============================================
// 상수
// ============================================

const FLUX_MODEL_URL =
  "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";

const POLLINATIONS_BASE_URL = "https://image.pollinations.ai/prompt";

const DEFAULT_WIDTH = 512;
const DEFAULT_HEIGHT = 512;

/** FLUX 요청 타임아웃 (ms) */
const FLUX_TIMEOUT_MS = 30_000;

/** Pollinations 요청 타임아웃 (ms) */
const POLLINATIONS_TIMEOUT_MS = 60_000;

// ============================================
// Primary: FLUX.1-schnell via HuggingFace
// ============================================

/**
 * FLUX.1-schnell-Free 모델로 이미지를 생성합니다.
 *
 * - POST https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell
 * - Authorization: Bearer ${HUGGINGFACE_API_TOKEN}
 * - Body: { inputs: prompt }
 * - Response: binary image (JPEG/PNG)
 *
 * @param prompt  - 영문 이미지 프롬프트
 * @param options - 크기 옵션
 * @returns ImageGenerationResult (data URL)
 * @throws 토큰이 없거나 API 오류 시
 */
export async function generateImageFlux(
  prompt: string,
  options?: { width?: number; height?: number }
): Promise<ImageGenerationResult> {
  const token = process.env.HUGGINGFACE_API_TOKEN;
  if (!token) {
    throw new Error(
      "[ImageService] HUGGINGFACE_API_TOKEN 환경 변수가 설정되지 않았습니다."
    );
  }

  const width = options?.width ?? DEFAULT_WIDTH;
  const height = options?.height ?? DEFAULT_HEIGHT;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FLUX_TIMEOUT_MS);

  try {
    const response = await fetch(FLUX_MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width,
          height,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "unknown error");
      throw new Error(
        `[ImageService] FLUX API error ${response.status}: ${errorBody}`
      );
    }

    // 응답은 바이너리 이미지
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // Content-Type 확인 (보통 image/jpeg 또는 image/png)
    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const dataUrl = `data:${contentType};base64,${base64}`;

    return {
      url: dataUrl,
      provider: "flux",
      width,
      height,
      prompt,
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================
// Fallback: Pollinations.ai (API 키 불필요)
// ============================================

/**
 * Pollinations.ai로 이미지를 생성합니다 (API 키 불필요).
 *
 * URL 형식:
 *   https://image.pollinations.ai/prompt/{encodedPrompt}?width=512&height=512&model=flux
 *
 * 이 URL 자체가 생성된 이미지를 반환하므로 직접 <img src>로 사용 가능합니다.
 *
 * @param prompt  - 영문 이미지 프롬프트
 * @param options - 크기, 시드 옵션
 * @returns ImageGenerationResult (외부 URL)
 */
export async function generateImagePollinations(
  prompt: string,
  options?: { width?: number; height?: number; seed?: number }
): Promise<ImageGenerationResult> {
  const width = options?.width ?? DEFAULT_WIDTH;
  const height = options?.height ?? DEFAULT_HEIGHT;

  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    model: "flux",
    nologo: "true",
  });

  if (options?.seed !== undefined) {
    params.set("seed", String(options.seed));
  }

  const encodedPrompt = encodeURIComponent(prompt);
  const url = `${POLLINATIONS_BASE_URL}/${encodedPrompt}?${params.toString()}`;

  // Pollinations URL은 이미지 자체를 반환하므로 유효성만 검증
  // HEAD 요청으로 접근 가능 여부 확인
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    POLLINATIONS_TIMEOUT_MS
  );

  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `[ImageService] Pollinations error ${response.status}`
      );
    }

    return {
      url,
      provider: "pollinations",
      width,
      height,
      prompt,
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Pollinations URL을 직접 생성합니다 (네트워크 요청 없이).
 * 클라이언트에서 <img> src로 바로 사용할 수 있는 URL을 반환합니다.
 *
 * @param prompt  - 영문 이미지 프롬프트
 * @param options - 크기, 시드 옵션
 * @returns 이미지 URL 문자열
 */
export function buildPollinationsUrl(
  prompt: string,
  options?: { width?: number; height?: number; seed?: number }
): string {
  const width = options?.width ?? DEFAULT_WIDTH;
  const height = options?.height ?? DEFAULT_HEIGHT;

  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    model: "flux",
    nologo: "true",
  });

  if (options?.seed !== undefined) {
    params.set("seed", String(options.seed));
  }

  const encodedPrompt = encodeURIComponent(prompt);
  return `${POLLINATIONS_BASE_URL}/${encodedPrompt}?${params.toString()}`;
}

// ============================================
// Orchestrator: 자동 폴백
// ============================================

/**
 * 이미지를 생성합니다. 지정된 provider로 시도하고, 실패 시 다른 provider로 폴백합니다.
 *
 * 우선순위:
 * 1. provider가 지정되면 해당 provider 우선 시도
 * 2. 미지정 또는 FLUX: HuggingFace FLUX → 실패 시 Pollinations
 * 3. Pollinations: Pollinations → 실패 시 FLUX
 *
 * @param prompt  - 영문 이미지 프롬프트
 * @param options - 크기, provider 옵션
 * @returns ImageGenerationResult
 * @throws 모든 provider가 실패하면 에러
 */
export async function generateImage(
  prompt: string,
  options?: ImageGenerationOptions
): Promise<ImageGenerationResult> {
  const width = options?.width ?? DEFAULT_WIDTH;
  const height = options?.height ?? DEFAULT_HEIGHT;
  const preferredProvider = options?.provider;

  // provider 순서 결정
  const providers: Array<() => Promise<ImageGenerationResult>> =
    preferredProvider === "pollinations"
      ? [
          () =>
            generateImagePollinations(prompt, {
              width,
              height,
              seed: options?.seed,
            }),
          () => generateImageFlux(prompt, { width, height }),
        ]
      : [
          () => generateImageFlux(prompt, { width, height }),
          () =>
            generateImagePollinations(prompt, {
              width,
              height,
              seed: options?.seed,
            }),
        ];

  const errors: Error[] = [];

  for (const tryProvider of providers) {
    try {
      const result = await tryProvider();
      return result;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error(String(err));
      errors.push(error);
      console.warn(
        `[ImageService] Provider failed: ${error.message}. Trying next...`
      );
    }
  }

  // 모든 provider 실패
  throw new Error(
    `[ImageService] 모든 이미지 생성 provider가 실패했습니다:\n` +
      errors.map((e, i) => `  ${i + 1}. ${e.message}`).join("\n")
  );
}

/**
 * 여러 프롬프트에 대해 이미지를 일괄 생성합니다.
 * 순차적으로 처리하며, 각 요청 실패 시 개별 폴백합니다.
 *
 * @param prompts - 프롬프트 배열
 * @param options - 공통 옵션
 * @returns 결과 배열 (실패한 항목은 null)
 */
export async function generateImageBatch(
  prompts: string[],
  options?: ImageGenerationOptions
): Promise<Array<ImageGenerationResult | null>> {
  const results: Array<ImageGenerationResult | null> = [];

  for (const prompt of prompts) {
    try {
      const result = await generateImage(prompt, options);
      results.push(result);
    } catch (err) {
      console.error(
        `[ImageService] Batch item failed for prompt: "${prompt.substring(0, 50)}..."`,
        err
      );
      results.push(null);
    }
  }

  return results;
}
