// ============================================
// Bible Palace — Room Interior View
// 방 내부 전체화면 + 물건 핫스팟
// ============================================

"use client";

import { useState, useEffect } from "react";
import { Room, RoomObject, VerseAssignment } from "@/data/rooms";
import ObjectSpot from "./ObjectSpot";

interface RoomInteriorProps {
  room: Room;
  assignments: VerseAssignment[];
  onObjectClick: (object: RoomObject) => void;
  onBack: () => void;
}

export default function RoomInterior({
  room,
  assignments,
  onObjectClick,
  onBack,
}: RoomInteriorProps) {
  const [bgLoaded, setBgLoaded] = useState(false);

  // Pollinations.ai background image URL
  const bgImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    room.imagePromptEn
  )}?width=1280&height=720&model=flux&nologo=true&seed=42`;

  // Preload the background image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setBgLoaded(true);
    img.onerror = () => setBgLoaded(true); // show anyway on error
    img.src = bgImageUrl;
  }, [bgImageUrl]);

  // Find assignment for a given object
  function getAssignment(obj: RoomObject): VerseAssignment | undefined {
    return assignments.find(
      (a) => a.roomId === room.id && a.objectId === obj.id
    );
  }

  const assignedCount = room.objects.filter((obj) =>
    getAssignment(obj)
  ).length;
  const totalCount = room.objects.length;

  return (
    <div className="room-enter fixed inset-0 z-50 overflow-hidden">
      {/* ─── Loading shimmer state ─── */}
      {!bgLoaded && (
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full img-shimmer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl">{room.emoji}</span>
              <span className="text-sm text-slate-500 font-medium">
                {room.name} 로딩 중...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Background image with dark overlay ─── */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-500 ${
          bgLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* ─── Top-left: Back button ─── */}
      <button
        onClick={onBack}
        className="absolute top-5 left-5 z-30 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 backdrop-blur-sm text-white/90 text-sm font-medium hover:bg-black/50 hover:text-white transition-all duration-200"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        전체보기
      </button>

      {/* ─── Object hotspots ─── */}
      <div className="absolute inset-0 z-20">
        {room.objects.map((obj, index) => {
          const assignment = getAssignment(obj);
          return (
            <ObjectSpot
              key={obj.id}
              object={obj}
              isAssigned={!!assignment}
              assignedImageUrl={assignment?.imageUrl}
              assignedVerseRef={assignment?.verseRef}
              onClick={() => onObjectClick(obj)}
              delay={100 * index}
            />
          );
        })}
      </div>

      {/* ─── Bottom: Room info bar ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between bg-black/30 backdrop-blur-md rounded-2xl px-5 py-3">
          {/* Room name + emoji */}
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{room.emoji}</span>
            <div>
              <h2 className="text-white font-semibold text-base leading-tight">
                {room.name}
              </h2>
              <p className="text-white/60 text-xs mt-0.5">
                {room.description}
              </p>
            </div>
          </div>

          {/* Assignment count badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
              assignedCount === totalCount
                ? "bg-emerald-500/80 text-white"
                : "bg-white/20 text-white/90"
            }`}
          >
            {assignedCount === totalCount ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            )}
            <span>
              {assignedCount}/{totalCount} 구절
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
