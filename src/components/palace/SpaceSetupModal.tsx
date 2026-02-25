// ============================================
// Bible Palace — Space Setup Modal
// Choose space type + room count before creation
// ============================================

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SPACE_TEMPLATES } from "@/data/space-templates";

interface SpaceSetupModalProps {
  isOpen: boolean;
  onConfirm: (templateId: string, roomCount: number) => void;
}

export default function SpaceSetupModal({
  isOpen,
  onConfirm,
}: SpaceSetupModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("apartment");
  const [roomCount, setRoomCount] = useState(10);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCount(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) {
      setRoomCount(Math.max(3, Math.min(10, val)));
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedTemplate, roomCount);
  };

  const selected = SPACE_TEMPLATES.find((t) => t.id === selectedTemplate);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-lg mx-4 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="text-xl">🏗️</span>
                나의 공간 만들기
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                기억의 궁전에 사용할 공간을 선택하세요
              </p>
            </div>

            {/* Space Type Selection */}
            <div className="px-6 pb-4">
              <label className="text-sm font-semibold text-slate-700 mb-3 block">
                공간 종류
              </label>
              <div className="grid grid-cols-5 gap-2">
                {SPACE_TEMPLATES.map((template) => {
                  const isActive = selectedTemplate === template.id;
                  return (
                    <motion.button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all duration-200 ${
                        isActive
                          ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                          : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                      }`}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <span className="text-2xl">{template.emoji}</span>
                      <span
                        className={`text-[10px] font-medium leading-tight text-center ${
                          isActive ? "text-indigo-600" : "text-slate-500"
                        }`}
                      >
                        {template.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Selected template description */}
              <AnimatePresence mode="wait">
                {selected && (
                  <motion.p
                    key={selected.id}
                    className="mt-3 text-xs text-indigo-500 bg-indigo-50 px-3 py-2 rounded-lg text-center"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                  >
                    {selected.emoji} {selected.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Room Count */}
            <div className="px-6 pb-5">
              <label className="text-sm font-semibold text-slate-700 mb-3 block">
                공간 개수
              </label>

              <div className="flex items-center gap-4">
                {/* Slider */}
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min={3}
                    max={10}
                    value={roomCount}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-500
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-indigo-500
                      [&::-webkit-slider-thumb]:shadow-md
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:transition-transform
                      [&::-webkit-slider-thumb]:hover:scale-110"
                  />
                  {/* Scale labels */}
                  <div className="flex justify-between mt-1.5 px-0.5">
                    <span className="text-[9px] text-slate-300">3</span>
                    <span className="text-[9px] text-slate-300">5</span>
                    <span className="text-[9px] text-slate-300">7</span>
                    <span className="text-[9px] text-slate-300">10</span>
                  </div>
                </div>

                {/* Number input */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={3}
                    max={10}
                    value={roomCount}
                    onChange={handleInputChange}
                    className="w-16 h-10 text-center text-sm font-bold text-indigo-600 border-2 border-indigo-200 rounded-xl bg-indigo-50 outline-none focus:border-indigo-400 transition-colors"
                  />
                  <span className="text-xs text-slate-400">개</span>
                </div>
              </div>

              {/* Quick presets */}
              <div className="flex gap-2 mt-3">
                {[3, 5, 7, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRoomCount(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      roomCount === n
                        ? "bg-indigo-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {n}개
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="px-6 pb-6">
              <motion.button
                onClick={handleConfirm}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>✨</span>
                <span>
                  {selected?.emoji} {selected?.name} {roomCount}개 공간으로 시작하기
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
