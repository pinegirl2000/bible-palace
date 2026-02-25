// ============================================
// Bible Palace — Space Template Definitions
// 10 types of memory palace spaces
// Each template has predefined rooms & objects
// ============================================

import { buildPastelRoomPrompt } from "./pastel-prompts";

// ── Types ──

export interface TemplateObject {
  name: string;
  emoji: string;
  position: { x: number; y: number };
}

export interface TemplateRoom {
  name: string;
  emoji: string;
  promptSubject: string; // English description for pastel prompt
  objects: TemplateObject[];
}

export interface SpaceTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rooms: TemplateRoom[];
}

// ── 10 Space Templates ──

export const SPACE_TEMPLATES: SpaceTemplate[] = [
  // 1. 아파트
  {
    id: "apartment",
    name: "아파트",
    emoji: "🏢",
    description: "익숙한 아파트 공간을 활용해요",
    rooms: [
      {
        name: "현관",
        emoji: "🚪",
        promptSubject:
          "Modern Korean apartment entrance hallway with wooden shoe cabinet, umbrella stand in the corner, large wall mirror, key holder on wall, front door with digital keypad, warm wooden floor, small console table with plant",
        objects: [
          { name: "신발장", emoji: "👟", position: { x: 15, y: 65 } },
          { name: "우산꽂이", emoji: "☂️", position: { x: 35, y: 60 } },
          { name: "벽거울", emoji: "🪞", position: { x: 55, y: 35 } },
          { name: "열쇠고리", emoji: "🔑", position: { x: 80, y: 40 } },
        ],
      },
      {
        name: "거실",
        emoji: "🛋️",
        promptSubject:
          "Modern Korean apartment living room with comfortable sofa and colorful cushions, round wall clock, flat screen TV on wooden stand, picture frames on wall, glass coffee table, large windows with curtains, warm afternoon sunlight",
        objects: [
          { name: "소파", emoji: "🛋️", position: { x: 25, y: 60 } },
          { name: "벽시계", emoji: "🕐", position: { x: 50, y: 20 } },
          { name: "TV", emoji: "📺", position: { x: 75, y: 40 } },
          { name: "쿠션", emoji: "🟤", position: { x: 35, y: 70 } },
          { name: "액자", emoji: "🖼️", position: { x: 60, y: 25 } },
        ],
      },
      {
        name: "주방",
        emoji: "🍳",
        promptSubject:
          "Modern Korean apartment kitchen with stainless steel refrigerator, kitchen sink with small window above, microwave on marble counter, glass dish cabinet with plates, cutting board with fruits, pendant lights, clean white tiles",
        objects: [
          { name: "냉장고", emoji: "🧊", position: { x: 15, y: 45 } },
          { name: "싱크대", emoji: "🚰", position: { x: 45, y: 50 } },
          { name: "전자레인지", emoji: "📡", position: { x: 70, y: 35 } },
          { name: "식기장", emoji: "🍽️", position: { x: 85, y: 30 } },
        ],
      },
      {
        name: "식당",
        emoji: "🍽️",
        promptSubject:
          "Korean apartment dining area with wooden dining table and four chairs, hanging pendant lamp above table, fruit bowl centerpiece, small vase with flowers, window with light curtains, warm cozy atmosphere",
        objects: [
          { name: "식탁", emoji: "🪑", position: { x: 45, y: 55 } },
          { name: "펜던트 조명", emoji: "💡", position: { x: 50, y: 15 } },
          { name: "꽃병", emoji: "🌸", position: { x: 30, y: 45 } },
        ],
      },
      {
        name: "침실",
        emoji: "🛏️",
        promptSubject:
          "Cozy Korean apartment bedroom with comfortable bed with fluffy pillows and blanket, wooden wardrobe closet, bedside table with small lamp, tall standing floor lamp, soft warm lighting, peaceful atmosphere, small rug on floor",
        objects: [
          { name: "침대", emoji: "🛏️", position: { x: 40, y: 55 } },
          { name: "옷장", emoji: "👔", position: { x: 15, y: 40 } },
          { name: "협탁", emoji: "🛏️", position: { x: 70, y: 60 } },
          { name: "스탠드", emoji: "💡", position: { x: 80, y: 35 } },
        ],
      },
      {
        name: "드레스룸",
        emoji: "👗",
        promptSubject:
          "Korean apartment walk-in dressing room with clothing racks on both sides, full-length standing mirror, organized shoe shelves, accessories drawer, hat display, soft warm lighting, small ottoman seat",
        objects: [
          { name: "옷걸이", emoji: "👔", position: { x: 20, y: 45 } },
          { name: "전신거울", emoji: "🪞", position: { x: 50, y: 35 } },
          { name: "신발선반", emoji: "👠", position: { x: 75, y: 65 } },
        ],
      },
      {
        name: "서재",
        emoji: "📚",
        promptSubject:
          "Korean apartment study room with wooden desk and open laptop, tall bookshelf filled with colorful books, comfortable swivel office chair, brass desk lamp, potted plant on desk corner, warm cozy lighting, globe on shelf",
        objects: [
          { name: "책상", emoji: "🖥️", position: { x: 45, y: 55 } },
          { name: "책장", emoji: "📚", position: { x: 15, y: 35 } },
          { name: "의자", emoji: "💺", position: { x: 55, y: 70 } },
          { name: "노트북", emoji: "💻", position: { x: 50, y: 45 } },
        ],
      },
      {
        name: "화장실",
        emoji: "🚿",
        promptSubject:
          "Modern Korean apartment bathroom with large round mirror above white sink, deep bathtub with shower, towel rack with colorful towels on wall, clean white tiles, small potted plant, soap dispenser, soft lighting",
        objects: [
          { name: "세면대 거울", emoji: "🪞", position: { x: 40, y: 30 } },
          { name: "욕조", emoji: "🛁", position: { x: 70, y: 55 } },
          { name: "수건걸이", emoji: "🧺", position: { x: 20, y: 50 } },
        ],
      },
      {
        name: "다용도실",
        emoji: "🧹",
        promptSubject:
          "Korean apartment utility laundry room with front-loading washing machine, dryer stacked above, shelves with cleaning supplies and detergent bottles, folding ironing board, mop and broom in corner, storage bins on shelf",
        objects: [
          { name: "세탁기", emoji: "🫧", position: { x: 25, y: 50 } },
          { name: "다리미", emoji: "♨️", position: { x: 55, y: 55 } },
          { name: "수납선반", emoji: "📦", position: { x: 75, y: 35 } },
        ],
      },
      {
        name: "베란다",
        emoji: "🌅",
        promptSubject:
          "Korean apartment balcony with various potted plants and flowers, clothing drying rack, wooden folding chair, city skyline view through glass sliding door, warm sunset lighting, small watering can, wind chimes",
        objects: [
          { name: "화분", emoji: "🌱", position: { x: 25, y: 55 } },
          { name: "빨래건조대", emoji: "👕", position: { x: 55, y: 45 } },
          { name: "접이식의자", emoji: "🪑", position: { x: 75, y: 65 } },
        ],
      },
      // Extra rooms for counts > 10
      {
        name: "안방",
        emoji: "🛌",
        promptSubject:
          "Korean apartment master bedroom with king-size bed, large window with blackout curtains, vanity table with mirror, reading nook with cushion, soft ambient lighting",
        objects: [
          { name: "킹사이즈 침대", emoji: "🛌", position: { x: 40, y: 55 } },
          { name: "화장대", emoji: "💄", position: { x: 15, y: 40 } },
          { name: "독서등", emoji: "📖", position: { x: 75, y: 35 } },
        ],
      },
      {
        name: "아이방",
        emoji: "🧸",
        promptSubject:
          "Korean apartment children's room with bunk bed, colorful toy boxes, small study desk, wall stickers, warm playful atmosphere, bookshelf with picture books",
        objects: [
          { name: "이층침대", emoji: "🛏️", position: { x: 30, y: 50 } },
          { name: "장난감상자", emoji: "🧸", position: { x: 60, y: 65 } },
          { name: "학습책상", emoji: "📝", position: { x: 75, y: 40 } },
        ],
      },
      {
        name: "팬트리",
        emoji: "🫙",
        promptSubject:
          "Korean apartment pantry room with organized shelves full of jars and cans, rice container, snack baskets, spice rack, bright clean lighting",
        objects: [
          { name: "쌀통", emoji: "🍚", position: { x: 25, y: 50 } },
          { name: "양념선반", emoji: "🧂", position: { x: 55, y: 35 } },
          { name: "간식바구니", emoji: "🧺", position: { x: 75, y: 60 } },
        ],
      },
      {
        name: "창고",
        emoji: "📦",
        promptSubject:
          "Korean apartment storage room with stacked boxes, seasonal items, vacuum cleaner, suitcases, organized shelving units, overhead fluorescent light",
        objects: [
          { name: "여행가방", emoji: "🧳", position: { x: 30, y: 55 } },
          { name: "청소기", emoji: "🧹", position: { x: 55, y: 45 } },
          { name: "보관상자", emoji: "📦", position: { x: 75, y: 35 } },
        ],
      },
      {
        name: "홈카페",
        emoji: "☕",
        promptSubject:
          "Korean apartment home cafe corner with espresso machine, cute mugs on shelf, small round table, bar stool, coffee bean jars, warm lighting",
        objects: [
          { name: "커피머신", emoji: "☕", position: { x: 25, y: 45 } },
          { name: "머그컵", emoji: "🍵", position: { x: 50, y: 35 } },
          { name: "바스툴", emoji: "🪑", position: { x: 75, y: 60 } },
        ],
      },
    ],
  },

  // 2. 주택
  {
    id: "house",
    name: "주택",
    emoji: "🏡",
    description: "넓은 주택 공간을 탐험해요",
    rooms: [
      {
        name: "대문",
        emoji: "🚪",
        promptSubject:
          "Traditional Korean house front gate with stone pillars, wooden gate door, mailbox, garden path with stepping stones, decorative lantern, climbing vines",
        objects: [
          { name: "우편함", emoji: "📬", position: { x: 20, y: 45 } },
          { name: "정원등", emoji: "🏮", position: { x: 50, y: 55 } },
          { name: "돌담", emoji: "🧱", position: { x: 80, y: 40 } },
        ],
      },
      {
        name: "마당",
        emoji: "🌳",
        promptSubject:
          "Korean house front yard with green lawn, large tree with swing, flower garden beds, water faucet, small bench, butterflies, sunny day",
        objects: [
          { name: "나무그네", emoji: "🌳", position: { x: 30, y: 40 } },
          { name: "화단", emoji: "🌷", position: { x: 60, y: 60 } },
          { name: "수도꼭지", emoji: "🚿", position: { x: 80, y: 50 } },
        ],
      },
      {
        name: "현관",
        emoji: "🏠",
        promptSubject:
          "Korean house entrance porch with shoe rack, welcome mat, coat hooks on wall, umbrella holder, small window, warm lighting",
        objects: [
          { name: "신발장", emoji: "👟", position: { x: 25, y: 55 } },
          { name: "옷걸이", emoji: "🧥", position: { x: 55, y: 40 } },
          { name: "현관매트", emoji: "🟫", position: { x: 40, y: 70 } },
        ],
      },
      {
        name: "거실",
        emoji: "🛋️",
        promptSubject:
          "Spacious Korean house living room with L-shaped sofa, large window overlooking garden, fireplace, wooden floor, family photos on wall, warm cozy atmosphere",
        objects: [
          { name: "소파", emoji: "🛋️", position: { x: 30, y: 55 } },
          { name: "벽난로", emoji: "🔥", position: { x: 60, y: 35 } },
          { name: "가족사진", emoji: "🖼️", position: { x: 80, y: 25 } },
        ],
      },
      {
        name: "부엌",
        emoji: "🍳",
        promptSubject:
          "Korean house country-style kitchen with large wooden island counter, copper pots hanging, gas stove, rice cooker, window herb garden, warm homey feeling",
        objects: [
          { name: "아일랜드", emoji: "🪵", position: { x: 45, y: 55 } },
          { name: "가스레인지", emoji: "🔥", position: { x: 20, y: 40 } },
          { name: "밥솥", emoji: "🍚", position: { x: 75, y: 45 } },
        ],
      },
      {
        name: "다락방",
        emoji: "🏚️",
        promptSubject:
          "Korean house cozy attic room with slanted ceiling, round window, old trunk, string lights, reading corner with beanbag, vintage bookshelf",
        objects: [
          { name: "오래된 트렁크", emoji: "🧳", position: { x: 30, y: 55 } },
          { name: "둥근창", emoji: "🪟", position: { x: 55, y: 25 } },
          { name: "빈백의자", emoji: "💺", position: { x: 75, y: 60 } },
        ],
      },
      {
        name: "침실",
        emoji: "🛏️",
        promptSubject:
          "Korean house bedroom with wooden bed frame, bedside tables with matching lamps, dresser with mirror, window with garden view, peaceful atmosphere",
        objects: [
          { name: "침대", emoji: "🛏️", position: { x: 40, y: 50 } },
          { name: "서랍장", emoji: "🗄️", position: { x: 15, y: 40 } },
          { name: "탁상램프", emoji: "💡", position: { x: 75, y: 45 } },
        ],
      },
      {
        name: "창고",
        emoji: "🏗️",
        promptSubject:
          "Korean house storage shed with garden tools, bicycle, step ladder, paint cans, organized pegboard wall, skylight window",
        objects: [
          { name: "자전거", emoji: "🚲", position: { x: 30, y: 55 } },
          { name: "정원도구", emoji: "🌻", position: { x: 55, y: 40 } },
          { name: "사다리", emoji: "🪜", position: { x: 80, y: 35 } },
        ],
      },
      {
        name: "옥상",
        emoji: "🌤️",
        promptSubject:
          "Korean house rooftop terrace with potted plants, small table with chairs, clothesline, sky view, sunset lighting, peaceful retreat",
        objects: [
          { name: "옥상테이블", emoji: "🪑", position: { x: 40, y: 50 } },
          { name: "빨래줄", emoji: "👕", position: { x: 70, y: 35 } },
          { name: "화분들", emoji: "🌱", position: { x: 20, y: 60 } },
        ],
      },
      {
        name: "뒤뜰",
        emoji: "🌿",
        promptSubject:
          "Korean house backyard with vegetable garden, small greenhouse, stone path, garden gnome, bird feeder, peaceful green space",
        objects: [
          { name: "텃밭", emoji: "🥬", position: { x: 35, y: 55 } },
          { name: "온실", emoji: "🏡", position: { x: 65, y: 40 } },
          { name: "새집", emoji: "🐦", position: { x: 80, y: 30 } },
        ],
      },
      // Extra rooms
      {
        name: "서재",
        emoji: "📚",
        promptSubject:
          "Korean house study with tall bookshelves, antique wooden desk, leather chair, globe, desk lamp, quiet scholarly atmosphere",
        objects: [
          { name: "책상", emoji: "📚", position: { x: 45, y: 50 } },
          { name: "지구본", emoji: "🌍", position: { x: 20, y: 35 } },
          { name: "책장", emoji: "📖", position: { x: 75, y: 40 } },
        ],
      },
      {
        name: "화장실",
        emoji: "🚿",
        promptSubject:
          "Korean house bathroom with clawfoot bathtub, pedestal sink, round mirror, towel ladder, small window with frosted glass, clean tiles",
        objects: [
          { name: "욕조", emoji: "🛁", position: { x: 40, y: 55 } },
          { name: "거울", emoji: "🪞", position: { x: 60, y: 30 } },
          { name: "수건사다리", emoji: "🧺", position: { x: 80, y: 45 } },
        ],
      },
      {
        name: "다용도실",
        emoji: "🧹",
        promptSubject:
          "Korean house utility room with washing machine, ironing board, cleaning supplies, organized shelves, warm practical lighting",
        objects: [
          { name: "세탁기", emoji: "🫧", position: { x: 30, y: 50 } },
          { name: "다리미판", emoji: "♨️", position: { x: 60, y: 45 } },
          { name: "청소용품", emoji: "🧹", position: { x: 80, y: 35 } },
        ],
      },
      {
        name: "지하실",
        emoji: "🔦",
        promptSubject:
          "Korean house basement with wine rack, home theater setup, storage shelves, board games, cozy carpet, dim warm lighting",
        objects: [
          { name: "와인랙", emoji: "🍷", position: { x: 25, y: 40 } },
          { name: "홈시어터", emoji: "🎬", position: { x: 55, y: 50 } },
          { name: "보드게임", emoji: "🎲", position: { x: 80, y: 60 } },
        ],
      },
      {
        name: "베란다",
        emoji: "🌅",
        promptSubject:
          "Korean house veranda with rocking chair, side table with tea, potted plants, garden view, wind chimes, relaxing afternoon light",
        objects: [
          { name: "흔들의자", emoji: "🪑", position: { x: 35, y: 55 } },
          { name: "찻잔", emoji: "🍵", position: { x: 55, y: 40 } },
          { name: "풍경", emoji: "🎐", position: { x: 75, y: 25 } },
        ],
      },
    ],
  },

  // 3. 지하철 노선
  {
    id: "subway",
    name: "지하철 노선",
    emoji: "🚇",
    description: "지하철 역을 따라 기억해요",
    rooms: [
      {
        name: "출발역",
        emoji: "🚉",
        promptSubject:
          "Modern Korean subway station entrance with ticket gates, information board, vending machines, escalator going down, bright fluorescent lighting, clean tiled floor",
        objects: [
          { name: "개찰구", emoji: "🎫", position: { x: 40, y: 55 } },
          { name: "안내판", emoji: "📋", position: { x: 20, y: 30 } },
          { name: "자판기", emoji: "🥤", position: { x: 75, y: 50 } },
        ],
      },
      {
        name: "플랫폼",
        emoji: "🚏",
        promptSubject:
          "Korean subway platform with safety doors, digital arrival display, bench seats, platform edge markings, train tracks, station name sign",
        objects: [
          { name: "안전문", emoji: "🚪", position: { x: 45, y: 45 } },
          { name: "벤치", emoji: "🪑", position: { x: 20, y: 60 } },
          { name: "전광판", emoji: "📺", position: { x: 70, y: 25 } },
        ],
      },
      {
        name: "열차 안",
        emoji: "🚃",
        promptSubject:
          "Inside Korean subway train car with seats along walls, hanging straps, route map above door, window view of tunnel, passengers reading, warm interior light",
        objects: [
          { name: "좌석", emoji: "💺", position: { x: 30, y: 55 } },
          { name: "손잡이", emoji: "🤚", position: { x: 50, y: 20 } },
          { name: "노선도", emoji: "🗺️", position: { x: 75, y: 30 } },
        ],
      },
      {
        name: "환승역",
        emoji: "🔄",
        promptSubject:
          "Korean subway transfer station with long corridor, directional signs, escalators, colorful line indicators on walls, busy atmosphere, bright lighting",
        objects: [
          { name: "방향표지", emoji: "➡️", position: { x: 40, y: 30 } },
          { name: "에스컬레이터", emoji: "🪜", position: { x: 65, y: 50 } },
          { name: "노선표시", emoji: "🔵", position: { x: 20, y: 45 } },
        ],
      },
      {
        name: "지하상가",
        emoji: "🏪",
        promptSubject:
          "Korean underground shopping area connected to subway with small shops, food stalls, clothing stores, bright signs, tiled walkway, busy but cozy",
        objects: [
          { name: "분식집", emoji: "🍜", position: { x: 25, y: 50 } },
          { name: "옷가게", emoji: "👕", position: { x: 55, y: 45 } },
          { name: "액세서리샵", emoji: "💍", position: { x: 80, y: 55 } },
        ],
      },
      {
        name: "대합실",
        emoji: "🏛️",
        promptSubject:
          "Korean subway station waiting hall with high ceiling, clock, benches, kiosk, newspaper stand, information desk, spacious clean area",
        objects: [
          { name: "대형시계", emoji: "🕐", position: { x: 50, y: 20 } },
          { name: "키오스크", emoji: "🖥️", position: { x: 25, y: 50 } },
          { name: "안내데스크", emoji: "💁", position: { x: 75, y: 45 } },
        ],
      },
      {
        name: "편의점",
        emoji: "🏬",
        promptSubject:
          "Small Korean convenience store inside subway station with snack shelves, drink refrigerator, counter with register, microwave, bright fluorescent light",
        objects: [
          { name: "과자선반", emoji: "🍪", position: { x: 30, y: 45 } },
          { name: "음료냉장고", emoji: "🥤", position: { x: 60, y: 50 } },
          { name: "계산대", emoji: "💰", position: { x: 80, y: 40 } },
        ],
      },
      {
        name: "계단통로",
        emoji: "🪜",
        promptSubject:
          "Korean subway station stairway and corridor with handrails, step numbers, directional arrows on wall, emergency exit sign, tile walls, echo-y atmosphere",
        objects: [
          { name: "계단", emoji: "🪜", position: { x: 40, y: 50 } },
          { name: "비상구표시", emoji: "🟢", position: { x: 65, y: 25 } },
          { name: "난간", emoji: "🛟", position: { x: 20, y: 40 } },
        ],
      },
      {
        name: "출구",
        emoji: "🚶",
        promptSubject:
          "Korean subway station exit area with numbered exit signs, stairs going up to street level, sunlight coming in from above, city sounds, fresh air",
        objects: [
          { name: "출구번호", emoji: "🔢", position: { x: 30, y: 30 } },
          { name: "올라가는 계단", emoji: "⬆️", position: { x: 55, y: 50 } },
          { name: "지상출구", emoji: "☀️", position: { x: 80, y: 35 } },
        ],
      },
      {
        name: "종착역",
        emoji: "🏁",
        promptSubject:
          "Korean subway terminal station with end-of-line buffer, quiet platform, maintenance area visible, departure board, peaceful atmosphere, fewer people",
        objects: [
          { name: "종착안내", emoji: "🏁", position: { x: 40, y: 35 } },
          { name: "시간표", emoji: "🕐", position: { x: 65, y: 30 } },
          { name: "대기벤치", emoji: "🪑", position: { x: 25, y: 60 } },
        ],
      },
      // Extra stations
      {
        name: "공원역",
        emoji: "🌳",
        promptSubject:
          "Korean subway station near a park with nature-themed murals, green benches, plant decorations, exit to park visible, fresh atmosphere",
        objects: [
          { name: "벽화", emoji: "🎨", position: { x: 35, y: 35 } },
          { name: "초록벤치", emoji: "🪑", position: { x: 60, y: 55 } },
          { name: "화분장식", emoji: "🌿", position: { x: 80, y: 40 } },
        ],
      },
      {
        name: "시장역",
        emoji: "🛒",
        promptSubject:
          "Korean subway station near traditional market with market map on wall, food smell, bustling exit, colorful directional signs, lively atmosphere",
        objects: [
          { name: "시장안내도", emoji: "🗺️", position: { x: 30, y: 40 } },
          { name: "출구표지", emoji: "🔴", position: { x: 55, y: 30 } },
          { name: "광고판", emoji: "📰", position: { x: 80, y: 50 } },
        ],
      },
    ],
  },

  // 4. 출근길
  {
    id: "commute",
    name: "출근길",
    emoji: "🚶",
    description: "매일의 출근길을 따라가요",
    rooms: [
      {
        name: "집 앞",
        emoji: "🏠",
        promptSubject:
          "Front of Korean apartment building, morning sunlight, mailbox area, bicycle rack, small garden, residents entering and leaving",
        objects: [
          { name: "우편함", emoji: "📬", position: { x: 25, y: 50 } },
          { name: "자전거거치대", emoji: "🚲", position: { x: 55, y: 55 } },
          { name: "화단", emoji: "🌼", position: { x: 80, y: 45 } },
        ],
      },
      {
        name: "버스 정류장",
        emoji: "🚌",
        promptSubject:
          "Korean bus stop with shelter, route map, bench, digital arrival board, morning commuters waiting, street view, clear sky",
        objects: [
          { name: "노선도", emoji: "🗺️", position: { x: 30, y: 35 } },
          { name: "정류장벤치", emoji: "🪑", position: { x: 55, y: 60 } },
          { name: "도착안내판", emoji: "📺", position: { x: 75, y: 30 } },
        ],
      },
      {
        name: "횡단보도",
        emoji: "🚦",
        promptSubject:
          "Korean city crosswalk with traffic light, zebra stripes, pedestrians crossing, buildings on both sides, morning rush, clear weather",
        objects: [
          { name: "신호등", emoji: "🚦", position: { x: 40, y: 25 } },
          { name: "횡단보도", emoji: "🦓", position: { x: 50, y: 60 } },
          { name: "가로수", emoji: "🌳", position: { x: 80, y: 40 } },
        ],
      },
      {
        name: "편의점",
        emoji: "🏪",
        promptSubject:
          "Korean convenience store front with bright sign, automatic door, morning coffee display, newspaper rack, clean sidewalk",
        objects: [
          { name: "커피코너", emoji: "☕", position: { x: 30, y: 45 } },
          { name: "간판", emoji: "💡", position: { x: 55, y: 20 } },
          { name: "신문꽂이", emoji: "📰", position: { x: 75, y: 50 } },
        ],
      },
      {
        name: "공원 길",
        emoji: "🌿",
        promptSubject:
          "Korean urban park path in morning, tree-lined walkway, joggers, park bench, small fountain, birds singing, fresh morning air",
        objects: [
          { name: "벤치", emoji: "🪑", position: { x: 25, y: 55 } },
          { name: "분수대", emoji: "⛲", position: { x: 55, y: 40 } },
          { name: "가로등", emoji: "🏮", position: { x: 80, y: 35 } },
        ],
      },
      {
        name: "지하도",
        emoji: "🚇",
        promptSubject:
          "Korean underground pedestrian passage with tiled walls, fluorescent lights, directional signs, small shops, echo atmosphere, pedestrians walking",
        objects: [
          { name: "방향표지", emoji: "➡️", position: { x: 35, y: 30 } },
          { name: "타일벽", emoji: "🧱", position: { x: 55, y: 45 } },
          { name: "형광등", emoji: "💡", position: { x: 75, y: 20 } },
        ],
      },
      {
        name: "카페",
        emoji: "☕",
        promptSubject:
          "Korean morning cafe with takeout counter, espresso machine, pastry display, morning commuters getting coffee, warm cozy interior",
        objects: [
          { name: "에스프레소머신", emoji: "☕", position: { x: 30, y: 45 } },
          { name: "빵진열대", emoji: "🥐", position: { x: 55, y: 50 } },
          { name: "테이크아웃 카운터", emoji: "🥤", position: { x: 80, y: 40 } },
        ],
      },
      {
        name: "사무실 입구",
        emoji: "🏢",
        promptSubject:
          "Korean office building entrance lobby with revolving door, security desk, elevator hall, company logo on wall, marble floor, professional atmosphere",
        objects: [
          { name: "회전문", emoji: "🚪", position: { x: 40, y: 50 } },
          { name: "안내데스크", emoji: "💁", position: { x: 65, y: 45 } },
          { name: "회사로고", emoji: "🏷️", position: { x: 50, y: 20 } },
        ],
      },
      {
        name: "엘리베이터",
        emoji: "🛗",
        promptSubject:
          "Korean office elevator interior with mirror wall, floor buttons, small screen showing news, polished metal doors, colleagues riding together",
        objects: [
          { name: "층수버튼", emoji: "🔢", position: { x: 30, y: 45 } },
          { name: "거울벽", emoji: "🪞", position: { x: 60, y: 40 } },
          { name: "안내화면", emoji: "📺", position: { x: 50, y: 20 } },
        ],
      },
      {
        name: "내 자리",
        emoji: "💼",
        promptSubject:
          "Korean office desk workspace with monitor, keyboard, coffee mug, desk plant, sticky notes, family photo frame, organized and productive",
        objects: [
          { name: "모니터", emoji: "🖥️", position: { x: 45, y: 40 } },
          { name: "커피머그", emoji: "☕", position: { x: 20, y: 55 } },
          { name: "메모지", emoji: "📝", position: { x: 75, y: 50 } },
        ],
      },
      // Extra
      {
        name: "회의실",
        emoji: "📊",
        promptSubject:
          "Korean office meeting room with long table, projector screen, whiteboard, water bottles, glass walls, professional setting",
        objects: [
          { name: "프로젝터", emoji: "📽️", position: { x: 50, y: 25 } },
          { name: "화이트보드", emoji: "📋", position: { x: 20, y: 40 } },
          { name: "회의탁자", emoji: "🪑", position: { x: 50, y: 60 } },
        ],
      },
      {
        name: "휴게실",
        emoji: "🍵",
        promptSubject:
          "Korean office break room with coffee machine, snack counter, comfy sofa, small TV, water cooler, relaxing atmosphere",
        objects: [
          { name: "커피머신", emoji: "☕", position: { x: 30, y: 45 } },
          { name: "간식코너", emoji: "🍪", position: { x: 60, y: 50 } },
          { name: "정수기", emoji: "💧", position: { x: 80, y: 40 } },
        ],
      },
    ],
  },

  // 5. 산책로
  {
    id: "trail",
    name: "산책로",
    emoji: "🌿",
    description: "자연 속 산책길을 걸어요",
    rooms: [
      {
        name: "출발점",
        emoji: "🚩",
        promptSubject:
          "Start of a Korean park walking trail with wooden sign post, trail map board, gravel path ahead, morning mist, trees on both sides, peaceful nature",
        objects: [
          { name: "이정표", emoji: "🪧", position: { x: 40, y: 45 } },
          { name: "안내판", emoji: "🗺️", position: { x: 20, y: 35 } },
          { name: "입구문", emoji: "🚪", position: { x: 70, y: 50 } },
        ],
      },
      {
        name: "벤치",
        emoji: "🪑",
        promptSubject:
          "Wooden bench along Korean park trail under a large tree, birds in branches, wildflowers nearby, dappled sunlight, peaceful resting spot",
        objects: [
          { name: "나무벤치", emoji: "🪑", position: { x: 45, y: 55 } },
          { name: "큰나무", emoji: "🌳", position: { x: 20, y: 30 } },
          { name: "야생화", emoji: "🌼", position: { x: 75, y: 60 } },
        ],
      },
      {
        name: "분수대",
        emoji: "⛲",
        promptSubject:
          "Decorative fountain in Korean park with water spraying, surrounding stone seating, small fish in basin, pigeons nearby, refreshing atmosphere",
        objects: [
          { name: "분수", emoji: "⛲", position: { x: 45, y: 45 } },
          { name: "돌의자", emoji: "🪨", position: { x: 20, y: 60 } },
          { name: "비둘기", emoji: "🕊️", position: { x: 75, y: 40 } },
        ],
      },
      {
        name: "정자",
        emoji: "🏛️",
        promptSubject:
          "Traditional Korean pavilion (jeongja) in park with wooden pillars, curved roof, stone steps, view of pond, autumn leaves, serene atmosphere",
        objects: [
          { name: "기둥", emoji: "🏛️", position: { x: 35, y: 40 } },
          { name: "처마", emoji: "🏗️", position: { x: 50, y: 15 } },
          { name: "돌계단", emoji: "🪨", position: { x: 65, y: 65 } },
        ],
      },
      {
        name: "연못",
        emoji: "🌊",
        promptSubject:
          "Korean park pond with lily pads, koi fish, small wooden bridge, weeping willow tree, dragonflies, calm reflective water surface",
        objects: [
          { name: "연꽃", emoji: "🪷", position: { x: 40, y: 50 } },
          { name: "나무다리", emoji: "🌉", position: { x: 65, y: 40 } },
          { name: "수양버들", emoji: "🌿", position: { x: 20, y: 35 } },
        ],
      },
      {
        name: "오솔길",
        emoji: "🛤️",
        promptSubject:
          "Narrow Korean forest trail with overhanging branches forming a canopy, fallen leaves on path, mushrooms on tree stumps, mysterious peaceful atmosphere",
        objects: [
          { name: "낙엽길", emoji: "🍂", position: { x: 45, y: 60 } },
          { name: "버섯", emoji: "🍄", position: { x: 20, y: 45 } },
          { name: "나뭇가지", emoji: "🌿", position: { x: 70, y: 30 } },
        ],
      },
      {
        name: "전망대",
        emoji: "🔭",
        promptSubject:
          "Korean park observation deck on hilltop with railing, panoramic view of city and mountains, telescope, wind blowing, clear sky, breathtaking view",
        objects: [
          { name: "망원경", emoji: "🔭", position: { x: 50, y: 45 } },
          { name: "난간", emoji: "🛟", position: { x: 30, y: 55 } },
          { name: "전망안내", emoji: "📋", position: { x: 75, y: 35 } },
        ],
      },
      {
        name: "휴식터",
        emoji: "🧘",
        promptSubject:
          "Korean trail rest area with wooden tables, water fountain, recycling bins, shade trees, birds singing, families resting, peaceful afternoon",
        objects: [
          { name: "나무탁자", emoji: "🪵", position: { x: 40, y: 55 } },
          { name: "음수대", emoji: "💧", position: { x: 65, y: 40 } },
          { name: "그늘나무", emoji: "🌳", position: { x: 20, y: 30 } },
        ],
      },
      {
        name: "꽃길",
        emoji: "🌸",
        promptSubject:
          "Korean park flower-lined path with cherry blossoms, tulip beds, butterfly, garden lights along path, romantic atmosphere, spring feeling",
        objects: [
          { name: "벚꽃나무", emoji: "🌸", position: { x: 35, y: 35 } },
          { name: "튤립화단", emoji: "🌷", position: { x: 60, y: 55 } },
          { name: "나비", emoji: "🦋", position: { x: 80, y: 40 } },
        ],
      },
      {
        name: "도착점",
        emoji: "🏁",
        promptSubject:
          "End of Korean park walking trail with completion marker stone, return path sign, panoramic view, bench for reflection, satisfying achievement feeling",
        objects: [
          { name: "완주석", emoji: "🪨", position: { x: 45, y: 50 } },
          { name: "복귀안내", emoji: "🪧", position: { x: 20, y: 40 } },
          { name: "쉼터벤치", emoji: "🪑", position: { x: 75, y: 55 } },
        ],
      },
      // Extra
      {
        name: "계곡",
        emoji: "💧",
        promptSubject:
          "Korean forest valley stream with stepping stones, clear water, smooth rocks, small waterfall, ferns and moss, tranquil sound of water",
        objects: [
          { name: "징검돌", emoji: "🪨", position: { x: 40, y: 55 } },
          { name: "작은폭포", emoji: "💧", position: { x: 65, y: 35 } },
          { name: "이끼바위", emoji: "🌿", position: { x: 20, y: 45 } },
        ],
      },
      {
        name: "놀이터",
        emoji: "🎠",
        promptSubject:
          "Korean park playground with slide, swings, sandbox, colorful equipment, rubber mat floor, trees around, joyful atmosphere",
        objects: [
          { name: "미끄럼틀", emoji: "🎢", position: { x: 35, y: 50 } },
          { name: "그네", emoji: "🎠", position: { x: 60, y: 45 } },
          { name: "모래밭", emoji: "🏖️", position: { x: 80, y: 60 } },
        ],
      },
    ],
  },

  // 6. 교회
  {
    id: "church",
    name: "교회",
    emoji: "⛪",
    description: "교회 공간에서 말씀을 새겨요",
    rooms: [
      {
        name: "입구",
        emoji: "⛪",
        promptSubject:
          "Korean church entrance with large wooden doors, welcome sign, bulletin board, umbrella stand, warm greeting atmosphere, stained glass window above door",
        objects: [
          { name: "교회문", emoji: "🚪", position: { x: 45, y: 50 } },
          { name: "게시판", emoji: "📋", position: { x: 20, y: 35 } },
          { name: "스테인드글라스", emoji: "🪟", position: { x: 70, y: 20 } },
        ],
      },
      {
        name: "로비",
        emoji: "🏛️",
        promptSubject:
          "Korean church lobby with welcome desk, coffee station, informational brochures, flower arrangement, warm lighting, community photos on wall",
        objects: [
          { name: "안내데스크", emoji: "💁", position: { x: 40, y: 50 } },
          { name: "커피스테이션", emoji: "☕", position: { x: 70, y: 45 } },
          { name: "꽃장식", emoji: "💐", position: { x: 20, y: 40 } },
        ],
      },
      {
        name: "예배당",
        emoji: "🙏",
        promptSubject:
          "Korean church sanctuary with rows of pews, central aisle, large cross on wall, stained glass windows, pulpit, choir area, organ, reverent atmosphere, warm lighting",
        objects: [
          { name: "십자가", emoji: "✝️", position: { x: 50, y: 15 } },
          { name: "좌석", emoji: "🪑", position: { x: 40, y: 60 } },
          { name: "스테인드글라스", emoji: "🪟", position: { x: 80, y: 30 } },
          { name: "오르간", emoji: "🎹", position: { x: 20, y: 40 } },
        ],
      },
      {
        name: "강단",
        emoji: "📖",
        promptSubject:
          "Korean church pulpit area with wooden podium, open Bible, microphone, flowers on both sides, spotlight, choir seats behind, sacred atmosphere",
        objects: [
          { name: "강대상", emoji: "📖", position: { x: 45, y: 45 } },
          { name: "마이크", emoji: "🎤", position: { x: 50, y: 35 } },
          { name: "꽃다발", emoji: "💐", position: { x: 75, y: 50 } },
        ],
      },
      {
        name: "기도실",
        emoji: "🕯️",
        promptSubject:
          "Korean church prayer room with kneeling cushions, candles, cross on wall, quiet dim lighting, Bible on small table, peaceful spiritual atmosphere",
        objects: [
          { name: "무릎꿇기쿠션", emoji: "🧎", position: { x: 40, y: 60 } },
          { name: "촛불", emoji: "🕯️", position: { x: 60, y: 35 } },
          { name: "성경", emoji: "📖", position: { x: 25, y: 45 } },
        ],
      },
      {
        name: "도서관",
        emoji: "📚",
        promptSubject:
          "Korean church library with theological books on shelves, reading tables, study Bibles, quiet study corner, warm lamp lighting, spiritual growth resources",
        objects: [
          { name: "성경주석", emoji: "📚", position: { x: 30, y: 40 } },
          { name: "독서테이블", emoji: "📖", position: { x: 55, y: 55 } },
          { name: "스탠드조명", emoji: "💡", position: { x: 80, y: 35 } },
        ],
      },
      {
        name: "교육관",
        emoji: "📝",
        promptSubject:
          "Korean church education building classroom with whiteboard, small chairs and tables, Sunday school materials, colorful posters, children's artwork on walls",
        objects: [
          { name: "칠판", emoji: "📝", position: { x: 45, y: 30 } },
          { name: "교재", emoji: "📖", position: { x: 20, y: 50 } },
          { name: "어린이 그림", emoji: "🎨", position: { x: 75, y: 40 } },
        ],
      },
      {
        name: "찬양실",
        emoji: "🎵",
        promptSubject:
          "Korean church worship practice room with piano, guitar stands, drum set, music stands, sound equipment, microphones, creative worship atmosphere",
        objects: [
          { name: "피아노", emoji: "🎹", position: { x: 35, y: 50 } },
          { name: "기타", emoji: "🎸", position: { x: 60, y: 45 } },
          { name: "드럼", emoji: "🥁", position: { x: 80, y: 55 } },
        ],
      },
      {
        name: "식당",
        emoji: "🍽️",
        promptSubject:
          "Korean church fellowship hall with long tables, kitchen serving window, community meal setting, warm atmosphere, groups sharing food",
        objects: [
          { name: "긴 테이블", emoji: "🪑", position: { x: 45, y: 55 } },
          { name: "배식대", emoji: "🍽️", position: { x: 20, y: 40 } },
          { name: "식기", emoji: "🥄", position: { x: 75, y: 50 } },
        ],
      },
      {
        name: "정원",
        emoji: "🌹",
        promptSubject:
          "Korean church garden courtyard with stone cross, rose bushes, prayer walking path, wooden bench, fountain, peaceful meditation space",
        objects: [
          { name: "돌십자가", emoji: "✝️", position: { x: 50, y: 35 } },
          { name: "장미덤불", emoji: "🌹", position: { x: 25, y: 55 } },
          { name: "기도산책길", emoji: "🛤️", position: { x: 75, y: 60 } },
        ],
      },
      // Extra
      {
        name: "상담실",
        emoji: "🤝",
        promptSubject:
          "Korean church counseling room with comfortable chairs, tissues box, calming artwork, cross on wall, private and warm atmosphere",
        objects: [
          { name: "안락의자", emoji: "🛋️", position: { x: 40, y: 55 } },
          { name: "벽걸이십자가", emoji: "✝️", position: { x: 60, y: 25 } },
          { name: "성경말씀액자", emoji: "🖼️", position: { x: 80, y: 40 } },
        ],
      },
      {
        name: "종탑",
        emoji: "🔔",
        promptSubject:
          "Korean church bell tower with large bell, spiral staircase, small window with view, rope, old wooden beams, historic atmosphere",
        objects: [
          { name: "종", emoji: "🔔", position: { x: 50, y: 30 } },
          { name: "나선계단", emoji: "🌀", position: { x: 25, y: 55 } },
          { name: "작은창", emoji: "🪟", position: { x: 75, y: 40 } },
        ],
      },
    ],
  },

  // 7. 학교
  {
    id: "school",
    name: "학교",
    emoji: "🏫",
    description: "학교 곳곳에서 기억해요",
    rooms: [
      {
        name: "교문",
        emoji: "🏫",
        promptSubject:
          "Korean school front gate with school name sign, guard post, flower beds on sides, students walking in, morning flag, welcoming atmosphere",
        objects: [
          { name: "학교명판", emoji: "🏷️", position: { x: 45, y: 25 } },
          { name: "수위실", emoji: "🏠", position: { x: 20, y: 50 } },
          { name: "화단", emoji: "🌷", position: { x: 75, y: 55 } },
        ],
      },
      {
        name: "운동장",
        emoji: "⚽",
        promptSubject:
          "Korean school playground with soccer goal, running track, basketball hoop, sand pit, blue sky, wide open space, energetic atmosphere",
        objects: [
          { name: "축구골대", emoji: "⚽", position: { x: 30, y: 50 } },
          { name: "농구대", emoji: "🏀", position: { x: 65, y: 40 } },
          { name: "트랙", emoji: "🏃", position: { x: 50, y: 70 } },
        ],
      },
      {
        name: "교실",
        emoji: "📖",
        promptSubject:
          "Korean school classroom with rows of desks, blackboard with chalk writing, teacher's desk, window with sunlight, class schedule on wall, learning atmosphere",
        objects: [
          { name: "칠판", emoji: "📝", position: { x: 50, y: 25 } },
          { name: "책상", emoji: "📖", position: { x: 40, y: 55 } },
          { name: "교탁", emoji: "🎓", position: { x: 70, y: 35 } },
        ],
      },
      {
        name: "복도",
        emoji: "🚶",
        promptSubject:
          "Korean school hallway with lockers on one side, classroom doors, notice board, shoe cubbies, sunlight through windows, echoing footsteps",
        objects: [
          { name: "사물함", emoji: "🗄️", position: { x: 25, y: 45 } },
          { name: "게시판", emoji: "📋", position: { x: 55, y: 35 } },
          { name: "창문", emoji: "🪟", position: { x: 80, y: 30 } },
        ],
      },
      {
        name: "도서관",
        emoji: "📚",
        promptSubject:
          "Korean school library with tall bookshelves, reading desks, computer stations, librarian desk, globe, quiet study atmosphere, warm lighting",
        objects: [
          { name: "책장", emoji: "📚", position: { x: 20, y: 40 } },
          { name: "열람석", emoji: "📖", position: { x: 50, y: 55 } },
          { name: "지구본", emoji: "🌍", position: { x: 80, y: 35 } },
        ],
      },
      {
        name: "과학실",
        emoji: "🔬",
        promptSubject:
          "Korean school science lab with microscopes on tables, test tubes, periodic table poster, skeleton model, safety goggles, curious atmosphere",
        objects: [
          { name: "현미경", emoji: "🔬", position: { x: 35, y: 50 } },
          { name: "시험관", emoji: "🧪", position: { x: 60, y: 40 } },
          { name: "주기율표", emoji: "📊", position: { x: 80, y: 25 } },
        ],
      },
      {
        name: "음악실",
        emoji: "🎵",
        promptSubject:
          "Korean school music room with upright piano, music stands, hanging instruments, drum set, concert posters, sound-proofed walls, creative atmosphere",
        objects: [
          { name: "피아노", emoji: "🎹", position: { x: 40, y: 50 } },
          { name: "음악보면대", emoji: "🎵", position: { x: 65, y: 45 } },
          { name: "악기함", emoji: "🎺", position: { x: 20, y: 40 } },
        ],
      },
      {
        name: "급식실",
        emoji: "🍱",
        promptSubject:
          "Korean school cafeteria with food serving line, trays, long tables with benches, menu board, kitchen visible, lunchtime atmosphere",
        objects: [
          { name: "배식대", emoji: "🍽️", position: { x: 30, y: 45 } },
          { name: "급식판", emoji: "🍱", position: { x: 55, y: 55 } },
          { name: "메뉴판", emoji: "📋", position: { x: 80, y: 30 } },
        ],
      },
      {
        name: "체육관",
        emoji: "🏐",
        promptSubject:
          "Korean school gymnasium with wooden floor, basketball hoops, volleyball net, bleachers, high ceiling, sports banners, active atmosphere",
        objects: [
          { name: "농구골대", emoji: "🏀", position: { x: 50, y: 20 } },
          { name: "매트", emoji: "🤸", position: { x: 30, y: 60 } },
          { name: "관중석", emoji: "🪑", position: { x: 80, y: 50 } },
        ],
      },
      {
        name: "옥상",
        emoji: "🌤️",
        promptSubject:
          "Korean school rooftop with fence, panoramic view, water tank, ventilation units, blue sky, school bell visible, peaceful hidden spot",
        objects: [
          { name: "펜스", emoji: "🛟", position: { x: 40, y: 40 } },
          { name: "물탱크", emoji: "💧", position: { x: 70, y: 30 } },
          { name: "학교종", emoji: "🔔", position: { x: 25, y: 25 } },
        ],
      },
      // Extra
      {
        name: "미술실",
        emoji: "🎨",
        promptSubject:
          "Korean school art room with easels, paint supplies, student artwork displayed, pottery wheel, colorful creative messy atmosphere",
        objects: [
          { name: "이젤", emoji: "🎨", position: { x: 35, y: 50 } },
          { name: "물감", emoji: "🎨", position: { x: 60, y: 40 } },
          { name: "도자기", emoji: "🏺", position: { x: 80, y: 55 } },
        ],
      },
      {
        name: "컴퓨터실",
        emoji: "💻",
        promptSubject:
          "Korean school computer lab with rows of desktop computers, projector, teacher station, keyboard typing sounds, modern technology atmosphere",
        objects: [
          { name: "컴퓨터", emoji: "🖥️", position: { x: 40, y: 50 } },
          { name: "프로젝터", emoji: "📽️", position: { x: 65, y: 25 } },
          { name: "프린터", emoji: "🖨️", position: { x: 20, y: 45 } },
        ],
      },
    ],
  },

  // 8. 카페
  {
    id: "cafe",
    name: "카페",
    emoji: "☕",
    description: "아늑한 카페에서 묵상해요",
    rooms: [
      {
        name: "입구",
        emoji: "🚪",
        promptSubject:
          "Korean cafe entrance with glass door, open sign, chalkboard menu outside, potted plants, warm inviting glow from inside, bell on door",
        objects: [
          { name: "오픈 사인", emoji: "💡", position: { x: 40, y: 35 } },
          { name: "칠판메뉴", emoji: "📋", position: { x: 20, y: 50 } },
          { name: "입구화분", emoji: "🌿", position: { x: 75, y: 55 } },
        ],
      },
      {
        name: "카운터",
        emoji: "💰",
        promptSubject:
          "Korean cafe order counter with espresso machine, menu board on wall, pastry display case, cash register, cups stacked, barista area",
        objects: [
          { name: "에스프레소머신", emoji: "☕", position: { x: 35, y: 45 } },
          { name: "메뉴보드", emoji: "📋", position: { x: 55, y: 20 } },
          { name: "빵 진열장", emoji: "🥐", position: { x: 75, y: 50 } },
        ],
      },
      {
        name: "창가석",
        emoji: "🪟",
        promptSubject:
          "Korean cafe window seat area with small round tables, high chairs, large window with street view, sunlight streaming in, coffee and books on table",
        objects: [
          { name: "원형테이블", emoji: "🔵", position: { x: 40, y: 55 } },
          { name: "높은의자", emoji: "🪑", position: { x: 25, y: 50 } },
          { name: "커피잔", emoji: "☕", position: { x: 65, y: 45 } },
        ],
      },
      {
        name: "소파석",
        emoji: "🛋️",
        promptSubject:
          "Korean cafe cozy sofa corner with comfortable sofa, low coffee table, floor lamp, bookshelf, cushions, relaxing lounge atmosphere",
        objects: [
          { name: "소파", emoji: "🛋️", position: { x: 35, y: 55 } },
          { name: "낮은테이블", emoji: "🪵", position: { x: 55, y: 60 } },
          { name: "플로어램프", emoji: "💡", position: { x: 80, y: 35 } },
        ],
      },
      {
        name: "테라스",
        emoji: "🌞",
        promptSubject:
          "Korean cafe outdoor terrace with patio furniture, umbrella, potted flowers, string lights, city street view, fresh breeze, al fresco dining",
        objects: [
          { name: "파라솔", emoji: "⛱️", position: { x: 45, y: 30 } },
          { name: "야외테이블", emoji: "🪑", position: { x: 35, y: 55 } },
          { name: "조명줄", emoji: "✨", position: { x: 70, y: 20 } },
        ],
      },
      {
        name: "2층",
        emoji: "⬆️",
        promptSubject:
          "Second floor of Korean cafe with wooden stairs, mezzanine seating, artistic decorations, quiet atmosphere, view overlooking first floor, warm pendant lights",
        objects: [
          { name: "나무계단", emoji: "🪜", position: { x: 20, y: 50 } },
          { name: "메자닌석", emoji: "🪑", position: { x: 50, y: 45 } },
          { name: "펜던트조명", emoji: "💡", position: { x: 75, y: 25 } },
        ],
      },
      {
        name: "서재코너",
        emoji: "📚",
        promptSubject:
          "Korean cafe library corner with bookshelves, reading desk, desk lamp, quiet zone sign, comfortable armchair, intellectual cozy atmosphere",
        objects: [
          { name: "책장", emoji: "📚", position: { x: 30, y: 40 } },
          { name: "독서등", emoji: "💡", position: { x: 55, y: 35 } },
          { name: "암체어", emoji: "💺", position: { x: 75, y: 55 } },
        ],
      },
      {
        name: "베이커리",
        emoji: "🥖",
        promptSubject:
          "Korean cafe bakery section with bread display racks, oven visible, tongs and trays, fresh baked goods, warm bread smell atmosphere",
        objects: [
          { name: "빵진열대", emoji: "🥖", position: { x: 40, y: 50 } },
          { name: "오븐", emoji: "🔥", position: { x: 70, y: 40 } },
          { name: "집게와 쟁반", emoji: "🍞", position: { x: 25, y: 55 } },
        ],
      },
      {
        name: "루프탑",
        emoji: "🌅",
        promptSubject:
          "Korean cafe rooftop area with sunset view, fairy lights, swing bench, small bar counter, plants, romantic evening atmosphere",
        objects: [
          { name: "스윙벤치", emoji: "🪑", position: { x: 35, y: 50 } },
          { name: "바카운터", emoji: "🍹", position: { x: 65, y: 45 } },
          { name: "조명장식", emoji: "✨", position: { x: 50, y: 20 } },
        ],
      },
      {
        name: "화장실",
        emoji: "🚿",
        promptSubject:
          "Stylish Korean cafe bathroom with decorative mirror, artistic tiles, small succulent plant, soap dispenser, clean modern design, ambient lighting",
        objects: [
          { name: "거울", emoji: "🪞", position: { x: 45, y: 35 } },
          { name: "다육식물", emoji: "🌵", position: { x: 70, y: 50 } },
          { name: "타일벽", emoji: "🧱", position: { x: 25, y: 45 } },
        ],
      },
      // Extra
      {
        name: "갤러리벽",
        emoji: "🎨",
        promptSubject:
          "Korean cafe gallery wall section with framed artwork, spotlight lights, artistic photographs, creative exhibition space",
        objects: [
          { name: "그림", emoji: "🖼️", position: { x: 35, y: 35 } },
          { name: "조명", emoji: "💡", position: { x: 55, y: 25 } },
          { name: "사진작품", emoji: "📷", position: { x: 80, y: 40 } },
        ],
      },
      {
        name: "다락석",
        emoji: "🏚️",
        promptSubject:
          "Korean cafe attic loft seating with low ceiling, floor cushions, warm string lights, intimate small space, cozy hidden retreat",
        objects: [
          { name: "방석", emoji: "🟤", position: { x: 40, y: 55 } },
          { name: "조명줄", emoji: "✨", position: { x: 55, y: 20 } },
          { name: "작은창", emoji: "🪟", position: { x: 75, y: 35 } },
        ],
      },
    ],
  },

  // 9. 게임 속 공간
  {
    id: "game",
    name: "게임 속 공간",
    emoji: "🎮",
    description: "판타지 세계를 탐험해요",
    rooms: [
      {
        name: "시작마을",
        emoji: "🏘️",
        promptSubject:
          "Fantasy RPG starting village with stone fountain, village elder's house, notice board with quests, cobblestone path, warm sunset, medieval charm",
        objects: [
          { name: "마을분수", emoji: "⛲", position: { x: 45, y: 50 } },
          { name: "의뢰게시판", emoji: "📋", position: { x: 20, y: 40 } },
          { name: "촌장의집", emoji: "🏠", position: { x: 75, y: 35 } },
        ],
      },
      {
        name: "상점",
        emoji: "🏪",
        promptSubject:
          "Fantasy RPG item shop with potions on shelves, weapons display, treasure chest, friendly shopkeeper, wooden counter, magical glow items",
        objects: [
          { name: "포션선반", emoji: "🧪", position: { x: 25, y: 45 } },
          { name: "무기진열", emoji: "⚔️", position: { x: 55, y: 40 } },
          { name: "보물상자", emoji: "📦", position: { x: 80, y: 55 } },
        ],
      },
      {
        name: "숲",
        emoji: "🌲",
        promptSubject:
          "Fantasy enchanted forest with glowing mushrooms, ancient trees, fairy lights, forest path, mysterious atmosphere, magical creatures peeking",
        objects: [
          { name: "빛나는버섯", emoji: "🍄", position: { x: 30, y: 55 } },
          { name: "고목나무", emoji: "🌳", position: { x: 55, y: 35 } },
          { name: "숲의정령", emoji: "🧚", position: { x: 80, y: 45 } },
        ],
      },
      {
        name: "동굴",
        emoji: "🕳️",
        promptSubject:
          "Fantasy crystal cave with glowing crystals, underground stream, stalactites, torch on wall, treasure pile, mysterious echo, adventurous atmosphere",
        objects: [
          { name: "수정", emoji: "💎", position: { x: 40, y: 40 } },
          { name: "횃불", emoji: "🔥", position: { x: 20, y: 50 } },
          { name: "보물더미", emoji: "💰", position: { x: 70, y: 55 } },
        ],
      },
      {
        name: "호수",
        emoji: "🌊",
        promptSubject:
          "Fantasy magical lake with glowing water, wooden dock, small boat, ancient ruins visible across, fireflies, moonlight reflecting, peaceful mysterious",
        objects: [
          { name: "나무부두", emoji: "🚣", position: { x: 35, y: 55 } },
          { name: "작은배", emoji: "⛵", position: { x: 60, y: 50 } },
          { name: "반딧불이", emoji: "✨", position: { x: 80, y: 30 } },
        ],
      },
      {
        name: "성",
        emoji: "🏰",
        promptSubject:
          "Fantasy medieval castle with drawbridge, towers, royal banners, stone walls, courtyard, knight statues, majestic impressive atmosphere",
        objects: [
          { name: "도개교", emoji: "🏰", position: { x: 45, y: 55 } },
          { name: "탑", emoji: "🗼", position: { x: 75, y: 25 } },
          { name: "기사상", emoji: "⚔️", position: { x: 20, y: 45 } },
        ],
      },
      {
        name: "왕좌의방",
        emoji: "👑",
        promptSubject:
          "Fantasy throne room with golden throne, red carpet, tapestries, chandeliers, royal guards, stained glass, grand opulent atmosphere",
        objects: [
          { name: "왕좌", emoji: "👑", position: { x: 50, y: 40 } },
          { name: "레드카펫", emoji: "🟥", position: { x: 45, y: 65 } },
          { name: "샹들리에", emoji: "✨", position: { x: 50, y: 15 } },
        ],
      },
      {
        name: "마법사의 탑",
        emoji: "🧙",
        promptSubject:
          "Fantasy wizard tower room with spell books, crystal ball, bubbling cauldron, star map on ceiling, floating candles, mystical atmosphere",
        objects: [
          { name: "수정구", emoji: "🔮", position: { x: 40, y: 45 } },
          { name: "마법책", emoji: "📖", position: { x: 65, y: 35 } },
          { name: "가마솥", emoji: "🍯", position: { x: 25, y: 55 } },
        ],
      },
      {
        name: "대장간",
        emoji: "⚒️",
        promptSubject:
          "Fantasy blacksmith forge with anvil, hammer, glowing hot metal, weapon rack, bellows, sparks flying, fire in forge, rustic hardworking atmosphere",
        objects: [
          { name: "모루", emoji: "⚒️", position: { x: 40, y: 50 } },
          { name: "용광로", emoji: "🔥", position: { x: 65, y: 40 } },
          { name: "무기거치대", emoji: "⚔️", position: { x: 20, y: 45 } },
        ],
      },
      {
        name: "보스 방",
        emoji: "🐉",
        promptSubject:
          "Fantasy final boss room with dragon skeleton, lava pools, ancient pillars, scattered treasure, epic atmosphere, dramatic lighting, climactic feeling",
        objects: [
          { name: "용뼈", emoji: "🐉", position: { x: 50, y: 35 } },
          { name: "용암웅덩이", emoji: "🌋", position: { x: 25, y: 55 } },
          { name: "전설의검", emoji: "⚔️", position: { x: 75, y: 50 } },
        ],
      },
      // Extra
      {
        name: "여관",
        emoji: "🏨",
        promptSubject:
          "Fantasy RPG inn with fireplace, wooden tables, bard playing lute, rooms upstairs, ale mugs, warm tavern atmosphere",
        objects: [
          { name: "벽난로", emoji: "🔥", position: { x: 35, y: 45 } },
          { name: "음유시인", emoji: "🎵", position: { x: 60, y: 50 } },
          { name: "맥주잔", emoji: "🍺", position: { x: 80, y: 55 } },
        ],
      },
      {
        name: "도서관",
        emoji: "📚",
        promptSubject:
          "Fantasy ancient library with towering bookshelves, floating books, magical scrolls, enchanted reading desks, mysterious dim glow",
        objects: [
          { name: "마법스크롤", emoji: "📜", position: { x: 30, y: 40 } },
          { name: "떠다니는책", emoji: "📖", position: { x: 55, y: 30 } },
          { name: "고대지도", emoji: "🗺️", position: { x: 80, y: 50 } },
        ],
      },
    ],
  },

  // 10. 나의 여정
  {
    id: "journey",
    name: "나의 여정",
    emoji: "🗺️",
    description: "인생의 여정을 따라가요",
    rooms: [
      {
        name: "첫 발걸음",
        emoji: "👣",
        promptSubject:
          "Beginning of a journey path with footprints in soft ground, sunrise on horizon, small backpack, signpost pointing forward, hopeful morning atmosphere",
        objects: [
          { name: "발자국", emoji: "👣", position: { x: 40, y: 60 } },
          { name: "배낭", emoji: "🎒", position: { x: 20, y: 50 } },
          { name: "이정표", emoji: "🪧", position: { x: 70, y: 40 } },
        ],
      },
      {
        name: "이정표",
        emoji: "🪧",
        promptSubject:
          "Crossroads with wooden signpost pointing multiple directions, wildflowers, decision-making moment, thoughtful atmosphere, gentle breeze",
        objects: [
          { name: "방향표지", emoji: "🪧", position: { x: 45, y: 40 } },
          { name: "들꽃", emoji: "🌼", position: { x: 20, y: 55 } },
          { name: "갈림길", emoji: "🔀", position: { x: 75, y: 50 } },
        ],
      },
      {
        name: "오르막길",
        emoji: "⛰️",
        promptSubject:
          "Uphill path on journey with steep trail, handrail rope, wildflowers growing from rocks, view getting wider, determined persevering atmosphere",
        objects: [
          { name: "가파른길", emoji: "⛰️", position: { x: 40, y: 50 } },
          { name: "밧줄난간", emoji: "🪢", position: { x: 20, y: 40 } },
          { name: "바위꽃", emoji: "🌺", position: { x: 70, y: 45 } },
        ],
      },
      {
        name: "쉼터",
        emoji: "🏕️",
        promptSubject:
          "Journey rest stop with small shelter, campfire, wooden bench, water jug, starlit sky, restful peaceful atmosphere, recharging moment",
        objects: [
          { name: "캠프파이어", emoji: "🔥", position: { x: 45, y: 55 } },
          { name: "쉼터지붕", emoji: "🏕️", position: { x: 30, y: 30 } },
          { name: "물통", emoji: "💧", position: { x: 70, y: 50 } },
        ],
      },
      {
        name: "다리",
        emoji: "🌉",
        promptSubject:
          "Bridge over river on journey path, wooden planks, rope handrails, rushing water below, courage-testing crossing, adventure atmosphere",
        objects: [
          { name: "나무다리", emoji: "🌉", position: { x: 45, y: 50 } },
          { name: "밧줄", emoji: "🪢", position: { x: 20, y: 35 } },
          { name: "흐르는물", emoji: "💧", position: { x: 60, y: 65 } },
        ],
      },
      {
        name: "숲속길",
        emoji: "🌲",
        promptSubject:
          "Forest path on journey with tall trees canopy, dappled sunlight, bird song, winding trail, discovering wonder, peaceful exploration atmosphere",
        objects: [
          { name: "큰나무", emoji: "🌲", position: { x: 30, y: 35 } },
          { name: "새소리", emoji: "🐦", position: { x: 60, y: 25 } },
          { name: "구불길", emoji: "🛤️", position: { x: 50, y: 60 } },
        ],
      },
      {
        name: "오아시스",
        emoji: "🏝️",
        promptSubject:
          "Oasis on journey with clear pool, palm trees, fruit trees, cool shade, refreshing water, welcome relief, hopeful joyful atmosphere",
        objects: [
          { name: "맑은연못", emoji: "💧", position: { x: 45, y: 50 } },
          { name: "야자수", emoji: "🌴", position: { x: 20, y: 35 } },
          { name: "열매나무", emoji: "🍎", position: { x: 75, y: 40 } },
        ],
      },
      {
        name: "고개",
        emoji: "🏔️",
        promptSubject:
          "Mountain pass on journey with panoramic view, prayer flags, wind blowing, achievement feeling, vast landscape below, spiritual height",
        objects: [
          { name: "기도깃발", emoji: "🏳️", position: { x: 40, y: 30 } },
          { name: "전망", emoji: "🏔️", position: { x: 65, y: 40 } },
          { name: "이정석", emoji: "🪨", position: { x: 25, y: 55 } },
        ],
      },
      {
        name: "마을",
        emoji: "🏘️",
        promptSubject:
          "Small village on journey with welcoming houses, village well, friendly atmosphere, smoke from chimneys, community gathering, warm belonging feeling",
        objects: [
          { name: "마을우물", emoji: "🪣", position: { x: 45, y: 50 } },
          { name: "따뜻한집", emoji: "🏠", position: { x: 20, y: 40 } },
          { name: "마을광장", emoji: "🏘️", position: { x: 75, y: 45 } },
        ],
      },
      {
        name: "정상",
        emoji: "🏁",
        promptSubject:
          "Summit of journey mountain with flag at top, 360 degree panoramic view, sunrise, clouds below, achievement celebration, triumphant atmosphere",
        objects: [
          { name: "정상깃발", emoji: "🚩", position: { x: 50, y: 30 } },
          { name: "파노라마뷰", emoji: "🌄", position: { x: 30, y: 45 } },
          { name: "기념석", emoji: "🪨", position: { x: 70, y: 55 } },
        ],
      },
      // Extra
      {
        name: "해변",
        emoji: "🏖️",
        promptSubject:
          "Beach on journey with gentle waves, seashells, message in bottle, footprints in sand, golden sunset, reflective peaceful atmosphere",
        objects: [
          { name: "조개껍질", emoji: "🐚", position: { x: 35, y: 55 } },
          { name: "유리병편지", emoji: "📜", position: { x: 60, y: 50 } },
          { name: "파도", emoji: "🌊", position: { x: 80, y: 40 } },
        ],
      },
      {
        name: "별빛길",
        emoji: "⭐",
        promptSubject:
          "Night path on journey with starlit sky, lantern light, glowing path stones, constellation map above, magical peaceful night atmosphere",
        objects: [
          { name: "랜턴", emoji: "🏮", position: { x: 30, y: 50 } },
          { name: "빛나는돌", emoji: "✨", position: { x: 55, y: 60 } },
          { name: "별자리", emoji: "⭐", position: { x: 50, y: 20 } },
        ],
      },
    ],
  },
];

// ── Helper Functions ──

export function getTemplateById(id: string): SpaceTemplate | undefined {
  return SPACE_TEMPLATES.find((t) => t.id === id);
}

export function getTemplateNames(): { id: string; name: string; emoji: string }[] {
  return SPACE_TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    emoji: t.emoji,
  }));
}
