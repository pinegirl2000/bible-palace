// ============================================
// Bible Palace Agent Tool — 이미지 프롬프트 생성기
// 키워드 → FLUX / Pollinations 이미지 프롬프트
// ============================================

export interface ImagePromptResult {
  keyword: string;
  verseRef: string;
  locusName: string;
  prompt: string;
  negativePrompt: string;
  style: string;
}

// 이미지 스타일 프리셋
export const IMAGE_STYLES = {
  watercolor: "warm watercolor painting, soft edges, gentle colors, spiritual atmosphere",
  stainedGlass: "stained glass window art, vibrant colors, divine light rays, cathedral style",
  icon: "Byzantine icon painting style, gold leaf background, sacred imagery",
  modern: "modern digital illustration, clean lines, warm lighting, minimalist spiritual art",
  oilPainting: "classical oil painting, Renaissance style, dramatic chiaroscuro lighting",
} as const;

export type ImageStyle = keyof typeof IMAGE_STYLES;

/** 텍스트 생성 방지를 위한 공통 네거티브 프롬프트 */
const BASE_NEGATIVE_PROMPT = [
  "text", "letters", "words", "writing", "Korean", "hangul",
  "watermark", "signature", "logo",
  "blurry", "low quality", "dark", "scary", "violent",
  "nsfw", "inappropriate",
].join(", ");

/**
 * 성경 키워드에 대한 이미지 생성 프롬프트 생성
 * FLUX.1-schnell 또는 Pollinations API에서 사용
 */
export function generateImagePrompt(
  keyword: string,
  verseRef: string,
  locusName: string,
  imageDescription: string,
  style: ImageStyle = "watercolor"
): ImagePromptResult {
  const styleDesc = IMAGE_STYLES[style];

  const prompt = [
    `A vivid, memorable illustration of "${keyword}" for Bible memorization.`,
    `Scene: ${imageDescription}.`,
    `Setting: Inside a ${locusName} of a modern apartment.`,
    `Context: Illustration for ${verseRef}.`,
    `Style: ${styleDesc}.`,
    `The image should be emotionally impactful and visually striking.`,
    `Suitable as a memory aid - clear focal point, no text overlay, no words.`,
  ].join(" ");

  return {
    keyword,
    verseRef,
    locusName,
    prompt,
    negativePrompt: BASE_NEGATIVE_PROMPT,
    style,
  };
}

/**
 * 여러 키워드에 대한 이미지 프롬프트 일괄 생성
 */
export function generateBatchImagePrompts(
  items: Array<{
    keyword: string;
    verseRef: string;
    locusName: string;
    imageDescription: string;
  }>,
  style: ImageStyle = "watercolor"
): ImagePromptResult[] {
  return items.map(item =>
    generateImagePrompt(
      item.keyword,
      item.verseRef,
      item.locusName,
      item.imageDescription,
      style
    )
  );
}

/**
 * FLUX.1-schnell (HuggingFace Inference API) 호출용 페이로드 생성
 *
 * @param promptResult - generateImagePrompt()의 결과
 * @param width        - 이미지 너비 (기본 512)
 * @param height       - 이미지 높이 (기본 512)
 * @returns HuggingFace API 요청 body
 */
export function toFluxPayload(
  promptResult: ImagePromptResult,
  width: number = 512,
  height: number = 512
): {
  inputs: string;
  parameters: {
    width: number;
    height: number;
    negative_prompt: string;
  };
} {
  return {
    inputs: promptResult.prompt,
    parameters: {
      width,
      height,
      negative_prompt: promptResult.negativePrompt,
    },
  };
}

/**
 * Pollinations.ai 이미지 URL 생성 (API 키 불필요)
 *
 * @param promptResult - generateImagePrompt()의 결과
 * @param options      - 크기 및 시드 옵션
 * @returns 이미지를 바로 표시할 수 있는 URL
 *
 * @example
 * ```ts
 * const prompt = generateImagePrompt("포도나무", "요한복음 15:5", "Elevator", "A massive grapevine...");
 * const url = toPollinationsUrl(prompt);
 * // → "https://image.pollinations.ai/prompt/A%20vivid...?width=512&height=512&model=flux&nologo=true"
 * ```
 */
export function toPollinationsUrl(
  promptResult: ImagePromptResult,
  options?: { width?: number; height?: number; seed?: number }
): string {
  const width = options?.width ?? 512;
  const height = options?.height ?? 512;

  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    model: "flux",
    nologo: "true",
  });

  if (options?.seed !== undefined) {
    params.set("seed", String(options.seed));
  }

  const encodedPrompt = encodeURIComponent(promptResult.prompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
}
