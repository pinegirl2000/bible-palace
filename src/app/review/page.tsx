// ============================================
// Bible Palace — Review Hub
// 오늘의 복습 + 일정 캘린더
// ============================================

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ReviewScheduleItem {
  palaceId: string;
  palaceName: string;
  verseRef: string;
  nextReviewAt: string;
  isOverdue: boolean;
}

interface ReviewStatsData {
  totalPalaces: number;
  totalMemorized: number;
  currentStreak: number;
  totalAttempts: number;
  averageScore: number;
  todayReviews: ReviewScheduleItem[];
}

export default function ReviewPage() {
  const [stats, setStats] = useState<ReviewStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/review/stats")
      .then((r) => r.json())
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-semibold tracking-tight text-indigo-600">
              Bible Palace
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">복습</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-slate-500">불러오는 중...</div>
        ) : stats ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "총 궁전", value: stats.totalPalaces, emoji: "🏛️" },
                { label: "암송 완료", value: stats.totalMemorized, emoji: "✅" },
                { label: "연속 복습", value: `${stats.currentStreak}일`, emoji: "🔥" },
                { label: "평균 점수", value: `${stats.averageScore}%`, emoji: "📊" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 bg-white border border-slate-200 rounded-xl text-center shadow-sm">
                  <div className="text-2xl mb-1">{stat.emoji}</div>
                  <div className="text-xl font-bold text-indigo-600">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Today's Reviews */}
            <h3 className="text-lg font-medium text-slate-900 mb-4">📅 오늘의 복습</h3>
            {stats.todayReviews.length === 0 ? (
              <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-slate-500">오늘 복습할 궁전이 없습니다!</p>
                <p className="text-slate-400 text-sm mt-1">내일 다시 확인해보세요.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.todayReviews.map((review) => (
                  <Link
                    key={review.palaceId}
                    href={`/palace/${review.palaceId}/review`}
                    className="card-hover block p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">{review.palaceName}</div>
                        <div className="text-sm text-slate-500">{review.verseRef}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.isOverdue && (
                          <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full border border-red-200">
                            지연됨
                          </span>
                        )}
                        <span className="text-indigo-600 text-sm font-medium">복습하기 →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-slate-500">데이터를 불러올 수 없습니다</div>
        )}
      </main>
    </div>
  );
}
