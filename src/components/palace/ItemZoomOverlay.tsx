// ============================================
// Bible Palace — Item Zoom Overlay
// Shown when a hotspot is clicked — verse detail or assignment
// ============================================

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RoomObject, VerseAssignment } from "@/data/rooms";

interface ItemZoomOverlayProps {
  isOpen: boolean;
  object: RoomObject | null;
  assignment: VerseAssignment | null;
  onClose: () => void;
  onAssignVerse: () => void;
  onDeleteAssignment: () => void;
}

export default function ItemZoomOverlay({
  isOpen,
  object,
  assignment,
  onClose,
  onAssignVerse,
  onDeleteAssignment,
}: ItemZoomOverlayProps) {
  if (!object) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop - frosted glass */}
          <motion.div
            className="absolute inset-0 bg-white/60 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{object.emoji}</span>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">
                    {object.name}
                  </h3>
                  {assignment && (
                    <p className="text-indigo-600 text-sm font-medium">
                      {assignment.verseRef}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            {assignment ? (
              <div className="p-5 space-y-4">
                {/* Verse visualization image */}
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={assignment.imageUrl}
                    alt={`${assignment.verseRef} 시각화`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f1f5f9' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='40'%3E%F0%9F%8E%A8%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>

                {/* Verse text */}
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-indigo-600 font-semibold text-sm mb-1">
                    {assignment.verseRef}
                  </p>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {assignment.verseText}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={onDeleteAssignment}
                    className="flex-1 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    구절 삭제
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {/* Empty state — invite to assign */}
                <div className="text-center py-6">
                  <div className="text-5xl mb-3">{object.emoji}</div>
                  <p className="text-slate-500 text-sm mb-1">
                    아직 말씀이 배치되지 않았습니다
                  </p>
                  <p className="text-slate-400 text-xs">
                    이 물건에 성경 구절을 연결해보세요
                  </p>
                </div>

                {/* Actions */}
                <button
                  onClick={onAssignVerse}
                  className="w-full py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span>📖</span>
                  <span>구절 배치하기</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  닫기
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
