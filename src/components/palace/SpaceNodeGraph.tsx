// ============================================
// Bible Palace — Connected Node Graph (Top Section)
// Drag-and-drop reorderable linear node graph
// Framer Motion Reorder API
// Scroll arrows for 10+ nodes
// ============================================

"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Reorder, motion } from "framer-motion";
import { Room, VerseAssignment } from "@/data/rooms";

const VISIBLE_COUNT = 10; // Show up to 10 nodes at once

interface SpaceNodeGraphProps {
  rooms: Room[];
  selectedRoomId: string | null;
  assignments: VerseAssignment[];
  onRoomSelect: (room: Room) => void;
  onReorder: (newOrder: Room[]) => void;
}

// ── Single Node Item ──

function NodeItem({
  room,
  orderNum,
  isSelected,
  isFirst,
  isLast,
  count,
  isComplete,
  hasAssignments,
  lineActive,
  onSelect,
}: {
  room: Room;
  orderNum: number;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  count: number;
  isComplete: boolean;
  hasAssignments: boolean;
  lineActive: boolean;
  onSelect: () => void;
}) {
  return (
    <Reorder.Item
      value={room}
      className="flex items-center shrink-0 select-none"
      style={{ touchAction: "pan-y" }}
      whileDrag={{
        scale: 1.12,
        zIndex: 50,
        boxShadow: "0 8px 24px rgba(79,70,229,0.2)",
        borderRadius: "16px",
        background: "rgba(238,242,255,0.9)",
      }}
    >
      <div className="flex items-center">
        {/* Left connector (not for the first node) */}
        {!isFirst && (
          <div
            className={`h-[1.5px] w-3 sm:w-4 shrink-0 transition-colors duration-300 ${
              lineActive ? "bg-indigo-300" : "bg-slate-200"
            }`}
          />
        )}

        {/* Node button */}
        <motion.button
          onClick={onSelect}
          className="relative flex flex-col items-center gap-0.5 px-1"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
        >
          {/* Order number */}
          <span
            className={`text-[10px] font-bold leading-none mb-0.5 ${
              isSelected
                ? "text-indigo-500"
                : hasAssignments
                ? "text-slate-500"
                : "text-slate-300"
            }`}
          >
            {orderNum}
          </span>

          <div className="relative">
            {/* Selection glow */}
            {isSelected && (
              <motion.div
                className="absolute -inset-1 rounded-full border-2 border-indigo-400"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(79,70,229,0.3)",
                    "0 0 0 5px rgba(79,70,229,0)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

            {/* Circle */}
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all duration-200 border-2 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-200"
                  : isComplete
                  ? "border-emerald-400 bg-emerald-50"
                  : hasAssignments
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {room.emoji}
            </div>

            {/* Assignment count badge */}
            {count > 0 && (
              <div
                className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                  isComplete ? "bg-emerald-500" : "bg-indigo-500"
                }`}
              >
                {count}
              </div>
            )}
          </div>

          {/* Name */}
          <span
            className={`text-[10px] sm:text-xs font-medium leading-tight text-center whitespace-nowrap ${
              isSelected
                ? "text-indigo-600 font-semibold"
                : hasAssignments
                ? "text-slate-700"
                : "text-slate-400"
            }`}
          >
            {room.name}
          </span>
        </motion.button>

        {/* Right connector (not for the last node) */}
        {!isLast && (
          <div
            className={`h-[1.5px] w-3 sm:w-4 shrink-0 transition-colors duration-300 ${
              lineActive ? "bg-indigo-300" : "bg-slate-200"
            }`}
          />
        )}
      </div>
    </Reorder.Item>
  );
}

// ── Scroll Arrow Button ──

function ScrollArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
        disabled
          ? "bg-slate-50 text-slate-200 cursor-default"
          : "bg-indigo-50 hover:bg-indigo-100 text-indigo-500 shadow-sm"
      }`}
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.9 }}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {direction === "left" ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        )}
      </svg>
    </motion.button>
  );
}

// ── Main Component ──

export default function SpaceNodeGraph({
  rooms,
  selectedRoomId,
  assignments,
  onRoomSelect,
  onReorder,
}: SpaceNodeGraphProps) {
  const needsScroll = rooms.length > VISIBLE_COUNT;
  const [scrollOffset, setScrollOffset] = useState(0);
  const maxOffset = Math.max(0, rooms.length - VISIBLE_COUNT);

  // Count assignments per room
  const assignmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    assignments.forEach((a) => {
      counts[a.roomId] = (counts[a.roomId] || 0) + 1;
    });
    return counts;
  }, [assignments]);

  // Auto-scroll to selected node
  useEffect(() => {
    if (!needsScroll || !selectedRoomId) return;
    const idx = rooms.findIndex((r) => r.id === selectedRoomId);
    if (idx < 0) return;

    if (idx < scrollOffset) {
      setScrollOffset(idx);
    } else if (idx >= scrollOffset + VISIBLE_COUNT) {
      setScrollOffset(Math.min(idx - VISIBLE_COUNT + 1, maxOffset));
    }
  }, [selectedRoomId, needsScroll, rooms, scrollOffset, maxOffset]);

  const handleScrollLeft = useCallback(() => {
    setScrollOffset((prev) => Math.max(0, prev - 1));
  }, []);

  const handleScrollRight = useCallback(() => {
    setScrollOffset((prev) => Math.min(maxOffset, prev + 1));
  }, [maxOffset]);

  // Visible rooms for scrollable mode
  const visibleRooms = needsScroll
    ? rooms.slice(scrollOffset, scrollOffset + VISIBLE_COUNT)
    : rooms;

  // For scrollable mode, we need to handle reorder within visible range
  const handleReorder = useCallback(
    (newVisible: Room[]) => {
      if (!needsScroll) {
        onReorder(newVisible);
        return;
      }
      // Replace the visible portion in the full array
      const newRooms = [...rooms];
      for (let i = 0; i < newVisible.length; i++) {
        newRooms[scrollOffset + i] = newVisible[i];
      }
      onReorder(newRooms);
    },
    [rooms, scrollOffset, needsScroll, onReorder]
  );

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden px-1">
      {/* Left scroll arrow */}
      {needsScroll && (
        <ScrollArrow
          direction="left"
          onClick={handleScrollLeft}
          disabled={scrollOffset === 0}
        />
      )}

      {/* Scroll position indicator */}
      {needsScroll && (
        <div className="shrink-0 flex flex-col items-center mx-1">
          <span className="text-[9px] text-slate-300 font-medium">
            {scrollOffset + 1}-{Math.min(scrollOffset + VISIBLE_COUNT, rooms.length)}
          </span>
          <span className="text-[8px] text-slate-200">
            / {rooms.length}
          </span>
        </div>
      )}

      <Reorder.Group
        axis="x"
        values={visibleRooms}
        onReorder={handleReorder}
        className="flex items-center justify-center w-full"
        as="div"
      >
        {visibleRooms.map((room, visIdx) => {
          // The actual index in the full rooms array
          const globalIdx = needsScroll ? scrollOffset + visIdx : visIdx;
          const count = assignmentCounts[room.id] || 0;
          const nextRoom = visibleRooms[visIdx + 1];
          const nextCount = nextRoom ? (assignmentCounts[nextRoom.id] || 0) : 0;

          return (
            <NodeItem
              key={room.id}
              room={room}
              orderNum={globalIdx + 1}
              isSelected={selectedRoomId === room.id}
              isFirst={visIdx === 0}
              isLast={visIdx === visibleRooms.length - 1}
              count={count}
              isComplete={count >= room.objects.length}
              hasAssignments={count > 0}
              lineActive={count > 0 && nextCount > 0}
              onSelect={() => onRoomSelect(room)}
            />
          );
        })}
      </Reorder.Group>

      {/* Right scroll position indicator */}
      {needsScroll && (
        <div className="shrink-0 flex flex-col items-center mx-1">
          <span className="text-[9px] text-slate-300 font-medium invisible">
            placeholder
          </span>
        </div>
      )}

      {/* Right scroll arrow */}
      {needsScroll && (
        <ScrollArrow
          direction="right"
          onClick={handleScrollRight}
          disabled={scrollOffset >= maxOffset}
        />
      )}
    </div>
  );
}
