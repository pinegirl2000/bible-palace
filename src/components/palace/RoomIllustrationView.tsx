// ============================================
// Bible Palace — Room Illustration View
// HTML/CSS based interactive room view
// Background: Pollinations pastel illustration
// Objects: positioned cards with emoji + text
// ============================================

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Room, RoomObject, VerseAssignment } from "@/data/rooms";
import { getPastelRoomImageUrl } from "@/data/pastel-prompts";

interface RoomIllustrationViewProps {
  room: Room;
  assignments: VerseAssignment[];
  onObjectClick: (object: RoomObject) => void;
}

// ── Object Spot Component ──

function ObjectSpotCard({
  object,
  isAssigned,
  assignment,
  onClick,
  index,
}: {
  object: RoomObject;
  isAssigned: boolean;
  assignment?: VerseAssignment;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="absolute group"
      style={{
        left: `${object.position.x}%`,
        top: `${object.position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.08 + 0.3,
        type: "spring",
        damping: 20,
        stiffness: 300,
      }}
      whileHover={{ scale: 1.12, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl backdrop-blur-sm transition-all duration-200 border ${
          isAssigned
            ? "bg-indigo-600/90 border-indigo-400 shadow-lg shadow-indigo-300/30"
            : "bg-white/85 border-white/60 shadow-md hover:bg-white/95 hover:shadow-lg hover:border-indigo-200"
        }`}
      >
        {/* Pulse ring for unassigned */}
        {!isAssigned && (
          <span className="absolute -inset-1 rounded-xl border-2 border-indigo-300/40 animate-pulse" />
        )}

        {/* Emoji */}
        <span className="text-xl leading-none">{object.emoji}</span>

        {/* Name */}
        <span
          className={`text-[10px] font-semibold leading-tight whitespace-nowrap ${
            isAssigned ? "text-white" : "text-slate-700"
          }`}
        >
          {object.name}
        </span>

        {/* Verse badge for assigned */}
        {isAssigned && assignment && (
          <span className="text-[8px] text-indigo-100 font-medium leading-none truncate max-w-[70px]">
            {assignment.verseRef}
          </span>
        )}

        {/* Plus icon for unassigned on hover */}
        {!isAssigned && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            +
          </span>
        )}

        {/* Check for assigned */}
        {isAssigned && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
            ✓
          </span>
        )}
      </div>
    </motion.button>
  );
}

// ── Main Component ──

export default function RoomIllustrationView({
  room,
  assignments,
  onObjectClick,
}: RoomIllustrationViewProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageUrl = useMemo(
    () => getPastelRoomImageUrl(room.id, room.pastelPromptEn),
    [room.id, room.pastelPromptEn]
  );

  // Assignment lookup
  const assignmentMap = useMemo(() => {
    const map: Record<string, VerseAssignment> = {};
    assignments.forEach((a) => {
      map[a.objectId] = a;
    });
    return map;
  }, [assignments]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Background illustration */}
      <div className="absolute inset-0">
        {!imgError && (
          <img
            src={imageUrl}
            alt={`${room.name} 일러스트`}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}

        {/* Fallback gradient bg when image fails */}
        {imgError && (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 flex items-center justify-center">
            <span className="text-8xl opacity-20">{room.emoji}</span>
          </div>
        )}

        {/* Loading shimmer */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-3xl animate-pulse">
                {room.emoji}
              </div>
              <span className="text-sm text-slate-400 animate-pulse bg-white/60 px-3 py-1 rounded-full">
                {room.name} 일러스트 로딩 중...
              </span>
            </div>
          </div>
        )}

        {/* Light overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40" />
      </div>

      {/* Object spots */}
      <AnimatePresence>
        {room.objects.map((obj, idx) => (
          <ObjectSpotCard
            key={obj.id}
            object={obj}
            isAssigned={!!assignmentMap[obj.id]}
            assignment={assignmentMap[obj.id]}
            onClick={() => onObjectClick(obj)}
            index={idx}
          />
        ))}
      </AnimatePresence>

      {/* Room info bar (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 pointer-events-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-lg">
              {room.emoji}
            </span>
            <div>
              <span className="font-semibold text-sm block leading-tight drop-shadow-sm">
                {room.name}
              </span>
              <span className="text-white/70 text-[10px] drop-shadow-sm">
                {room.description}
              </span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
            <span className="text-white text-xs font-bold">
              {assignments.length}
              <span className="text-white/60 font-normal">/{room.objects.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Object legend sidebar (right side) */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 max-h-[calc(100%-80px)] overflow-y-auto">
        {room.objects.map((obj, idx) => {
          const isAssigned = !!assignmentMap[obj.id];
          return (
            <motion.button
              key={obj.id}
              onClick={() => onObjectClick(obj)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-left transition-all ${
                isAssigned
                  ? "bg-indigo-600/80 backdrop-blur-sm"
                  : "bg-white/70 backdrop-blur-sm hover:bg-white/90"
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 + 0.5 }}
              whileHover={{ scale: 1.05, x: -2 }}
            >
              <span className="text-xs">{obj.emoji}</span>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  isAssigned ? "text-white" : "text-slate-600"
                }`}
              >
                {obj.name}
              </span>
              {isAssigned && (
                <span className="text-[8px] text-emerald-300 ml-0.5">✓</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
