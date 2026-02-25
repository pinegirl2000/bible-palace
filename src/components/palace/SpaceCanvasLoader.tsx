// ============================================
// Bible Palace — SSR-safe Canvas Loader
// react-konva uses browser APIs, must load client-only
// ============================================

import dynamic from "next/dynamic";

const SpaceCanvas = dynamic(() => import("./SpaceCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl">
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full img-shimmer" />
        <span className="text-sm text-slate-400 animate-pulse">
          캔버스 준비 중...
        </span>
      </div>
    </div>
  ),
});

export default SpaceCanvas;
