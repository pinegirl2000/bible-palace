// ============================================
// Bible Palace — Bible Reading - Book Selection
// 66권 성경 책 선택 페이지
// ============================================

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BookItem {
  id: number;
  name: string;
  nameEn: string;
  abbreviation: string;
  testament: "OLD" | "NEW";
  chapterCount: number;
}

export default function ReadPage() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"OLD" | "NEW">("OLD");

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((res) => {
        setBooks(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = books.filter((b) => b.testament === tab);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-indigo-600">Bible Palace</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">성경 읽기</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["OLD", "NEW"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {t === "OLD" ? "구약" : "신약"} ({books.filter((b) => b.testament === t).length}권)
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">불러오는 중...</div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {filtered.map((book) => (
              <Link
                key={book.id}
                href={`/read/${book.id}`}
                className="card-hover p-3 bg-white border border-slate-200 rounded-xl text-center shadow-sm hover:border-indigo-400 transition-colors"
              >
                <div className="font-medium text-sm text-slate-900">{book.name}</div>
                <div className="text-slate-500 text-xs mt-0.5">{book.chapterCount}장</div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
