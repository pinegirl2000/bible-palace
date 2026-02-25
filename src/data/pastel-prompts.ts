// ============================================
// Bible Palace — Pastel Style Constants & Prompt Builders
// Sub-agent #1: Unified space template style
// Sub-agent #2: Verse visualization
// ============================================

// ── Sub-agent #1: Unified Pastel Art Direction ──

export const PASTEL_STYLE = {
  base: "soft pastel illustration, gentle watercolor gouache style, consistent thin line art, clean minimal shading, isometric bird-eye view, cute rounded shapes, cozy atmosphere, children's storybook quality",
  palette:
    "warm color palette of cream and soft lavender and mint green and peach and powder blue",
  negative:
    "no text, no letters, no words, no people, no shadows, no 3d rendering, no photorealistic",
  size: { width: 1024, height: 768 },
} as const;

/** Simple hash for deterministic seeds */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) % 100000;
}

/** Build Pollinations URL with fixed seed for consistency */
export function buildPastelUrl(
  prompt: string,
  width: number = PASTEL_STYLE.size.width,
  height: number = PASTEL_STYLE.size.height,
  seedKey?: string
): string {
  const seed = seedKey ? hashCode(seedKey) : Math.floor(Math.random() * 100000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;
}

/** Build a pastel room illustration prompt (Sub-agent #1) */
export function buildPastelRoomPrompt(roomSubject: string): string {
  return `${roomSubject}, ${PASTEL_STYLE.base}, ${PASTEL_STYLE.palette}, ${PASTEL_STYLE.negative}`;
}

/** Get a consistent room image URL */
export function getPastelRoomImageUrl(
  roomId: string,
  pastelPromptEn: string
): string {
  return buildPastelUrl(
    pastelPromptEn,
    PASTEL_STYLE.size.width,
    PASTEL_STYLE.size.height,
    `room-${roomId}`
  );
}

// ── Sub-agent #2: Verse Visualization ──────

/** Convert abstract Bible verse to concrete visual scene prompt */
export function buildVerseVisualizationPrompt(
  objectName: string,
  verseRef: string,
  verseText: string
): string {
  return [
    `A creative concrete visual metaphor showing a ${objectName} integrated with the meaning of Bible verse ${verseRef}.`,
    `The verse says: "${verseText}".`,
    `Transform the abstract spiritual meaning into a tangible, memorable illustration scene connected to the ${objectName}.`,
    PASTEL_STYLE.base,
    PASTEL_STYLE.palette,
    PASTEL_STYLE.negative,
  ].join(" ");
}

/** Generate a verse visualization image URL */
export function getVerseVisualizationUrl(
  objectName: string,
  verseRef: string,
  verseText: string,
  objectId: string
): string {
  const prompt = buildVerseVisualizationPrompt(objectName, verseRef, verseText);
  return buildPastelUrl(prompt, 512, 512, `verse-${objectId}-${verseRef}`);
}
