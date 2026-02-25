// ============================================
// Bible Palace — Interactive Konva Canvas
// Pastel room illustration + draggable hotspots
// ============================================

"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Stage, Layer, Image as KImage, Circle, Group, Text, Ring, Rect } from "react-konva";
import Konva from "konva";
import { Room, RoomObject, VerseAssignment } from "@/data/rooms";
import { getPastelRoomImageUrl } from "@/data/pastel-prompts";

interface SpaceCanvasProps {
  room: Room;
  assignments: VerseAssignment[];
  onObjectClick: (object: RoomObject) => void;
  onObjectDragEnd: (objectId: string, newPosition: { x: number; y: number }) => void;
  draggedPositions: Record<string, { x: number; y: number }>;
}

// ── Hotspot Component ──

function Hotspot({
  object,
  stageWidth,
  stageHeight,
  isAssigned,
  assignment,
  onClick,
  onDragEnd,
  draggedPositions,
  index,
}: {
  object: RoomObject;
  stageWidth: number;
  stageHeight: number;
  isAssigned: boolean;
  assignment?: VerseAssignment;
  onClick: () => void;
  onDragEnd: (objectId: string, newPos: { x: number; y: number }) => void;
  draggedPositions: Record<string, { x: number; y: number }>;
  index: number;
}) {
  const pos = draggedPositions[object.id] || object.position;
  const x = (pos.x / 100) * stageWidth;
  const y = (pos.y / 100) * stageHeight;
  const radius = Math.min(stageWidth, stageHeight) * 0.04;
  const nodeRef = useRef<Konva.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Pulse animation for unassigned spots
  useEffect(() => {
    if (isAssigned || !nodeRef.current) return;
    const circle = nodeRef.current.findOne(".pulse-ring") as Konva.Ring | null;
    if (!circle) return;

    const anim = new Konva.Animation((frame) => {
      if (!frame) return;
      const scale = 1 + 0.15 * Math.sin((frame.time / 1000) * Math.PI);
      const opacity = 0.6 - 0.3 * Math.sin((frame.time / 1000) * Math.PI);
      circle.scaleX(scale);
      circle.scaleY(scale);
      circle.opacity(opacity);
    }, circle.getLayer());

    anim.start();
    return () => { anim.stop(); };
  }, [isAssigned]);

  // Staggered entrance
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    node.opacity(0);
    node.scaleX(0.3);
    node.scaleY(0.3);
    const timeout = setTimeout(() => {
      node.to({
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 0.4,
        easing: Konva.Easings.BackEaseOut,
      });
    }, index * 100 + 200);
    return () => clearTimeout(timeout);
  }, [index, stageWidth]); // Re-run on resize

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const newX = (e.target.x() / stageWidth) * 100;
      const newY = (e.target.y() / stageHeight) * 100;
      onDragEnd(object.id, {
        x: Math.max(5, Math.min(95, newX)),
        y: Math.max(5, Math.min(95, newY)),
      });
    },
    [stageWidth, stageHeight, object.id, onDragEnd]
  );

  return (
    <Group
      ref={nodeRef}
      x={x}
      y={y}
      draggable
      onDragEnd={handleDragEnd}
      onClick={onClick}
      onTap={onClick}
      onMouseEnter={() => {
        setHovered(true);
        const stage = nodeRef.current?.getStage();
        if (stage) stage.container().style.cursor = "pointer";
      }}
      onMouseLeave={() => {
        setHovered(false);
        const stage = nodeRef.current?.getStage();
        if (stage) stage.container().style.cursor = "default";
      }}
      dragBoundFunc={(pos) => ({
        x: Math.max(radius, Math.min(stageWidth - radius, pos.x)),
        y: Math.max(radius, Math.min(stageHeight - radius, pos.y)),
      })}
    >
      {/* Pulse ring for unassigned */}
      {!isAssigned && (
        <Ring
          name="pulse-ring"
          innerRadius={radius * 0.8}
          outerRadius={radius * 1.2}
          fill="rgba(99, 102, 241, 0.3)"
          opacity={0.6}
        />
      )}

      {/* Main circle */}
      <Circle
        radius={radius}
        fill={
          isAssigned
            ? "rgba(79, 70, 229, 0.85)"
            : hovered
            ? "rgba(255, 255, 255, 0.95)"
            : "rgba(255, 255, 255, 0.8)"
        }
        stroke={isAssigned ? "#4f46e5" : hovered ? "#818cf8" : "rgba(148, 163, 184, 0.6)"}
        strokeWidth={isAssigned ? 2.5 : 1.5}
        shadowColor="rgba(0,0,0,0.15)"
        shadowBlur={hovered ? 12 : 6}
        shadowOffsetY={2}
      />

      {/* "+" icon for unassigned */}
      {!isAssigned && (
        <Text
          text="+"
          fontSize={radius * 1.2}
          fill="#6366f1"
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
          width={radius * 2}
          height={radius * 2}
          offsetX={radius}
          offsetY={radius}
        />
      )}

      {/* Checkmark for assigned */}
      {isAssigned && (
        <Text
          text="✓"
          fontSize={radius * 0.9}
          fill="white"
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
          width={radius * 2}
          height={radius * 2}
          offsetX={radius}
          offsetY={radius}
        />
      )}

      {/* Object name label */}
      <Text
        text={`${object.emoji} ${object.name}`}
        fontSize={Math.max(11, radius * 0.6)}
        fill={hovered || isAssigned ? "#1e293b" : "#475569"}
        fontStyle={isAssigned ? "bold" : "normal"}
        align="center"
        width={radius * 6}
        offsetX={radius * 3}
        y={radius + 6}
        padding={2}
      />

      {/* Verse ref badge for assigned */}
      {isAssigned && assignment && (
        <>
          <Circle
            x={0}
            y={-(radius + 8)}
            radius={Math.max(10, radius * 0.5)}
            fill="#4f46e5"
          />
          <Text
            text={assignment.verseRef.split(" ").pop() || ""}
            fontSize={Math.max(8, radius * 0.35)}
            fill="white"
            fontStyle="bold"
            align="center"
            width={radius * 3}
            offsetX={radius * 1.5}
            y={-(radius + 8 + Math.max(5, radius * 0.2))}
          />
        </>
      )}
    </Group>
  );
}

// ── Main Canvas Component ──

export default function SpaceCanvas({
  room,
  assignments,
  onObjectClick,
  onObjectDragEnd,
  draggedPositions,
}: SpaceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [bgLoading, setBgLoading] = useState(true);

  // Responsive sizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setDimensions({ width: Math.floor(width), height: Math.floor(height) });
      }
    });

    observer.observe(container);
    // Initial sizing
    const rect = container.getBoundingClientRect();
    if (rect.width > 0) {
      setDimensions({ width: Math.floor(rect.width), height: Math.floor(rect.height) });
    }

    return () => observer.disconnect();
  }, []);

  // Load background image
  useEffect(() => {
    setBgLoading(true);
    setBgImage(null);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = getPastelRoomImageUrl(room.id, room.pastelPromptEn);
    img.onload = () => {
      setBgImage(img);
      setBgLoading(false);
    };
    img.onerror = () => {
      setBgLoading(false);
    };
  }, [room.id, room.pastelPromptEn]);

  // Assignment lookup
  const assignmentMap = useMemo(() => {
    const map: Record<string, VerseAssignment> = {};
    assignments.forEach((a) => {
      map[a.objectId] = a;
    });
    return map;
  }, [assignments]);

  return (
    <div ref={containerRef} className="w-full h-full relative rounded-2xl overflow-hidden bg-slate-100">
      {/* Loading shimmer */}
      {bgLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full img-shimmer" />
            <span className="text-sm text-slate-400 animate-pulse">
              {room.emoji} {room.name} 일러스트 로딩 중...
            </span>
          </div>
        </div>
      )}

      {/* Canvas */}
      {dimensions.width > 0 && (
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          style={{ borderRadius: "1rem" }}
        >
          {/* Background Layer */}
          <Layer listening={false}>
            {bgImage && (
              <KImage
                image={bgImage}
                width={dimensions.width}
                height={dimensions.height}
              />
            )}
          </Layer>

          {/* Light overlay for readability */}
          <Layer listening={false}>
            <Rect
              x={0}
              y={0}
              width={dimensions.width}
              height={dimensions.height}
              fill="rgba(255, 255, 255, 0.08)"
            />
          </Layer>

          {/* Hotspots Layer */}
          <Layer>
            {room.objects.map((obj, idx) => (
              <Hotspot
                key={obj.id}
                object={obj}
                stageWidth={dimensions.width}
                stageHeight={dimensions.height}
                isAssigned={!!assignmentMap[obj.id]}
                assignment={assignmentMap[obj.id]}
                onClick={() => onObjectClick(obj)}
                onDragEnd={onObjectDragEnd}
                draggedPositions={draggedPositions}
                index={idx}
              />
            ))}
          </Layer>
        </Stage>
      )}

      {/* Room info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3 pointer-events-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="text-lg">{room.emoji}</span>
            <span className="font-medium text-sm">{room.name}</span>
            <span className="text-white/60 text-xs">— {room.description}</span>
          </div>
          <div className="text-white/80 text-xs font-medium">
            {assignments.length}/{room.objects.length} 배치됨
          </div>
        </div>
      </div>
    </div>
  );
}
