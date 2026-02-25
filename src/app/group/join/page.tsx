// ============================================
// Bible Palace — Join Group Page
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GroupJoinPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/group/join/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: inviteCode.trim().toUpperCase() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push(`/group/${data.data.groupId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "그룹 가입에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔑</div>
          <h2 className="text-2xl font-light text-slate-900">초대 코드로 가입</h2>
          <p className="text-slate-500 text-sm mt-2">그룹 리더에게 받은 초대 코드를 입력하세요</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          <div>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="초대 코드 (예: ABC12345)"
              required
              maxLength={20}
              className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 text-center text-2xl tracking-widest placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={!inviteCode.trim() || loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-medium transition-colors"
          >
            {loading ? "가입 중..." : "그룹 가입"}
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
