// ============================================
// Bible Palace — Verse Image Card Component
// FLUX 이미지 위에 한글 텍스트를 CSS로 오버레이
// ============================================

"use client";

interface VerseImageCardProps {
  imageUrl?: string | null;
  locusIndex: number;
  locusName: string;
  keyword?: string | null;
  segmentText?: string | null;
  verseRef?: string;
  size?: "sm" | "md" | "lg";
  showOverlay?: boolean;
  onClick?: () => void;
}

export default function VerseImageCard({
  imageUrl,
  locusIndex,
  locusName,
  keyword,
  segmentText,
  verseRef,
  size = "md",
  showOverlay = true,
  onClick,
}: VerseImageCardProps) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${sizeClasses[size]} cursor-pointer group`}
      onClick={onClick}
    >
      {/* FLUX 배경 이미지 */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={keyword || locusName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <span className="text-3xl opacity-50">🏛️</span>
        </div>
      )}

      {showOverlay && (
        <>
          {/* 위치 번호 배지 (좌상단) */}
          <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
            {locusIndex + 1}
          </div>

          {/* 키워드 배지 (우상단) */}
          {keyword && (
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-indigo-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg">
              {keyword}
            </div>
          )}

          {/* 하단 텍스트 오버레이 (한글 구절) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-8">
            {/* 위치 이름 */}
            <div className="text-xs text-indigo-200 font-medium mb-0.5">
              {locusName}
            </div>

            {/* 구절 텍스트 (한글) */}
            {segmentText && (
              <div className="text-sm text-white leading-snug line-clamp-2 font-medium">
                {segmentText}
              </div>
            )}

            {/* 구절 참조 */}
            {verseRef && (
              <div className="text-[10px] text-slate-300 mt-1">
                {verseRef}
              </div>
            )}
          </div>
        </>
      )}

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors duration-300" />
    </div>
  );
}
