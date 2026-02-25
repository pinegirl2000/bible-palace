// ============================================
// Bible Palace — Verse View
// 절 표시 + "암송하기" 버튼
// ============================================

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface VerseItem {
  id: number;
  verseNum: number;
  text: string;
}

export default function VerseViewPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const chapter = params.chapter as string;
  const [verses, setVerses] = useState<VerseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch(`/api/verses?bookId=${bookId}&chapter=${chapter}`)
      .then((r) => r.json())
      .then((res) => {
        setVerses(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookId, chapter]);

  const toggleVerse = (verseNum: number) => {
    setSelectedVerses((prev) => {
      const next = new Set(prev);
      if (next.has(verseNum)) next.delete(verseNum);
      else next.add(verseNum);
      return next;
    });
  };

  const selectedText = verses
    .filter((v) => selectedVerses.has(v.verseNum))
    .map((v) => v.text)
    .join(" ");

  const selectedRef = selectedVerses.size > 0
    ? `${bookId}:${chapter}:${Array.from(selectedVerses).sort((a, b) => a - b).join(",")}`
    : "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/read/${bookId}`} className="text-slate-500 hover:text-indigo-600 transition-colors">
            ← 장 목록
          </Link>
          <span className="text-slate-500 font-medium">{chapter}장</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-slate-500">불러오는 중...</div>
        ) : (
          <>
            {/* Verses */}
            <div className="space-y-2 mb-8">
              {verses.map((verse) => (
                <div
                  key={verse.verseNum}
                  onClick={() => toggleVerse(verse.verseNum)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedVerses.has(verse.verseNum)
                      ? "bg-indigo-50 border border-indigo-300"
                      : "hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <span className="text-indigo-600 text-sm font-medium mr-2">
                    {verse.verseNum}
                  </span>
                  <span className="text-slate-700 leading-relaxed">{verse.text}</span>
                </div>
              ))}
            </div>

            {/* Selected verse action bar */}
            {selectedVerses.size > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg animate-fade-in-up">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    {selectedVerses.size}개 절 선택됨
                  </div>
                  <Link
                    href={`/palace/new?verseRef=${encodeURIComponent(selectedRef)}&verseText=${encodeURIComponent(selectedText)}`}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    🏛️ 이 구절로 궁전 만들기
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
