// ============================================
// Bible Palace — Palace Detail View
// 궁전 상세: 플로어플랜 + Loci + 이미지
// ============================================

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface PalaceDetail {
  id: string;
  name: string;
  verseRef: string;
  verseText: string;
  narrative: string | null;
  imageStyle: string;
  templateKey: string;
  createdAt: string;
  loci: Array<{
    id: string;
    locusIndex: number;
    locusName: string;
    segmentText: string | null;
    keyword: string | null;
    imageDescription: string | null;
    imageUrl: string | null;
    imagePrompt: string | null;
    senses: string | null;
  }>;
  reviewSchedules: Array<{
    id: string;
    difficulty: string;
    repetitionNum: number;
    nextReviewAt: string;
    lastReviewedAt: string | null;
  }>;
  _count: { attempts: number };
}

export default function PalaceDetailPage() {
  const params = useParams();
  const [palace, setPalace] = useState<PalaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocus, setSelectedLocus] = useState<number | null>(null);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/palace/${params.id}`)
      .then((r) => r.json())
      .then((res) => {
        setPalace(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="text-slate-500">불러오는 중...</div>
      </div>
    );
  }

  if (!palace) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <p className="text-slate-500">궁전을 찾을 수 없습니다</p>
          <Link href="/palace" className="text-indigo-600 hover:underline mt-2 inline-block">
            내 궁전 목록으로
          </Link>
        </div>
      </div>
    );
  }

  const schedule = palace.reviewSchedules[0];
  const selected = selectedLocus !== null ? palace.loci.find((l) => l.locusIndex === selectedLocus) : null;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/palace" className="text-slate-500 hover:text-slate-900 transition-colors">
              ← 내 궁전
            </Link>
            <span className="text-slate-300">|</span>
            <h2 className="font-medium text-slate-900">{palace.name}</h2>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/palace/${palace.id}/walkthrough`}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-sm text-slate-700 transition-colors"
            >
              🚶 워크스루
            </Link>
            <Link
              href={`/palace/${palace.id}/review`}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              ✍️ 암송 테스트
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Palace Info */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-medium text-indigo-600">{palace.verseRef}</h3>
              <p className="text-slate-700 mt-2">{palace.verseText}</p>
            </div>
            {schedule && (
              <div className="text-right text-sm">
                <div className="text-slate-500">다음 복습</div>
                <div className={`font-medium ${
                  new Date(schedule.nextReviewAt) <= new Date() ? "text-indigo-600" : "text-slate-700"
                }`}>
                  {new Date(schedule.nextReviewAt).toLocaleDateString("ko-KR")}
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  {schedule.repetitionNum}회차 · {schedule.difficulty}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loci Grid */}
        <h4 className="text-lg font-medium text-slate-900 mb-4">🏠 기억의 궁전 지점</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
          {palace.loci.map((locus) => (
            <button
              key={locus.locusIndex}
              onClick={() => setSelectedLocus(locus.locusIndex === selectedLocus ? null : locus.locusIndex)}
              className={`p-3 border rounded-xl text-left transition-all ${
                selectedLocus === locus.locusIndex
                  ? "border-indigo-600 bg-indigo-50"
                  : locus.keyword
                    ? "border-slate-200 hover:border-indigo-300"
                    : "border-slate-200 opacity-50"
              }`}
            >
              {/* Image or placeholder */}
              <div className="relative aspect-square mb-2 bg-slate-100 rounded-lg overflow-hidden">
                {locus.imageUrl ? (
                  <>
                    <img
                      src={locus.imageUrl}
                      alt={locus.keyword || locus.locusName}
                      className="w-full h-full object-cover"
                    />
                    {locus.keyword && (
                      <span className="absolute bottom-1 left-1 right-1 bg-white/90 text-xs text-slate-900 px-1.5 py-0.5 rounded text-center font-medium truncate">
                        {locus.keyword}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    {locus.keyword ? "🔄" : "⬜"}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="step-badge text-xs w-5 h-5 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-medium">{locus.locusIndex + 1}</span>
                <span className="text-xs text-slate-500 truncate">{locus.locusName}</span>
              </div>
              {locus.keyword && (
                <div className="text-xs text-indigo-600 mt-1 truncate">{locus.keyword}</div>
              )}
            </button>
          ))}
        </div>

        {/* Selected Locus Detail */}
        {selected && (
          <div className="p-6 bg-white border border-indigo-200 rounded-2xl mb-8 animate-fade-in-up shadow-sm">
            <div className="flex items-start gap-4">
              {selected.imageUrl && (
                <div className="relative w-40 h-40 flex-shrink-0 rounded-xl overflow-hidden">
                  <img src={selected.imageUrl} alt={selected.keyword || ""} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                    <div className="text-xs font-bold text-white">{selected.keyword}</div>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="step-badge inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">{selected.locusIndex + 1}</span>
                  <h5 className="font-medium text-lg text-slate-900">{selected.locusName}</h5>
                </div>
                {selected.segmentText && (
                  <p className="text-slate-700 text-sm mb-2">
                    <span className="text-slate-500">구절:</span> {selected.segmentText}
                  </p>
                )}
                {selected.imageDescription && (
                  <p className="text-slate-500 text-sm mb-2">
                    <span className="text-slate-400">이미지:</span> {selected.imageDescription}
                  </p>
                )}
                {selected.senses && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {JSON.parse(selected.senses).map((sense: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-500">
                        {sense}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Narrative */}
        {palace.narrative && (
          <div className="mb-8">
            <h4 className="text-lg font-medium text-slate-900 mb-4">📖 워크스루 내러티브</h4>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl whitespace-pre-line text-slate-700 text-sm leading-relaxed">
              {palace.narrative}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
