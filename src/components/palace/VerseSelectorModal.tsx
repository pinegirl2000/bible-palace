// ============================================
// Bible Palace — Verse Selector Modal Component
// 3-column Bible verse selection modal
// Extracted from palace/new page for reuse
// ============================================

"use client";

import { useState, useEffect, useCallback } from "react";

// ── Interfaces ──────────────────────────────

interface BookItem {
  id: number;
  name: string;
  nameEn: string;
  abbreviation: string;
  testament: "OLD" | "NEW";
  orderNum: number;
  chapterCount: number;
}

interface VerseItem {
  id: number;
  verseNum: number;
  text: string;
  textEn: string | null;
}

interface VerseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (verseRef: string, verseText: string) => void;
}

// ── Component ───────────────────────────────

export default function VerseSelectorModal({
  isOpen,
  onClose,
  onSelect,
}: VerseSelectorModalProps) {
  // Book data
  const [books, setBooks] = useState<BookItem[]>([]);

  // Selection state
  const [testamentTab, setTestamentTab] = useState<"OLD" | "NEW">("OLD");
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<VerseItem[]>([]);
  const [versesLoading, setVersesLoading] = useState(false);
  const [startVerse, setStartVerse] = useState<number | null>(null);
  const [endVerse, setEndVerse] = useState<number | null>(null);

  // ── Fetch books on mount ──────────────────

  useEffect(() => {
    if (!isOpen) return;

    fetch("/api/books")
      .then((r) => r.json())
      .then((res) => {
        const fetchedBooks: BookItem[] = res.books || [];
        setBooks(fetchedBooks);

        // Auto-select first book of current testament + chapter 1
        const firstBook =
          fetchedBooks.find((b) => b.testament === testamentTab) || null;
        setSelectedBook(firstBook);
        setSelectedChapter(firstBook ? 1 : null);
        setStartVerse(null);
        setEndVerse(null);
      })
      .catch(() => {});
    // Only re-fetch when modal opens (not on testamentTab change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ── Fetch verses when chapter selected ────

  useEffect(() => {
    if (!selectedBook || !selectedChapter) {
      setVerses([]);
      return;
    }
    setVersesLoading(true);
    fetch(`/api/verses?bookId=${selectedBook.id}&chapter=${selectedChapter}`)
      .then((r) => r.json())
      .then((res) => {
        setVerses(res.verses || []);
        setVersesLoading(false);
      })
      .catch(() => setVersesLoading(false));
  }, [selectedBook, selectedChapter]);

  // ── Verse range click handler ─────────────

  const handleVerseClick = useCallback(
    (verseNum: number) => {
      if (startVerse === null) {
        // First click — set start and end to the same verse
        setStartVerse(verseNum);
        setEndVerse(verseNum);
      } else if (endVerse === startVerse && verseNum >= startVerse) {
        // Second click (>= start) — extend the range
        setEndVerse(verseNum);
      } else {
        // Otherwise reset to new start
        setStartVerse(verseNum);
        setEndVerse(verseNum);
      }
    },
    [startVerse, endVerse]
  );

  // ── Testament tab change ──────────────────

  const handleTestamentChange = (tab: "OLD" | "NEW") => {
    setTestamentTab(tab);
    const firstBook = books.find((b) => b.testament === tab) || null;
    setSelectedBook(firstBook);
    setSelectedChapter(firstBook ? 1 : null);
    setStartVerse(null);
    setEndVerse(null);
  };

  // ── Book selection ────────────────────────

  const handleBookSelect = (book: BookItem) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setStartVerse(null);
    setEndVerse(null);
  };

  // ── Chapter selection ─────────────────────

  const handleChapterSelect = (ch: number) => {
    setSelectedChapter(ch);
    setStartVerse(null);
    setEndVerse(null);
  };

  // ── Computed preview ──────────────────────

  const previewRef =
    selectedBook && selectedChapter && startVerse
      ? `${selectedBook.name} ${selectedChapter}:${startVerse}${
          endVerse && endVerse !== startVerse ? `-${endVerse}` : ""
        }`
      : "";

  const previewText = verses
    .filter(
      (v) =>
        startVerse !== null &&
        endVerse !== null &&
        v.verseNum >= startVerse &&
        v.verseNum <= endVerse
    )
    .map((v) => v.text)
    .join(" ");

  // ── Confirm selection ─────────────────────

  const handleConfirmSelection = () => {
    if (previewRef && previewText) {
      onSelect(previewRef, previewText);
      onClose();
    }
  };

  // ── Don't render when closed ──────────────

  if (!isOpen) return null;

  // ── Render ────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            📖 구절 찾기
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body — 3-column layout */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Column 1: Book selection (200px) */}
          <div className="w-[200px] border-r border-slate-200 flex flex-col">
            {/* Testament tabs */}
            <div className="flex border-b border-slate-200">
              {(["OLD", "NEW"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTestamentChange(t)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    testamentTab === t
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {t === "OLD" ? "구약" : "신약"}
                </button>
              ))}
            </div>
            {/* Book list (scrollable) */}
            <div className="flex-1 overflow-y-auto">
              {books
                .filter((b) => b.testament === testamentTab)
                .map((book) => (
                  <button
                    key={book.id}
                    onClick={() => handleBookSelect(book)}
                    className={`w-full text-left px-4 py-2.5 text-sm border-b border-slate-100 transition-colors ${
                      selectedBook?.id === book.id
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {book.name}
                    <span className="text-slate-400 text-xs ml-1">
                      ({book.chapterCount})
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* Column 2: Chapter grid (160px, 4-col grid) */}
          <div className="w-[160px] border-r border-slate-200 flex flex-col">
            <div className="px-3 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50">
              {selectedBook ? `${selectedBook.name} — 장` : "장 선택"}
            </div>
            <div className="flex-1 overflow-y-auto">
              {selectedBook ? (
                <div className="grid grid-cols-4 gap-1 p-2">
                  {Array.from(
                    { length: selectedBook.chapterCount },
                    (_, i) => i + 1
                  ).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => handleChapterSelect(ch)}
                      className={`py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedChapter === ch
                          ? "bg-indigo-600 text-white"
                          : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm px-4 text-center">
                  왼쪽에서 책을 선택하세요
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Verse list with range selection (flex) */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span>
                {selectedBook && selectedChapter
                  ? `${selectedBook.name} ${selectedChapter}장`
                  : "절 선택"}
              </span>
              {startVerse && (
                <button
                  onClick={() => {
                    setStartVerse(null);
                    setEndVerse(null);
                  }}
                  className="text-xs text-slate-400 hover:text-red-500 normal-case tracking-normal transition-colors"
                >
                  선택 해제
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {versesLoading ? (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  불러오는 중...
                </div>
              ) : verses.length > 0 ? (
                <div className="p-2 space-y-0.5">
                  <p className="text-xs text-slate-400 px-2 pb-2">
                    시작 절 클릭 → 끝 절 클릭으로 범위를 선택하세요
                  </p>
                  {verses.map((v) => {
                    const isSelected =
                      startVerse !== null &&
                      endVerse !== null &&
                      v.verseNum >= startVerse &&
                      v.verseNum <= endVerse;
                    return (
                      <button
                        key={v.id}
                        onClick={() => handleVerseClick(v.verseNum)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          isSelected
                            ? "bg-indigo-50 border border-indigo-200"
                            : "hover:bg-slate-50 border border-transparent"
                        }`}
                      >
                        <span
                          className={`inline-block w-7 font-bold ${
                            isSelected ? "text-indigo-600" : "text-slate-400"
                          }`}
                        >
                          {v.verseNum}
                        </span>
                        <span
                          className={
                            isSelected ? "text-slate-900" : "text-slate-600"
                          }
                        >
                          {v.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm px-4 text-center">
                  {selectedBook
                    ? "장을 선택하세요"
                    : "왼쪽에서 책과 장을 선택하세요"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer — selected verse preview + confirm */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          {previewRef ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-indigo-600 text-sm">
                  {previewRef}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">
                  {previewText}
                </div>
              </div>
              <button
                onClick={handleConfirmSelection}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors whitespace-nowrap"
              >
                선택 완료
              </button>
            </div>
          ) : (
            <div className="text-sm text-slate-400 text-center">
              책 → 장 → 절 범위를 선택해주세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
