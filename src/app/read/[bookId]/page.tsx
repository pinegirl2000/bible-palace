// ============================================
// Bible Palace — Chapter Selection
// ============================================

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function ChapterSelectPage() {
  const params = useParams();
  const bookId = params.bookId as string;

  // 간단히 50장까지 표시 (실제로는 API에서 책 정보 조회)
  const chapters = Array.from({ length: 50 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/read" className="text-slate-500 hover:text-indigo-600 transition-colors">
            ← 성경 목록
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-xl font-medium text-slate-900 mb-6">장 선택</h2>
        <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {chapters.map((ch) => (
            <Link
              key={ch}
              href={`/read/${bookId}/${ch}`}
              className="card-hover p-3 bg-white border border-slate-200 rounded-lg text-center text-sm text-slate-900 shadow-sm hover:border-indigo-400 transition-colors"
            >
              {ch}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
