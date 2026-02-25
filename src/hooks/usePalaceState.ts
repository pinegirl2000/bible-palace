// ============================================
// Bible Palace — Palace Creation State Hook
// Manages setup, room/object selection, assignments, saving
// ============================================

"use client";

import { useState, useCallback } from "react";
import {
  Room,
  RoomObject,
  VerseAssignment,
  generateRooms,
} from "@/data/rooms";
import {
  buildVerseVisualizationPrompt,
  getVerseVisualizationUrl,
} from "@/data/pastel-prompts";

export function usePalaceState() {
  // ── Setup stage ──
  const [isSetupDone, setIsSetupDone] = useState(false);
  const [templateId, setTemplateId] = useState<string>("apartment");
  const [roomCount, setRoomCount] = useState(10);

  // ── Room order (user can reorder via drag-and-drop) ──
  const [orderedRooms, setOrderedRooms] = useState<Room[]>([]);

  // ── Selection state ──
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);

  // ── Assignments ──
  const [assignments, setAssignments] = useState<VerseAssignment[]>([]);

  // ── UI state ──
  const [showVerseModal, setShowVerseModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // ── Palace meta ──
  const [palaceName, setPalaceName] = useState("나의 기억의 궁전");
  const [saving, setSaving] = useState(false);
  const [savedPalaceId, setSavedPalaceId] = useState<string | null>(null);

  // ── Dragged positions (overrides for drag-and-drop) ──
  const [draggedPositions, setDraggedPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  // ── Setup handler ──
  const handleSetupConfirm = useCallback(
    (tmplId: string, count: number) => {
      setTemplateId(tmplId);
      setRoomCount(count);
      const rooms = generateRooms(tmplId, count);
      setOrderedRooms(rooms);
      setIsSetupDone(true);
      // Reset any previous state
      setSelectedRoom(null);
      setSelectedObject(null);
      setAssignments([]);
      setDraggedPositions({});
      setSavedPalaceId(null);
    },
    []
  );

  // ── Getters ──

  const getAssignmentCount = useCallback(
    (roomId: string): number =>
      assignments.filter((a) => a.roomId === roomId).length,
    [assignments]
  );

  const getRoomAssignments = useCallback(
    (roomId: string): VerseAssignment[] =>
      assignments.filter((a) => a.roomId === roomId),
    [assignments]
  );

  const getObjectAssignment = useCallback(
    (roomId: string, objectId: string): VerseAssignment | undefined =>
      assignments.find(
        (a) => a.roomId === roomId && a.objectId === objectId
      ),
    [assignments]
  );

  const totalAssignments = assignments.length;

  // ── Handlers ──

  const handleObjectClick = useCallback(
    (object: RoomObject) => {
      if (!selectedRoom) return;
      setSelectedObject(object);
      const existing = assignments.find(
        (a) => a.roomId === selectedRoom.id && a.objectId === object.id
      );
      if (existing) {
        setIsZoomed(true);
      } else {
        setShowVerseModal(true);
      }
    },
    [selectedRoom, assignments]
  );

  const handleVerseSelected = useCallback(
    (verseRef: string, verseText: string) => {
      if (!selectedRoom || !selectedObject) return;

      const visualPromptEn = buildVerseVisualizationPrompt(
        selectedObject.name,
        verseRef,
        verseText
      );
      const imageUrl = getVerseVisualizationUrl(
        selectedObject.name,
        verseRef,
        verseText,
        selectedObject.id
      );

      const newAssignment: VerseAssignment = {
        roomId: selectedRoom.id,
        objectId: selectedObject.id,
        objectName: selectedObject.name,
        verseRef,
        verseText,
        visualPromptEn,
        imageUrl,
      };

      setAssignments((prev) => {
        // Replace if already assigned (shouldn't happen, but guard)
        const filtered = prev.filter(
          (a) =>
            !(a.roomId === selectedRoom.id && a.objectId === selectedObject.id)
        );
        return [...filtered, newAssignment];
      });

      setShowVerseModal(false);
      setIsZoomed(true); // Show the newly assigned visualization
    },
    [selectedRoom, selectedObject]
  );

  const handleDeleteAssignment = useCallback(() => {
    if (!selectedRoom || !selectedObject) return;
    setAssignments((prev) =>
      prev.filter(
        (a) =>
          !(a.roomId === selectedRoom.id && a.objectId === selectedObject.id)
      )
    );
    setIsZoomed(false);
    setSelectedObject(null);
  }, [selectedRoom, selectedObject]);

  const handleObjectDragEnd = useCallback(
    (objectId: string, newPosition: { x: number; y: number }) => {
      setDraggedPositions((prev) => ({
        ...prev,
        [objectId]: newPosition,
      }));
    },
    []
  );

  const getObjectPosition = useCallback(
    (object: RoomObject): { x: number; y: number } =>
      draggedPositions[object.id] || object.position,
    [draggedPositions]
  );

  const handleSave = useCallback(async () => {
    if (totalAssignments === 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/palace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: palaceName,
          templateId,
          assignments: assignments.map((a) => ({
            roomId: a.roomId,
            objectId: a.objectId,
            objectName: a.objectName,
            verseRef: a.verseRef,
            verseText: a.verseText,
            imageUrl: a.imageUrl,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSavedPalaceId(data.data.id);
    } catch (err) {
      console.error("Save failed:", err);
      alert(
        err instanceof Error ? err.message : "궁전 저장에 실패했습니다"
      );
    } finally {
      setSaving(false);
    }
  }, [palaceName, assignments, totalAssignments]);

  const handleRoomSelect = useCallback((room: Room) => {
    setSelectedRoom(room);
    setSelectedObject(null);
    setIsZoomed(false);
  }, []);

  const handleCloseZoom = useCallback(() => {
    setIsZoomed(false);
    setSelectedObject(null);
  }, []);

  // Handle object click with explicit room context
  // (avoids stale closure issue when clicking from full floor plan)
  const handleObjectClickInRoom = useCallback(
    (room: Room, object: RoomObject) => {
      setSelectedRoom(room);
      setSelectedObject(object);
      const existing = assignments.find(
        (a) => a.roomId === room.id && a.objectId === object.id
      );
      if (existing) {
        setIsZoomed(true);
      } else {
        setIsZoomed(false);
        setShowVerseModal(true);
      }
    },
    [assignments]
  );

  return {
    // Setup
    isSetupDone,
    templateId,
    roomCount,
    handleSetupConfirm,

    // State
    orderedRooms,
    selectedRoom,
    selectedObject,
    assignments,
    showVerseModal,
    isZoomed,
    palaceName,
    saving,
    savedPalaceId,
    draggedPositions,

    // Setters
    setOrderedRooms,
    setSelectedRoom: handleRoomSelect,
    setSelectedObject,
    setShowVerseModal,
    setIsZoomed,
    setPalaceName,

    // Handlers
    handleObjectClick,
    handleObjectClickInRoom,
    handleVerseSelected,
    handleDeleteAssignment,
    handleObjectDragEnd,
    handleSave,
    handleCloseZoom,

    // Getters
    getAssignmentCount,
    getRoomAssignments,
    getObjectAssignment,
    getObjectPosition,
    totalAssignments,
  };
}

export type PalaceState = ReturnType<typeof usePalaceState>;
