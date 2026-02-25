// ============================================
// Bible Palace — Cell Groups List
// ============================================

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface GroupItem {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string;
  role: string;
  memberCount: number;
  joinedAt: string;
}

export default function GroupPage() {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/group")
      .then((r) => r.json())
      .then((res) => {
        setGroups(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-semibold tracking-wide text-indigo-600">Bible Palace</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">셀 그룹</span>
          </div>
          <div className="flex gap-2">
            <Link href="/group/join" className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-sm transition-colors text-slate-900">
              초대 코드 입력
            </Link>
            <Link href="/group/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
              + 새 그룹
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-slate-500">불러오는 중...</div>
        ) : groups.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-2xl font-light text-slate-900 mb-2">아직 그룹이 없습니다</h2>
            <p className="text-slate-500 mb-8">셀 모임 멤버들과 함께 암송하세요</p>
            <div className="flex gap-3 justify-center">
              <Link href="/group/new" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">
                새 그룹 만들기
              </Link>
              <Link href="/group/join" className="px-6 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors">
                초대 코드로 가입
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/group/${group.id}`}
                className="block p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg text-slate-900">{group.name}</h3>
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-xs rounded-full border border-slate-200">
                        {group.role === "owner" ? "소유자" : group.role === "leader" ? "리더" : "멤버"}
                      </span>
                    </div>
                    {group.description && (
                      <p className="text-slate-500 text-sm mt-1">{group.description}</p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-slate-500">👥 {group.memberCount}명</div>
                    <div className="text-slate-400 text-xs mt-1">
                      코드: {group.inviteCode}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
