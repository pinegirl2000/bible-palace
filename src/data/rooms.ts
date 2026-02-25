// ============================================
// Bible Palace — Room/Object Data & Generator
// Dynamic room generation from space templates
// Linear node graph layout (single straight line)
// ============================================

import { buildPastelRoomPrompt, getPastelRoomImageUrl } from "./pastel-prompts";
import { getTemplateById, type TemplateRoom } from "./space-templates";

export interface RoomObject {
  id: string;
  name: string;
  emoji: string;
  position: { x: number; y: number }; // % coordinates on room image
}

export interface Room {
  id: string;
  name: string;
  emoji: string;
  description: string;
  imagePromptEn: string;
  pastelPromptEn: string;
  nodePosition: { x: number; y: number }; // Node graph coords (0-100)
  connectedTo: string[];
  objects: RoomObject[];
}

export interface VerseAssignment {
  roomId: string;
  objectId: string;
  objectName: string;
  verseRef: string;
  verseText: string;
  visualPromptEn: string;
  imageUrl: string;
}

// ── Pollinations URL builders ──

export function buildPollinationsUrl(
  prompt: string,
  width = 768,
  height = 512
): string {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&model=flux&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;
}

export function getRoomImageUrl(room: Room): string {
  return getPastelRoomImageUrl(room.id, room.pastelPromptEn);
}

export function buildVerseVisualPrompt(
  roomName: string,
  objectName: string,
  verseRef: string,
  verseText: string
): string {
  return `A vivid memorable scene inside a Korean apartment ${roomName}: a creative visual interpretation of the Bible verse "${verseRef}", incorporating a ${objectName}. The scene should transform the abstract spiritual meaning into a concrete, memorable visual. Warm illustration style, soft lighting, detailed, no text, no letters, no words.`;
}

// ── 10 rooms — linear straight-line layout ──
// nodePosition: evenly spaced on y=50, x from 5 to 95

export const ROOMS: Room[] = [
  {
    id: "entrance",
    name: "현관",
    emoji: "🚪",
    description: "집의 첫 인상, 오가는 문",
    imagePromptEn:
      "Interior of a modern Korean apartment entrance hallway, first-person perspective walking in through the front door, shoe cabinet on the left, umbrella stand, mirror on the wall, warm wooden floor, soft natural lighting, cozy and inviting, photorealistic",
    pastelPromptEn: buildPastelRoomPrompt(
      "Modern Korean apartment entrance hallway with wooden shoe cabinet, umbrella stand in the corner, large wall mirror, key holder on wall, front door with digital keypad, warm wooden floor, small console table with plant"
    ),
    nodePosition: { x: 5, y: 50 },
    connectedTo: ["living"],
    objects: [
      { id: "entrance_shoes", name: "신발장", emoji: "👟", position: { x: 15, y: 65 } },
      { id: "entrance_umbrella", name: "우산꽂이", emoji: "☂️", position: { x: 35, y: 60 } },
      { id: "entrance_mirror", name: "벽거울", emoji: "🪞", position: { x: 55, y: 35 } },
      { id: "entrance_keys", name: "열쇠고리", emoji: "🔑", position: { x: 80, y: 40 } },
    ],
  },
  {
    id: "living",
    name: "거실",
    emoji: "🛋️",
    description: "가족이 모이는 따뜻한 공간",
    imagePromptEn:
      "Interior of a modern Korean apartment living room, first-person perspective, large sofa with cushions, wall clock above, flat screen TV, picture frames on the wall, coffee table, warm afternoon sunlight through windows, cozy atmosphere, photorealistic",
    pastelPromptEn: buildPastelRoomPrompt(
      "Modern Korean apartment living room with comfortable sofa and colorful cushions, round wall clock, flat screen TV on wooden stand, picture frames on wall, glass coffee table, large windows with curtains, warm afternoon sunlight"
    ),
    nodePosition: { x: 15, y: 50 },
    connectedTo: ["entrance", "kitchen"],
    objects: [
      { id: "living_sofa", name: "소파", emoji: "🛋️", position: { x: 25, y: 60 } },
      { id: "living_clock", name: "벽시계", emoji: "🕐", position: { x: 50, y: 20 } },
      { id: "living_tv", name: "TV", emoji: "📺", position: { x: 75, y: 40 } },
      { id: "living_cushion", name: "쿠션", emoji: "🟤", position: { x: 35, y: 70 } },
      { id: "living_frame", name: "액자", emoji: "🖼️", position: { x: 60, y: 25 } },
    ],
  },
  {
    id: "kitchen",
    name: "주방",
    emoji: "🍳",
    description: "맛있는 음식이 만들어지는 곳",
    imagePromptEn:
      "Interior of a modern Korean apartment kitchen, first-person perspective, stainless steel refrigerator, kitchen sink with window above, microwave on counter, dish cabinet, clean marble countertop, warm lighting, photorealistic",
    pastelPromptEn: buildPastelRoomPrompt(
      "Modern Korean apartment kitchen with stainless steel refrigerator, kitchen sink with small window above, microwave on marble counter, glass dish cabinet with plates, cutting board with fruits, pendant lights, clean white tiles"
    ),
    nodePosition: { x: 25, y: 50 },
    connectedTo: ["living", "dining"],
    objects: [
      { id: "kitchen_fridge", name: "냉장고", emoji: "🧊", position: { x: 15, y: 45 } },
      { id: "kitchen_sink", name: "싱크대", emoji: "🚰", position: { x: 45, y: 50 } },
      { id: "kitchen_microwave", name: "전자레인지", emoji: "📡", position: { x: 70, y: 35 } },
      { id: "kitchen_cabinet", name: "식기장", emoji: "🍽️", position: { x: 85, y: 30 } },
    ],
  },
  {
    id: "dining",
    name: "식당",
    emoji: "🍽️",
    description: "함께 식사하는 공간",
    imagePromptEn:
      "Interior of a Korean apartment dining room, wooden dining table with chairs, pendant lamp above table, fruit bowl on table, window with curtains, warm lighting, photorealistic",
    pastelPromptEn: buildPastelRoomPrompt(
      "Korean apartment dining area with wooden dining table and four chairs, hanging pendant lamp above table, fruit bowl centerpiece, small vase with flowers, window with light curtains, warm cozy atmosphere"
    ),
    nodePosition: { x: 35, y: 50 },
    connectedTo: ["kitchen", "bedroom"],
    objects: [
      { id: "dining_table", name: "식탁", emoji: "🪑", position: { x: 45, y: 55 } },
      { id: "dining_lamp", name: "펜던트 조명", emoji: "💡", position: { x: 50, y: 15 } },
      { id: "dining_vase", name: "꽃병", emoji: "🌸", position: { x: 30, y: 45 } },
    ],
  },
  {
    id: "bedroom",
    name: "침실",
    emoji: "🛏️",
    description: "편안한 휴식과 꿈의 공간",
    imagePromptEn:
      "Interior of a cozy Korean apartment bedroom, first-person perspective, comfortable bed with pillows, wardrobe closet, bedside table with lamp, standing lamp, soft warm lighting, peaceful atmosphere, photorealistic",
    pastelPromptEn: buildPastelRoomPrompt(
      "Cozy Korean apartment bedroom with comfortable bed with fluffy pillows and blanket, wooden wardrobe closet, bedside table with small lamp, tall standing floor lamp, soft warm lighting, peaceful atmosphere, small rug on floor"
    ),
    nodePosition: { x: 45, y: 50 },
    connectedTo: ["dining", "dressing"],
    objects: [
      { id: "bedroom_bed", name: "침대", emoji: "🛏️", position: { x: 40, y: 55 } },
      { id: "bedroom_wardrobe", name: "옷장", emoji: "👔", position: { x: 15, y: 40 } },
      { id: "bedroom_nightstand", name: "협탁", emoji: "🛏️", position: { x: 70, y: 60 } },
      { id: "bedroom_lamp", name: "스탠드", emoji: "💡", position: { x: 80, y: 35 } },
    ],
  },
  {
    id: "dressing",
    name: "드레스룸",
    emoji: "👗",
    description: "옷과 스타일의 공간",
    imagePromptEn:
      "Interior of a Korean apartment walk-in closet dressing room, clothing racks, full-length mirror, shoe shelves, accessories display, soft lighting, photorealistic",
    pastelPromptEn: buildPastelRoomPrompt(
      "Korean apartment walk-in dressing room with clothing racks on both sides, full-length standing mirror, organized shoe shelves, accessories drawer, hat display, soft warm lighting, small ottoman seat"
    ),
    nodePosition: { x: 55, y: 50 },
    connectedTo: ["bedroom", "study"],
    objects: [
      { id: "dressing_rack", name: "옷걸이", emoji: "👔", position: { x: 20, y: 45 } },
      { id: "dressing_mirror", name: "전신거울", emoji: "🪞", position: { x: 50, y: 35 } },
      { id: "dressing_shoes", name: "신발선반", emoji: "👠", position: { x: 75, y: 65 } },
    ],
  },
  {
    id: "study",
    name: "서재",
    emoji: "📚",
    description: "지혜와 배움의 공간",
    imagePromptEn:
      "Interior of a Korean apartment study room, first-person perspective, wooden desk with laptop, tall bookshelf filled with books, comfortable office chair, desk lamp, warm cozy lighting, intellectual atmosphere, photorealistic",
    pastelPromptEn: buildPastelRoomPrompt(
      "Korean apartment study room with wooden desk and open laptop, tall bookshelf filled with colorful books, comfortable swivel office chair, brass desk lamp, potted plant on desk corner, warm cozy lighting, globe on shelf"
    ),
    nodePosition: { x: 65, y: 50 },
    connectedTo: ["dressing", "bathroom"],
    objects: [
      { id: "study_desk", name: "책상", emoji: "🖥️", position: { x: 45, y: 55 } },
      { id: "study_bookshelf", name: "책장", emoji: "📚", position: { x: 15, y: 35 } },
      { id: "study_chair", name: "의자", emoji: "💺", position: { x: 55, y: 70 } },
      { id: "study_laptop", name: "노트북", emoji: "💻", position: { x: 50, y: 45 } },
    ],
  },
  {
    id: "bathroom",
    name: "화장실",
    emoji: "🚿",
    description: "깨끗함과 정결의 공간",
    imagePromptEn:
      "Interior of a modern Korean apartment bathroom, first-person perspective, large mirror above sink, bathtub, towel rack on wall, clean white tiles, soft lighting, serene and clean atmosphere, photorealistic",
    pastelPromptEn: buildPastelRoomPrompt(
      "Modern Korean apartment bathroom with large round mirror above white sink, deep bathtub with shower, towel rack with colorful towels on wall, clean white tiles, small potted plant, soap dispenser, soft lighting"
    ),
    nodePosition: { x: 75, y: 50 },
    connectedTo: ["study", "utility"],
    objects: [
      { id: "bathroom_mirror", name: "세면대 거울", emoji: "🪞", position: { x: 40, y: 30 } },
      { id: "bathroom_bathtub", name: "욕조", emoji: "🛁", position: { x: 70, y: 55 } },
      { id: "bathroom_towel", name: "수건걸이", emoji: "🧺", position: { x: 20, y: 50 } },
    ],
  },
  {
    id: "utility",
    name: "다용도실",
    emoji: "🧹",
    description: "생활 도구와 정리의 공간",
    imagePromptEn:
      "Interior of a Korean apartment utility laundry room, washing machine, dryer, shelves with cleaning supplies, ironing board, storage bins, practical lighting, photorealistic",
    pastelPromptEn: buildPastelRoomPrompt(
      "Korean apartment utility laundry room with front-loading washing machine, dryer stacked above, shelves with cleaning supplies and detergent bottles, folding ironing board, mop and broom in corner, storage bins on shelf"
    ),
    nodePosition: { x: 85, y: 50 },
    connectedTo: ["bathroom", "balcony"],
    objects: [
      { id: "utility_washer", name: "세탁기", emoji: "🫧", position: { x: 25, y: 50 } },
      { id: "utility_iron", name: "다리미", emoji: "♨️", position: { x: 55, y: 55 } },
      { id: "utility_shelf", name: "수납선반", emoji: "📦", position: { x: 75, y: 35 } },
    ],
  },
  {
    id: "balcony",
    name: "베란다",
    emoji: "🌅",
    description: "바깥 세상을 바라보는 곳",
    imagePromptEn:
      "Interior of a Korean apartment balcony, first-person perspective looking outward, potted plants, clothing drying rack, folding chair, city skyline view through glass, warm sunset lighting, peaceful atmosphere, photorealistic",
    pastelPromptEn: buildPastelRoomPrompt(
      "Korean apartment balcony with various potted plants and flowers, clothing drying rack, wooden folding chair, city skyline view through glass sliding door, warm sunset lighting, small watering can, wind chimes"
    ),
    nodePosition: { x: 95, y: 50 },
    connectedTo: ["utility"],
    objects: [
      { id: "balcony_plant", name: "화분", emoji: "🌱", position: { x: 25, y: 55 } },
      { id: "balcony_rack", name: "빨래건조대", emoji: "👕", position: { x: 55, y: 45 } },
      { id: "balcony_chair", name: "접이식의자", emoji: "🪑", position: { x: 75, y: 65 } },
    ],
  },
];

// ── Generate Rooms from Template ──

function toKebab(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

/**
 * Generate Room[] from a space template and desired count.
 * - Uses template rooms in order, up to `count`
 * - If count > template rooms, generates generic "공간 N" rooms
 * - Assigns linear nodePositions, connectedTo chains
 */
export function generateRooms(templateId: string, count: number): Room[] {
  const template = getTemplateById(templateId);
  if (!template) {
    // Fallback to apartment template
    return generateRooms("apartment", count);
  }

  const rooms: Room[] = [];
  const clampedCount = Math.max(3, Math.min(10, count));

  for (let i = 0; i < clampedCount; i++) {
    const templateRoom: TemplateRoom | undefined = template.rooms[i];

    // Room ID
    const roomId = templateRoom
      ? `${templateId}_${toKebab(templateRoom.name)}_${i}`
      : `${templateId}_space_${i + 1}`;

    // Room name & emoji
    const roomName = templateRoom?.name ?? `공간 ${i + 1}`;
    const roomEmoji = templateRoom?.emoji ?? "📍";

    // Prompt subject
    const promptSubject = templateRoom?.promptSubject
      ?? `A clean minimal room interior, room number ${i + 1}, soft pastel colors, cozy atmosphere, simple furniture`;

    // Objects
    const objects: RoomObject[] = templateRoom
      ? templateRoom.objects.map((obj, objIdx) => ({
          id: `${roomId}_obj_${objIdx}`,
          name: obj.name,
          emoji: obj.emoji,
          position: obj.position,
        }))
      : [
          { id: `${roomId}_obj_0`, name: "물건 A", emoji: "📌", position: { x: 25, y: 50 } },
          { id: `${roomId}_obj_1`, name: "물건 B", emoji: "📎", position: { x: 55, y: 45 } },
          { id: `${roomId}_obj_2`, name: "물건 C", emoji: "📍", position: { x: 80, y: 55 } },
        ];

    // NodePosition — evenly spaced x from 5 to 95, y=50
    const xPos = clampedCount === 1 ? 50 : 5 + (90 * i) / (clampedCount - 1);

    // ConnectedTo — linear chain
    const connectedTo: string[] = [];
    if (i > 0) {
      const prevTemplate = template.rooms[i - 1];
      connectedTo.push(
        prevTemplate
          ? `${templateId}_${toKebab(prevTemplate.name)}_${i - 1}`
          : `${templateId}_space_${i}`
      );
    }
    if (i < clampedCount - 1) {
      const nextTemplate = template.rooms[i + 1];
      connectedTo.push(
        nextTemplate
          ? `${templateId}_${toKebab(nextTemplate.name)}_${i + 1}`
          : `${templateId}_space_${i + 2}`
      );
    }

    const pastelPromptEn = buildPastelRoomPrompt(promptSubject);

    rooms.push({
      id: roomId,
      name: roomName,
      emoji: roomEmoji,
      description: `${template.name} — ${roomName}`,
      imagePromptEn: promptSubject,
      pastelPromptEn,
      nodePosition: { x: Math.round(xPos), y: 50 },
      connectedTo,
      objects,
    });
  }

  return rooms;
}

// ── Helpers ──

export function getAllObjects(): (RoomObject & { roomId: string; roomName: string })[] {
  return ROOMS.flatMap((room) =>
    room.objects.map((obj) => ({ ...obj, roomId: room.id, roomName: room.name }))
  );
}

export function getRoomById(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}
