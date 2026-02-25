// ============================================
// Bible Palace — Loci Card Component
// 개별 궁전 위치 카드
// ============================================

"use client";

interface LociCardProps {
  locusIndex: number;
  locusName: string;
  emoji?: string;
  keyword?: string | null;
  imageUrl?: string | null;
  segmentText?: string | null;
  isSelected?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
}

export default function LociCard({
  locusIndex,
  locusName,
  emoji,
  keyword,
  imageUrl,
  segmentText,
  isSelected = false,
  isRevealed = true,
  onClick,
}: LociCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 border rounded-xl text-left transition-all w-full ${
        isSelected
          ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100"
          : keyword
            ? "border-slate-200 bg-white hover:border-indigo-300"
            : "border-slate-200 bg-white opacity-50"
      }`}
    >
      {/* Image area */}
      <div className="aspect-square mb-2 bg-slate-50 rounded-lg overflow-hidden relative">
        {imageUrl && isRevealed ? (
          <>
            <img
              src={imageUrl}
              alt={keyword || locusName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {keyword && (
              <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full">
                {keyword}
              </span>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            {isRevealed ? (
              <>
                <span className="text-xl mb-1">{emoji || "📍"}</span>
                {keyword && <span className="text-xs">{keyword}</span>}
              </>
            ) : (
              <span className="text-2xl">❓</span>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex-shrink-0">
          {locusIndex + 1}
        </span>
        <span className="text-xs text-slate-500 truncate">{locusName}</span>
      </div>

      {isRevealed && segmentText && (
        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{segmentText}</p>
      )}
    </button>
  );
}
