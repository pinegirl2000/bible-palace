// ============================================
// Bible Palace — Create Group Page
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GroupNewPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: description || undefined }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push(`/group/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "그룹 생성에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">👥</div>
          <h2 className="text-2xl font-light text-slate-900">새 셀 그룹 만들기</h2>
          <p className="text-slate-500 text-sm mt-2">함께 암송하는 그룹을 만드세요</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm text-slate-500 mb-1">그룹 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 교회 청년부 암송 모임"
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-1">설명 (선택)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="그룹 소개를 작성해주세요"
              rows={3}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-medium transition-colors"
          >
            {loading ? "생성 중..." : "그룹 만들기"}
          </button>
        </form>

        <p className="text-center mt-4">
          <Link href="/group" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">
            ← 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
