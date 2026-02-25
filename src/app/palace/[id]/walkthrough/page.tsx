// ============================================
// Bible Palace — Guided Walkthrough
// 궁전 워크스루: 한 지점씩 가이드
// ============================================

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface LocusData {
  locusIndex: number;
  locusName: string;
  segmentText: string | null;
  keyword: string | null;
  imageDescription: string | null;
  imageUrl: string | null;
  senses: string | null;
}

export default function WalkthroughPage() {
  const params = useParams();
  const [loci, setLoci] = useState<LocusData[]>([]);
  const [palaceName, setPalaceName] = useState("");
  const [verseRef, setVerseRef] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/palace/${params.id}`)
      .then((r) => r.json())
      .then((res) => {
        const data = res.data;
        setPalaceName(data.name);
        setVerseRef(data.verseRef);
        setLoci(data.loci.filter((l: LocusData) => l.keyword));
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

  if (loci.length === 0) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏗️</div>
          <p className="text-slate-500">아직 배치된 지점이 없습니다</p>
          <Link href={`/palace/${params.id}`} className="text-indigo-600 hover:underline mt-2 inline-block">
            궁전으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const current = loci[currentIndex];
  const progress = ((currentIndex + 1) / loci.length) * 100;
  const senses = current.senses ? JSON.parse(current.senses) : [];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href={`/palace/${params.id}`} className="text-slate-500 hover:text-slate-900 transition-colors">
            ← {palaceName}
          </Link>
          <span className="text-sm text-slate-500">
            {currentIndex + 1} / {loci.length}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1">
        <div
          className="bg-indigo-600 h-1 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="animate-fade-in-up w-full">
          {/* Locus Number & Name */}
          <div className="text-center mb-6">
            <span className="step-badge inline-flex items-center justify-center text-lg w-12 h-12 mx-auto mb-3 rounded-full bg-indigo-100 text-indigo-600 font-medium">
              {current.locusIndex + 1}
            </span>
            <h3 className="text-2xl font-light text-slate-900">{current.locusName}</h3>
            <p className="text-slate-500 text-sm">{verseRef}</p>
          </div>

          {/* Image */}
          {current.imageUrl && (
            <div className="relative aspect-video max-w-md mx-auto mb-6 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={current.imageUrl}
                alt={current.keyword || current.locusName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                <div className="font-bold text-white text-lg mb-1">{current.keyword}</div>
                <div className="text-sm text-white/80">{current.segmentText}</div>
              </div>
            </div>
          )}

          {/* Keyword & Segment (if no image) */}
          {!current.imageUrl && current.keyword && (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl mb-6 text-center">
              <div className="text-3xl mb-3 text-indigo-600">{current.keyword}</div>
              {current.segmentText && (
                <p className="text-slate-700">{current.segmentText}</p>
              )}
            </div>
          )}

          {/* Image Description */}
          {current.imageDescription && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-center">
              <p className="text-slate-500 text-sm italic">{current.imageDescription}</p>
            </div>
          )}

          {/* Senses */}
          {senses.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {senses.map((sense: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-500">
                  {sense}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <footer className="border-t border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 disabled:opacity-30 rounded-lg text-slate-700 transition-all"
          >
            ← 이전
          </button>

          {currentIndex === loci.length - 1 ? (
            <Link
              href={`/palace/${params.id}/review`}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              ✍️ 암송 테스트 →
            </Link>
          ) : (
            <button
              onClick={() => setCurrentIndex(Math.min(loci.length - 1, currentIndex + 1))}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              다음 →
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
