// ============================================
// Bible Palace — Canvas Zoom/Pan Interaction Hook
// Manages zoom state for react-konva Stage
// ============================================

"use client";

import { useState, useCallback, RefObject } from "react";

interface ZoomState {
  scale: number;
  x: number;
  y: number;
}

export function useCanvasInteraction(stageRef: RefObject<unknown>) {
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  const zoomToPoint = useCallback(
    (pointX: number, pointY: number, targetScale = 2.5, duration = 0.4) => {
      const stage = stageRef.current as {
        to: (config: Record<string, unknown>) => void;
      } | null;
      if (!stage) return;

      const newX = -pointX * (targetScale - 1);
      const newY = -pointY * (targetScale - 1);

      stage.to({
        scaleX: targetScale,
        scaleY: targetScale,
        x: newX,
        y: newY,
        duration,
        easing: undefined, // Konva default easing
      });

      setZoomState({ scale: targetScale, x: newX, y: newY });
      setIsZoomedIn(true);
    },
    [stageRef]
  );

  const resetZoom = useCallback(
    (duration = 0.3) => {
      const stage = stageRef.current as {
        to: (config: Record<string, unknown>) => void;
      } | null;
      if (!stage) return;

      stage.to({
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0,
        duration,
      });

      setZoomState({ scale: 1, x: 0, y: 0 });
      setIsZoomedIn(false);
    },
    [stageRef]
  );

  return {
    zoomState,
    isZoomedIn,
    zoomToPoint,
    resetZoom,
  };
}
