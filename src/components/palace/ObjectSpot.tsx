// ============================================
// Bible Palace — Object Spot Component
// 방 내부 물건 핫스팟 (클릭 가능)
// ============================================

"use client";

import { useState } from "react";

interface ObjectSpotProps {
  object: {
    id: string;
    name: string;
    emoji: string;
    position: { x: number; y: number };
  };
  isAssigned: boolean;
  assignedImageUrl?: string;
  assignedVerseRef?: string;
  onClick: () => void;
  delay?: number; // stagger animation delay in ms
}

export default function ObjectSpot({
  object,
  isAssigned,
  assignedImageUrl,
  assignedVerseRef,
  onClick,
  delay = 0,
}: ObjectSpotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="object-appear absolute z-10 group focus:outline-none"
      style={{
        left: `${object.position.x}%`,
        top: `${object.position.y}%`,
        transform: "translate(-50%, -50%)",
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}
      aria-label={
        isAssigned
          ? `${object.name} — ${assignedVerseRef}`
          : `${object.name} — 구절 배정하기`
      }
    >
      {/* ─── Assigned state: thumbnail image ─── */}
      {isAssigned ? (
        <div className="relative flex flex-col items-center">
          {/* Verse ref badge */}
          {assignedVerseRef && (
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow-lg z-20">
              {assignedVerseRef}
            </span>
          )}

          {/* Thumbnail circle */}
          <div className="w-14 h-14 rounded-full border-[3px] border-indigo-500 overflow-hidden shadow-lg transition-transform duration-200 group-hover:scale-110 bg-slate-100">
            {assignedImageUrl ? (
              <>
                {!imgLoaded && (
                  <div className="w-full h-full img-shimmer rounded-full" />
                )}
                <img
                  src={assignedImageUrl}
                  alt={`${object.name} 시각화`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  onLoad={() => setImgLoaded(true)}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-lg">
                {object.emoji}
              </div>
            )}
          </div>

          {/* Object name label */}
          <span className="mt-1.5 text-[11px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            {object.name}
          </span>
        </div>
      ) : (
        /* ─── Unassigned state: semi-transparent circle with "+" ─── */
        <div className="relative flex flex-col items-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border-2 border-white/50 transition-all duration-200 group-hover:scale-110 group-hover:bg-indigo-500/30 group-hover:border-indigo-300 ${
              !isAssigned ? "object-pulse" : ""
            }`}
            style={{
              /* override object-pulse transform origin for the pulse animation */
              transformOrigin: "center center",
            }}
          >
            <svg
              className="w-6 h-6 text-white/80 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>

          {/* Object name below */}
          <span className="mt-1.5 text-[11px] font-medium text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            {object.name}
          </span>
        </div>
      )}

      {/* ─── Tooltip on hover ─── */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm text-white text-xs rounded-lg shadow-xl whitespace-nowrap animate-fade-in z-30 pointer-events-none">
          <span className="mr-1">{object.emoji}</span>
          {isAssigned ? (
            <span>{assignedVerseRef || object.name}</span>
          ) : (
            <span>{object.name} — 탭하여 구절 배정</span>
          )}
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900/90" />
        </div>
      )}
    </button>
  );
}
