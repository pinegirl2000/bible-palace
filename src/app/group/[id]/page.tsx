// ============================================
// Bible Palace — Group Detail Page
// ============================================

"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface GroupMember {
  userId: number;
  userName: string;
  role: string;
  palaceCount: number;
  memorizedVerses: number;
  joinedAt: string;
}

interface GroupDetail {
  id: number;
  name: string;
  description: string | null;
  inviteCode: string;
  memberCount: number;
  members: GroupMember[];
  createdAt: string;
}

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/group/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setGroup(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const copyInviteCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">👥</div>
          <p className="text-slate-500">그룹 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">😔</div>
          <p className="text-slate-500 mb-4">그룹을 찾을 수 없습니다</p>
          <Link href="/group" className="text-indigo-600 hover:text-indigo-700">
            ← 그룹 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/group" className="text-slate-500 hover:text-indigo-600 transition-colors">
            ← 돌아가기
          </Link>
        </div>

        {/* Group Info Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-light text-slate-900 mb-1">{group.name}</h1>
              {group.description && (
                <p className="text-slate-500 text-sm">{group.description}</p>
              )}
            </div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">
              {group.memberCount}명
            </span>
          </div>

          {/* Invite Code */}
          <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">초대 코드</p>
              <p className="text-xl font-mono tracking-widest text-indigo-600">
                {group.inviteCode}
              </p>
            </div>
            <button
              onClick={copyInviteCode}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
        </div>

        {/* Members */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">👥 멤버 ({group.members.length}명)</h2>

          <div className="space-y-3">
            {group.members.map((member, i) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {member.userName}
                      {member.role === "owner" && (
                        <span className="ml-2 text-xs text-indigo-600">👑 리더</span>
                      )}
                      {member.role === "leader" && (
                        <span className="ml-2 text-xs text-indigo-600">⭐ 부리더</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      궁전 {member.palaceCount}개 · 암송 {member.memorizedVerses}구절
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-600">
                    {member.memorizedVerses}
                  </div>
                  <div className="text-[10px] text-slate-500">구절</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {group.members.reduce((sum, m) => sum + m.palaceCount, 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">총 궁전 수</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {group.members.reduce((sum, m) => sum + m.memorizedVerses, 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">총 암송 구절</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{group.memberCount}</div>
            <div className="text-xs text-slate-500 mt-1">멤버 수</div>
          </div>
        </div>
      </div>
    </div>
  );
}
