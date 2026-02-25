// ============================================
// Bible Palace — Profile Page
// 프로필 + 배지 + 통계
// ============================================

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ProfileData {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  stats: {
    totalPalaces: number;
    totalMemorized: number;
    totalAttempts: number;
    averageScore: number;
  };
  badges: Array<{
    id: string;
    name: string;
    iconEmoji: string;
    description: string;
    earnedAt: string;
  }>;
  groups: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <div className="text-slate-500">불러오는 중...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">로그인이 필요합니다</p>
          <Link href="/login" className="text-indigo-600 hover:underline mt-2 inline-block">로그인</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-indigo-600">Bible Palace</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">프로필</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-semibold">
            {profile.name?.[0] || "👤"}
          </div>
          <div>
            <h2 className="text-xl font-medium text-slate-900">{profile.name || "사용자"}</h2>
            <p className="text-slate-500 text-sm">{profile.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "총 궁전", value: profile.stats.totalPalaces, emoji: "🏛️" },
            { label: "암송 완료", value: profile.stats.totalMemorized, emoji: "✅" },
            { label: "총 시도", value: profile.stats.totalAttempts, emoji: "📝" },
            { label: "평균 점수", value: `${profile.stats.averageScore}%`, emoji: "📊" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-white border border-slate-200 rounded-xl text-center shadow-sm">
              <div className="text-xl mb-1">{stat.emoji}</div>
              <div className="text-lg font-bold text-indigo-600">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <h3 className="text-lg font-medium text-slate-900 mb-4">🏆 획득 배지</h3>
        {profile.badges.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 mb-8 shadow-sm">
            아직 획득한 배지가 없습니다. 첫 궁전을 만들어보세요!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {profile.badges.map((badge) => (
              <div key={badge.id} className="p-4 bg-white border border-slate-200 rounded-xl text-center shadow-sm">
                <div className="text-3xl mb-2">{badge.iconEmoji}</div>
                <div className="font-medium text-sm text-slate-900">{badge.name}</div>
                <div className="text-slate-500 text-xs mt-1">{badge.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Groups */}
        {profile.groups.length > 0 && (
          <>
            <h3 className="text-lg font-medium text-slate-900 mb-4">👥 내 그룹</h3>
            <div className="space-y-2">
              {profile.groups.map((group) => (
                <Link
                  key={group.id}
                  href={`/group/${group.id}`}
                  className="block p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors shadow-sm"
                >
                  <span className="font-medium text-slate-900">{group.name}</span>
                  <span className="text-slate-500 text-sm ml-2">
                    ({group.role === "owner" ? "소유자" : group.role === "leader" ? "리더" : "멤버"})
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
