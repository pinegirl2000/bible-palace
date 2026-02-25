// ============================================
// Bible Palace — Full Floor Plan View (표준 평면도)
// Dynamic apartment-style floor plan layout
// Central rooms get larger cells (거실/침실 등)
// Peripheral rooms get smaller cells (화장실/다용도실 등)
// Representative object per room shows room number
// Click another object → number transfers
// ============================================

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Room, RoomObject, VerseAssignment } from "@/data/rooms";

interface FloorPlanViewProps {
  allRooms: Room[];
  selectedRoomId: string | null;
  allAssignments: VerseAssignment[];
  onRoomSelect: (room: Room) => void;
  onObjectClickInRoom: (room: Room, object: RoomObject) => void;
}

/* ─────────────────────────────────────────────
   Layout blueprint types
   ───────────────────────────────────────────── */

interface LayoutCell {
  col: string; // CSS grid-column, e.g. "2 / 4"
  row: string; // CSS grid-row, e.g. "1 / 3"
}

interface FloorLayout {
  cols: string; // CSS grid-template-columns
  rows: string; // CSS grid-template-rows
  cells: LayoutCell[];
}

/* ─────────────────────────────────────────────
   Pre-designed floor plan grids for 3–10 rooms
   Central rooms (index 1, 4) get 2×2 large cells
   ───────────────────────────────────────────── */

const FLOOR_LAYOUTS: Record<number, FloorLayout> = {
  // ── 3 rooms ──
  //  ┌───────────────┬────────┐
  //  │  R1 (big)     │   R2   │
  //  │               ├────────┤
  //  │               │   R3   │
  //  └───────────────┴────────┘
  3: {
    cols: "2.8fr 1fr",
    rows: "1.2fr 1fr",
    cells: [
      { col: "1 / 2", row: "1 / 3" },
      { col: "2 / 3", row: "1 / 2" },
      { col: "2 / 3", row: "2 / 3" },
    ],
  },

  // ── 4 rooms ──
  //  ┌───────────────┬──────────────┐
  //  │  R1 (big)     │  R2 (wide)   │
  //  │               ├───────┬──────┤
  //  │               │  R3   │  R4  │
  //  └───────────────┴───────┴──────┘
  4: {
    cols: "2.5fr 1fr 1fr",
    rows: "1.3fr 1fr",
    cells: [
      { col: "1 / 2", row: "1 / 3" },
      { col: "2 / 4", row: "1 / 2" },
      { col: "2 / 3", row: "2 / 3" },
      { col: "3 / 4", row: "2 / 3" },
    ],
  },

  // ── 5 rooms ──
  //  ┌───────┬──────────────┬───────┐
  //  │  R1   │  R2 (big)    │  R3   │
  //  ├───────┤              ├───────┤
  //  │  R4   │              │  R5   │
  //  └───────┴──────────────┴───────┘
  5: {
    cols: "0.8fr 2.5fr 0.8fr",
    rows: "1fr 1fr",
    cells: [
      { col: "1 / 2", row: "1 / 2" },
      { col: "2 / 3", row: "1 / 3" },
      { col: "3 / 4", row: "1 / 2" },
      { col: "1 / 2", row: "2 / 3" },
      { col: "3 / 4", row: "2 / 3" },
    ],
  },

  // ── 6 rooms ──
  //  ┌───────┬──────────────┬───────┐
  //  │  R1   │  R2 (big)    │  R3   │
  //  ├───────┤              ├───────┤
  //  │  R4   │              │  R5   │
  //  ├───────┴──────────────┴───────┤
  //  │         R6 (wide)            │
  //  └──────────────────────────────┘
  6: {
    cols: "0.8fr 2fr 0.8fr",
    rows: "1fr 1.4fr 0.6fr",
    cells: [
      { col: "1 / 2", row: "1 / 2" },
      { col: "2 / 3", row: "1 / 3" },
      { col: "3 / 4", row: "1 / 2" },
      { col: "1 / 2", row: "2 / 3" },
      { col: "3 / 4", row: "2 / 3" },
      { col: "1 / 4", row: "3 / 4" },
    ],
  },

  // ── 7 rooms ──
  //  ┌───────┬──────────────────┬───────┐
  //  │  R1   │                  │  R3   │
  //  ├───────┤  R2 (2×2 large)  ├───────┤
  //  │  R4   │                  │  R5   │
  //  ├───────┴────────┬─────────┴───────┤
  //  │  R6 (wide)     │  R7 (wide)      │
  //  └────────────────┴─────────────────┘
  7: {
    cols: "0.7fr 1.5fr 1.5fr 0.7fr",
    rows: "1fr 1.3fr 0.7fr",
    cells: [
      { col: "1 / 2", row: "1 / 2" },
      { col: "2 / 4", row: "1 / 3" },
      { col: "4 / 5", row: "1 / 2" },
      { col: "1 / 2", row: "2 / 3" },
      { col: "4 / 5", row: "2 / 3" },
      { col: "1 / 3", row: "3 / 4" },
      { col: "3 / 5", row: "3 / 4" },
    ],
  },

  // ── 8 rooms ──
  //  ┌───────┬──────────────────┬───────┐
  //  │  R1   │                  │  R3   │
  //  ├───────┤  R2 (2×2 large)  ├───────┤
  //  │  R4   │                  │  R5   │
  //  ├───────┼──────────────────┼───────┤
  //  │  R6   │   R7 (wide)      │  R8   │
  //  └───────┴──────────────────┴───────┘
  8: {
    cols: "0.7fr 1.5fr 1.5fr 0.7fr",
    rows: "0.8fr 1.5fr 0.7fr",
    cells: [
      { col: "1 / 2", row: "1 / 2" },
      { col: "2 / 4", row: "1 / 3" },
      { col: "4 / 5", row: "1 / 2" },
      { col: "1 / 2", row: "2 / 3" },
      { col: "4 / 5", row: "2 / 3" },
      { col: "1 / 2", row: "3 / 4" },
      { col: "2 / 4", row: "3 / 4" },
      { col: "4 / 5", row: "3 / 4" },
    ],
  },

  // ── 9 rooms ──
  //  ┌───────┬──────────────────┬───────┐
  //  │  R1   │                  │  R3   │
  //  ├───────┤  R2 (2×2 large)  ├───────┤
  //  │  R4   │                  │  R5   │
  //  ├───────┼────────┬─────────┼───────┤
  //  │  R6   │  R7    │  R8     │  R9   │
  //  └───────┴────────┴─────────┴───────┘
  9: {
    cols: "0.7fr 1.5fr 1.5fr 0.7fr",
    rows: "0.8fr 1.5fr 0.7fr",
    cells: [
      { col: "1 / 2", row: "1 / 2" },
      { col: "2 / 4", row: "1 / 3" },
      { col: "4 / 5", row: "1 / 2" },
      { col: "1 / 2", row: "2 / 3" },
      { col: "4 / 5", row: "2 / 3" },
      { col: "1 / 2", row: "3 / 4" },
      { col: "2 / 3", row: "3 / 4" },
      { col: "3 / 4", row: "3 / 4" },
      { col: "4 / 5", row: "3 / 4" },
    ],
  },

  // ── 10 rooms — 5-column realistic apartment ──
  //  ┌────────┬──────────────────────────┬──────┐
  //  │  R1    │                          │  R3  │
  //  │        │   R2 거실/마당 (3×2)      │      │
  //  ├────────┤                          ├──────┤
  //  │  R8    │                          │  R4  │
  //  │        │                          │      │
  //  ├────────┼───────────────┬──────────┼──────┤
  //  │        │               │          │      │
  //  │  R7    │  R5 침실 (2×2)│   R6     │ R10  │
  //  │ (tall) │               │          │      │
  //  ├────────┤               ├──────────┴──────┤
  //  │        │               │                 │
  //  │  R8→화 │               │  R9 (wide)      │
  //  └────────┴───────────────┴─────────────────┘
  10: {
    cols: "0.8fr 1fr 1.5fr 1fr 0.8fr",
    rows: "0.7fr 1.3fr 1.3fr 0.7fr",
    cells: [
      { col: "1 / 2", row: "1 / 2" },   // R1  (현관)        — small top-left
      { col: "2 / 5", row: "1 / 3" },   // R2  (거실)        — HUGE 3col×2row
      { col: "5 / 6", row: "1 / 2" },   // R3  (주방)        — small top-right
      { col: "5 / 6", row: "2 / 3" },   // R4  (식당)        — small right
      { col: "2 / 4", row: "3 / 5" },   // R5  (침실)        — LARGE 2col×2row
      { col: "4 / 5", row: "3 / 4" },   // R6  (드레스룸)     — medium
      { col: "1 / 2", row: "2 / 4" },   // R7  (서재)        — tall 1×2
      { col: "1 / 2", row: "4 / 5" },   // R8  (화장실)       — small bottom-left
      { col: "4 / 6", row: "4 / 5" },   // R9  (다용도실)     — wide 2×1
      { col: "5 / 6", row: "3 / 4" },   // R10 (베란다)       — small right
    ],
  },
};

/** Get floor layout for given room count (falls back to regular grid) */
function getFloorLayout(count: number): FloorLayout {
  if (FLOOR_LAYOUTS[count]) return FLOOR_LAYOUTS[count];
  // Fallback: generate a regular grid
  const c = Math.min(4, Math.ceil(Math.sqrt(count)));
  const r = Math.ceil(count / c);
  return {
    cols: `repeat(${c}, 1fr)`,
    rows: `repeat(${r}, 1fr)`,
    cells: Array.from({ length: count }, (_, i) => ({
      col: `${(i % c) + 1} / ${(i % c) + 2}`,
      row: `${Math.floor(i / c) + 1} / ${Math.floor(i / c) + 2}`,
    })),
  };
}

/** Parse fr values from grid-template string */
function parseFrValues(template: string): number[] {
  // Handle repeat() syntax: "repeat(4, 1fr)" → [1, 1, 1, 1]
  const repeatMatch = template.match(/repeat\((\d+),\s*([\d.]+)fr\)/);
  if (repeatMatch) {
    const count = parseInt(repeatMatch[1]);
    const value = parseFloat(repeatMatch[2]);
    return Array(count).fill(value);
  }
  return template.split(/\s+/).map((v) => parseFloat(v));
}

/** Calculate center position of each cell as percentage (0–100) */
function getCellCenters(
  layout: FloorLayout,
  count: number
): { x: number; y: number }[] {
  const colFrs = parseFrValues(layout.cols);
  const rowFrs = parseFrValues(layout.rows);
  const totalC = colFrs.reduce((a, b) => a + b, 0);
  const totalR = rowFrs.reduce((a, b) => a + b, 0);

  return layout.cells.slice(0, count).map((cell) => {
    const [cs, ce] = cell.col.split("/").map((s) => parseInt(s.trim()));
    const [rs, re] = cell.row.split("/").map((s) => parseInt(s.trim()));

    const xStart =
      (colFrs.slice(0, cs - 1).reduce((a, b) => a + b, 0) / totalC) * 100;
    const xEnd =
      (colFrs.slice(0, ce - 1).reduce((a, b) => a + b, 0) / totalC) * 100;
    const yStart =
      (rowFrs.slice(0, rs - 1).reduce((a, b) => a + b, 0) / totalR) * 100;
    const yEnd =
      (rowFrs.slice(0, re - 1).reduce((a, b) => a + b, 0) / totalR) * 100;

    return { x: (xStart + xEnd) / 2, y: (yStart + yEnd) / 2 };
  });
}

/* ─────────────────────────────────────────────
   Floor colors — warm beige palette
   ───────────────────────────────────────────── */

const FLOOR_COLORS = [
  "#f5ecd7", // warm beige
  "#f0e6ce", // light tan
  "#ede0c8", // cream
  "#f3e8d0", // soft wheat
  "#f7f0de", // light cream
  "#f1e5cb", // warm sand
  "#f4ebd5", // pale amber
  "#efe3cc", // soft beige
  "#f6eed8", // ivory
  "#f2e7cf", // warm cream
];

/* ─────────────────────────────────────────────
   FloorObject — positioned furniture item
   ───────────────────────────────────────────── */

/** Furniture size by type — % of room cell (top-down proportional) */
function getFurnitureSize(name: string): {
  w: string;
  h: string;
  r: string;
  emojiScale: number; // fraction of container height for emoji font-size
} {
  // ── Extra-large — beds (dominant in bedroom, max ~50%) ──
  if (/침대|이층침대|킹/.test(name))
    return { w: "46%", h: "36%", r: "5px", emojiScale: 0.65 };
  // ── Large — sofas, bathtubs, dining tables ──
  if (/소파|욕조|식탁|아일랜드/.test(name))
    return { w: "34%", h: "26%", r: "5px", emojiScale: 0.6 };
  // ── Medium-tall — fridges, wardrobes, bookshelves ──
  if (/냉장고|옷장|책장|서랍|식기장|옷걸이|수납|진열/.test(name))
    return { w: "20%", h: "28%", r: "4px", emojiScale: 0.55 };
  // ── Medium — desks, appliances, mirrors, TV ──
  if (/책상|세탁기|싱크대|세면대|전신|거울|다리미|TV|전자레인지|노트북|오븐|모니터|피아노|드럼|강대/.test(name))
    return { w: "24%", h: "20%", r: "4px", emojiScale: 0.55 };
  // ── Small-medium — chairs, shelves, stands, plants ──
  if (/의자|선반|협탁|스탠드|화분|빨래|수건|접이식|벤치|테이블|카운터|배식|계단|사물함/.test(name))
    return { w: "18%", h: "17%", r: "3px", emojiScale: 0.5 };
  // ── Small — keys, clocks, vases, hooks, decorations ──
  return { w: "14%", h: "14%", r: "50%", emojiScale: 0.5 };
}

function FloorObject({
  object,
  isRepresentative,
  roomNumber,
  isAssigned,
  assignment,
  onClick,
}: {
  object: RoomObject;
  isRepresentative: boolean;
  roomNumber: number;
  isAssigned: boolean;
  assignment?: VerseAssignment;
  onClick: () => void;
}) {
  const sz = getFurnitureSize(object.name);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [emojiPx, setEmojiPx] = useState(16);

  // Measure container and compute emoji font-size
  useEffect(() => {
    if (!btnRef.current) return;
    const el = btnRef.current;
    const update = () => {
      const h = el.clientHeight;
      setEmojiPx(Math.max(12, Math.round(h * sz.emojiScale)));
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, [sz.emojiScale]);

  return (
    <button
      ref={btnRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute group z-10 focus:outline-none"
      style={{
        left: `${object.position.x}%`,
        top: `${object.position.y}%`,
        width: sz.w,
        height: sz.h,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Furniture body — emoji fills the shape */}
      <div
        className={`w-full h-full relative flex items-center justify-center overflow-hidden transition-all duration-150 ${
          isAssigned
            ? "bg-indigo-50/70 ring-[1.5px] ring-indigo-300/70"
            : "bg-white/40 ring-1 ring-stone-300/40 group-hover:bg-white/60 group-hover:ring-indigo-300"
        }`}
        style={{
          borderRadius: sz.r,
          boxShadow: isAssigned
            ? "inset 0 0 6px rgba(99,102,241,0.12), 0 1px 3px rgba(0,0,0,0.08)"
            : "inset 0 0 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        {/* Emoji — dynamically scaled to fill container */}
        <span
          className="leading-none select-none"
          style={{ fontSize: `${emojiPx}px` }}
        >
          {object.emoji}
        </span>

        {/* Name label — pinned at bottom */}
        <span
          className={`absolute bottom-0 left-0 right-0 text-center text-[4px] sm:text-[5px] font-bold leading-none truncate px-0.5 pb-px ${
            isRepresentative
              ? "text-indigo-700"
              : isAssigned
              ? "text-indigo-600"
              : "text-stone-500"
          }`}
        >
          {object.name}
        </span>

        {/* Verse ref — above name */}
        {isAssigned && assignment && (
          <span className="absolute bottom-[7px] left-0 right-0 text-center text-[3px] sm:text-[4px] text-indigo-400 font-medium leading-none truncate">
            {assignment.verseRef}
          </span>
        )}
      </div>

      {/* Room NUMBER badge */}
      {isRepresentative && (
        <motion.span
          className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-600 text-white rounded-full text-[7px] sm:text-[8px] font-bold flex items-center justify-center shadow-md z-20 ring-[1.5px] ring-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 400 }}
          key={`rep-${object.id}`}
        >
          {roomNumber}
        </motion.span>
      )}

      {/* ✓ badge */}
      {isAssigned && !isRepresentative && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 text-white rounded-full text-[5px] flex items-center justify-center font-bold shadow-sm ring-1 ring-white">
          ✓
        </span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   RoomCell — single room in the floor plan
   ───────────────────────────────────────────── */

function RoomCell({
  room,
  index,
  isSelected,
  floorColor,
  representativeId,
  assignmentMap,
  onSelect,
  onObjectClick,
}: {
  room: Room;
  index: number;
  isSelected: boolean;
  floorColor: string;
  representativeId: string;
  assignmentMap: Record<string, VerseAssignment>;
  onSelect: () => void;
  onObjectClick: (object: RoomObject) => void;
}) {
  const assignedCount = Object.keys(assignmentMap).length;
  const totalObjects = room.objects.length;

  return (
    <motion.div
      onClick={onSelect}
      className={`relative w-full h-full cursor-pointer overflow-hidden transition-all duration-200 ${
        isSelected
          ? "ring-[3px] ring-inset ring-indigo-500 z-10"
          : "hover:brightness-[0.97]"
      }`}
      style={{ backgroundColor: floorColor }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      {/* Wood grain texture + inner shadow for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            ${index % 2 === 0 ? "90deg" : "0deg"},
            transparent,
            transparent 18px,
            rgba(139,90,43,0.05) 18px,
            rgba(139,90,43,0.05) 19px
          )`,
          boxShadow: "inset 0 0 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(139,90,43,0.08)",
        }}
      />

      {/* Room name label (top-left) */}
      <div
        className={`absolute top-1 left-1 z-20 flex items-center gap-0.5 px-1 py-0.5 rounded-sm backdrop-blur-sm ${
          isSelected ? "bg-indigo-600/90" : "bg-stone-700/70"
        }`}
      >
        <span className="text-[9px] leading-none">{room.emoji}</span>
        <span className="text-[7px] sm:text-[8px] font-bold text-white leading-none">
          {room.name}
        </span>
      </div>

      {/* Assignment counter (top-right) */}
      {assignedCount > 0 && (
        <div className="absolute top-1 right-1 z-20">
          <span
            className={`text-[6px] font-bold px-1 py-0.5 rounded-sm ${
              assignedCount >= totalObjects
                ? "bg-emerald-500/90 text-white"
                : "bg-indigo-500/80 text-white"
            }`}
          >
            {assignedCount}/{totalObjects}
          </span>
        </div>
      )}

      {/* ── Furniture — absolutely positioned proportional items ── */}
      {room.objects.map((obj) => (
        <FloorObject
          key={obj.id}
          object={obj}
          isRepresentative={representativeId === obj.id}
          roomNumber={index + 1}
          isAssigned={!!assignmentMap[obj.id]}
          assignment={assignmentMap[obj.id]}
          onClick={() => onObjectClick(obj)}
        />
      ))}

      {/* Selected room glow */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none bg-indigo-400/5" />
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */

export default function FloorPlanView({
  allRooms,
  selectedRoomId,
  allAssignments,
  onRoomSelect,
  onObjectClickInRoom,
}: FloorPlanViewProps) {
  // ── Representative objects (which object shows the room number) ──
  const [representatives, setRepresentatives] = useState<
    Record<string, string>
  >({});

  // ── Inline prompt for unassigned objects ──
  const [promptTarget, setPromptTarget] = useState<{
    room: Room;
    object: RoomObject;
  } | null>(null);

  // Initialize representatives with first object of each room
  useEffect(() => {
    const defaults: Record<string, string> = {};
    allRooms.forEach((room) => {
      if (room.objects.length > 0 && !defaults[room.id]) {
        defaults[room.id] = room.objects[0].id;
      }
    });
    setRepresentatives((prev) => ({ ...defaults, ...prev }));
  }, [allRooms]);

  // ── Layout ──
  const layout = useMemo(
    () => getFloorLayout(allRooms.length),
    [allRooms.length]
  );

  // ── Room centers for connection lines ──
  const roomCenters = useMemo(
    () => getCellCenters(layout, allRooms.length),
    [layout, allRooms.length]
  );

  // ── Grid ref for SVG sizing ──
  const gridRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!gridRef.current) return;
    const el = gridRef.current;
    const update = () => {
      setSvgSize({ w: el.clientWidth, h: el.clientHeight });
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Assignment data ──
  const roomAssignmentMaps = useMemo(() => {
    const maps: Record<string, Record<string, VerseAssignment>> = {};
    allAssignments.forEach((a) => {
      if (!maps[a.roomId]) maps[a.roomId] = {};
      maps[a.roomId][a.objectId] = a;
    });
    return maps;
  }, [allAssignments]);

  // ── Stats ──
  const totalAssigned = allAssignments.length;
  const totalObjects = allRooms.reduce((sum, r) => sum + r.objects.length, 0);

  // ── Handle object click → transfer number + show prompt or zoom ──
  const handleObjectClick = (room: Room, object: RoomObject) => {
    // Always transfer the number badge
    setRepresentatives((prev) => ({
      ...prev,
      [room.id]: object.id,
    }));

    // Check if this object already has a verse assigned
    const roomMap = roomAssignmentMaps[room.id] || {};
    if (roomMap[object.id]) {
      // Assigned → show zoom overlay (via parent)
      setPromptTarget(null);
      onObjectClickInRoom(room, object);
    } else {
      // Not assigned → show inline prompt card (let user see the number transfer first)
      setPromptTarget({ room, object });
    }
  };

  // ── Handle prompt → open verse selector ──
  const handlePromptAssign = () => {
    if (!promptTarget) return;
    onObjectClickInRoom(promptTarget.room, promptTarget.object);
    setPromptTarget(null);
  };

  // ── Handle room background click → dismiss prompt ──
  const handleRoomClick = (room: Room) => {
    setPromptTarget(null);
    onRoomSelect(room);
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-stone-200">
      {/* ── Header bar ── */}
      <div className="relative flex items-center justify-between px-3 py-1.5 bg-stone-100/95 backdrop-blur-sm border-b border-stone-300 z-20">
        <div className="flex items-center gap-2">
          <span className="text-sm">🏠</span>
          <span className="text-xs sm:text-sm font-bold text-stone-700">
            평면도
          </span>
          <span className="text-[10px] text-stone-400 hidden sm:inline">
            {allRooms.length}개 공간 · 아이템을 클릭하면 번호가 이동합니다
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 sm:w-24 h-1.5 bg-stone-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{
                width:
                  totalObjects > 0
                    ? `${(totalAssigned / totalObjects) * 100}%`
                    : "0%",
              }}
            />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-indigo-600">
            {totalAssigned}
            <span className="text-stone-400 font-normal">/{totalObjects}</span>
          </span>
        </div>
      </div>

      {/* ── Floor plan container ── */}
      <div className="overflow-auto h-[calc(100%-32px)] flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* FLOOR PLAN title label */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-stone-700 text-white text-[9px] font-bold rounded-b-sm z-30 shadow-md">
            FLOOR PLAN
          </div>

          {/* Grid wrapper + sequential connection lines */}
          <div
            ref={gridRef}
            className="relative rounded-sm overflow-hidden shadow-2xl"
            style={{
              width: "min(100%, 880px)",
              height: "min(100%, 580px)",
              border: "3px solid #44403c",
            }}
          >
            {/* SVG — thick gray dashed path connecting rooms 1→2→…→N */}
            {svgSize.w > 0 && (
              <svg
                className="absolute inset-0 z-20 pointer-events-none"
                viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
                fill="none"
              >
                <defs>
                  <marker
                    id="room-arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path
                      d="M 0 0.5 L 9 5 L 0 9.5 z"
                      fill="#78716c"
                      opacity="0.6"
                    />
                  </marker>
                </defs>
                {roomCenters.map((c, i) => {
                  const x = (c.x / 100) * svgSize.w;
                  const y = (c.y / 100) * svgSize.h;

                  if (i === 0) {
                    return (
                      <circle
                        key="dot-0"
                        cx={x}
                        cy={y}
                        r={5}
                        fill="#78716c"
                        opacity={0.5}
                      />
                    );
                  }

                  const prev = roomCenters[i - 1];
                  const px = (prev.x / 100) * svgSize.w;
                  const py = (prev.y / 100) * svgSize.h;

                  return (
                    <g key={`conn-${i}`}>
                      <line
                        x1={px}
                        y1={py}
                        x2={x}
                        y2={y}
                        stroke="#78716c"
                        strokeOpacity={0.45}
                        strokeWidth={3}
                        strokeDasharray="8 5"
                        strokeLinecap="round"
                        markerEnd="url(#room-arrow)"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={5}
                        fill="#78716c"
                        opacity={0.5}
                      />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Grid floor plan — thin line walls */}
            <div
              className="grid w-full h-full"
              style={{
                gridTemplateColumns: layout.cols,
                gridTemplateRows: layout.rows,
                gap: "1px",
                backgroundColor: "#44403c", // stone-700 black wall lines
              }}
            >
              {allRooms.map((room, idx) => {
                const cell = layout.cells[idx];
                if (!cell) return null;
                return (
                  <div
                    key={room.id}
                    className="relative overflow-hidden min-h-0 min-w-0"
                    style={{
                      gridColumn: cell.col,
                      gridRow: cell.row,
                    }}
                  >
                    <RoomCell
                      room={room}
                      index={idx}
                      isSelected={selectedRoomId === room.id}
                      floorColor={FLOOR_COLORS[idx % FLOOR_COLORS.length]}
                      representativeId={
                        representatives[room.id] || room.objects[0]?.id || ""
                      }
                      assignmentMap={roomAssignmentMaps[room.id] || {}}
                      onSelect={() => handleRoomClick(room)}
                      onObjectClick={(obj) => handleObjectClick(room, obj)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Inline prompt card for unassigned objects ── */}
          <AnimatePresence>
            {promptTarget && (
              <motion.div
                key={promptTarget.object.id}
                className="absolute bottom-3 left-1/2 z-40"
                style={{ transform: "translateX(-50%)" }}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", damping: 22, stiffness: 350 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 px-4 py-3 flex items-center gap-3 sm:gap-4">
                  {/* Object info */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl sm:text-2xl shrink-0">
                      {promptTarget.object.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">
                        {promptTarget.object.name}
                      </p>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        구절이 배치되지 않았습니다
                      </p>
                    </div>
                  </div>

                  {/* Assign verse button */}
                  <button
                    onClick={handlePromptAssign}
                    className="shrink-0 px-3 py-2 sm:px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>📖</span>
                    <span>구절 배치하기</span>
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => setPromptTarget(null)}
                    className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
