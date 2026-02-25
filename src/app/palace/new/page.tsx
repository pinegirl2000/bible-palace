// ============================================
// Bible Palace — New Palace Creation Page
// 2-step flow: Setup Modal → Split Layout
// Split layout: Node Graph (top) + Room View (bottom)
// ============================================

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePalaceState } from "@/hooks/usePalaceState";
import SpaceSetupModal from "@/components/palace/SpaceSetupModal";
import SpaceNodeGraph from "@/components/palace/SpaceNodeGraph";
import FloorPlanView from "@/components/palace/FloorPlanView";
import ItemZoomOverlay from "@/components/palace/ItemZoomOverlay";
import VerseSelectorModal from "@/components/palace/VerseSelectorModal";

export default function PalaceNewPage() {
  const state = usePalaceState();

  // Auto-select first room after setup
  useEffect(() => {
    if (state.isSetupDone && !state.selectedRoom && state.orderedRooms.length > 0) {
      state.setSelectedRoom(state.orderedRooms[0]);
    }
  }, [state.isSetupDone, state.selectedRoom, state.orderedRooms]);

  // ── Step 1: Setup Modal ──
  if (!state.isSetupDone) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <SpaceSetupModal
          isOpen={true}
          onConfirm={state.handleSetupConfirm}
        />
      </div>
    );
  }

  // ── Step 2: Main Creation UI ──
  return (
    <div className="h-screen flex flex-col bg-white text-slate-900 overflow-hidden">
      {/* ── Header ── */}
      <header className="h-12 shrink-0 border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between bg-white z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/palace"
            className="text-slate-400 hover:text-slate-700 transition-colors text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            목록
          </Link>
          <div className="w-px h-5 bg-slate-200" />
          <input
            type="text"
            value={state.palaceName}
            onChange={(e) => state.setPalaceName(e.target.value)}
            className="text-sm font-medium text-slate-900 bg-transparent border-none outline-none focus:ring-0 w-48 sm:w-64 placeholder:text-slate-300"
            placeholder="궁전 이름을 입력하세요"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">
            {state.totalAssignments}개 구절 배치
          </span>
          <button
            onClick={state.handleSave}
            disabled={state.totalAssignments === 0 || state.saving}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            {state.saving ? (
              <>
                <span className="animate-spin text-xs">⏳</span>
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <span className="text-xs">💾</span>
                <span>저장</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── Success banner ── */}
      {state.savedPalaceId && (
        <div className="shrink-0 px-4 py-2.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🎉</span>
            <span className="text-sm font-medium text-emerald-800">
              궁전이 저장되었습니다! ({state.totalAssignments}개 구절)
            </span>
          </div>
          <Link
            href={`/palace/${state.savedPalaceId}`}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            궁전 보기
          </Link>
        </div>
      )}

      {/* ── Node Graph (top) ── */}
      <section className="shrink-0 h-[120px] sm:h-[140px] border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white px-2">
        <SpaceNodeGraph
          rooms={state.orderedRooms}
          selectedRoomId={state.selectedRoom?.id ?? null}
          assignments={state.assignments}
          onRoomSelect={state.setSelectedRoom}
          onReorder={state.setOrderedRooms}
        />
      </section>

      {/* ── Full Floor Plan View (bottom) ── */}
      <section className="flex-1 relative overflow-hidden">
        <FloorPlanView
          allRooms={state.orderedRooms}
          selectedRoomId={state.selectedRoom?.id ?? null}
          allAssignments={state.assignments}
          onRoomSelect={state.setSelectedRoom}
          onObjectClickInRoom={state.handleObjectClickInRoom}
        />

        {/* Item Zoom Overlay */}
        <ItemZoomOverlay
          isOpen={state.isZoomed}
          object={state.selectedObject}
          assignment={
            state.selectedRoom && state.selectedObject
              ? state.getObjectAssignment(
                  state.selectedRoom.id,
                  state.selectedObject.id
                ) ?? null
              : null
          }
          onClose={state.handleCloseZoom}
          onAssignVerse={() => {
            state.setIsZoomed(false);
            state.setShowVerseModal(true);
          }}
          onDeleteAssignment={state.handleDeleteAssignment}
        />
      </section>

      {/* ── Verse Selector Modal ── */}
      <VerseSelectorModal
        isOpen={state.showVerseModal}
        onClose={() => {
          state.setShowVerseModal(false);
          state.setSelectedObject(null);
        }}
        onSelect={state.handleVerseSelected}
      />
    </div>
  );
}
