// ============================================
// Bible Palace — Self-Test Review Page
// 암송 자기 테스트 인터페이스
// ============================================

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface PalaceForReview {
  id: string;
  name: string;
  verseRef: string;
  verseText: string;
  loci: Array<{
    locusIndex: number;
    locusName: string;
    keyword: string | null;
    imageDescription: string | null;
  }>;
}

export default function PalaceReviewPage() {
  const params = useParams();
  const [palace, setPalace] = useState<PalaceForReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [userText, setUserText] = useState("");
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    quality: number;
    feedback: string;
    nextReviewAt: string;
    recommendation: string;
  } | null>(null);

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

  const handleSubmit = async () => {
    if (!palace || !userText.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/review/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          palaceId: palace.id,
          userText: userText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.data);
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const revealNextHint = () => {
    if (!palace) return;
    const maxHints = palace.loci.filter((l) => l.keyword).length;
    if (revealedHints < maxHints) {
      setRevealedHints((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="text-slate-500">불러오는 중...</div>
      </div>
    );
  }

  if (!palace) return null;

  const hintsAvailable = palace.loci.filter((l) => l.keyword);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/palace/${palace.id}`} className="text-slate-500 hover:text-slate-900 transition-colors">
            ← {palace.name}
          </Link>
          <span className="text-indigo-600 font-medium">✍️ 암송 테스트</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {!result ? (
          <>
            {/* Verse Reference */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-light text-indigo-600">{palace.verseRef}</h3>
              <p className="text-slate-500 text-sm mt-2">
                기억의 궁전을 떠올리며 아래에 구절을 입력하세요
              </p>
            </div>

            {/* Hint Area */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">
                  힌트 ({revealedHints}/{hintsAvailable.length})
                </span>
                <button
                  onClick={revealNextHint}
                  disabled={revealedHints >= hintsAvailable.length}
                  className="text-sm text-indigo-600 hover:text-indigo-700 disabled:text-slate-300 transition-colors"
                >
                  힌트 보기 →
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {hintsAvailable.map((locus, i) => (
                  <div
                    key={locus.locusIndex}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      i < revealedHints
                        ? "bg-indigo-50 border border-indigo-200 text-indigo-700"
                        : "bg-slate-50 border border-slate-200 text-slate-400"
                    }`}
                  >
                    <span className="mr-1.5">{locus.locusIndex + 1}.</span>
                    {i < revealedHints ? (
                      <span>{locus.keyword}</span>
                    ) : (
                      <span>???</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="mb-6">
              <textarea
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="궁전을 걸으며 떠오르는 구절을 입력하세요..."
                rows={8}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none text-lg leading-relaxed"
                autoFocus
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>{userText.length}자</span>
                <span>원문: {palace.verseText.length}자</span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!userText.trim() || submitting}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-200 disabled:text-slate-400 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                {submitting ? (
                  <>⏳ 채점 중...</>
                ) : (
                  <>✅ 제출하기</>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Result Display */
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {result.score >= 90 ? "🎉" : result.score >= 70 ? "👏" : result.score >= 50 ? "💪" : "🌱"}
              </div>
              <div className="text-5xl font-bold text-indigo-600 mb-2">
                {result.score}%
              </div>
              <div className="text-slate-500">{palace.verseRef}</div>
            </div>

            {/* Score Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${result.score}%` }}
              />
            </div>

            {/* Feedback */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
              <p className="text-slate-700 leading-relaxed">{result.feedback}</p>
              {result.recommendation && (
                <p className="text-indigo-600 text-sm mt-3">{result.recommendation}</p>
              )}
            </div>

            {/* Next Review */}
            {result.nextReviewAt && (
              <div className="text-center text-sm text-slate-500 mb-8">
                📅 다음 복습: {new Date(result.nextReviewAt).toLocaleDateString("ko-KR")}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  setResult(null);
                  setUserText("");
                  setRevealedHints(0);
                }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              >
                🔄 다시 시도
              </button>
              <Link
                href={`/palace/${palace.id}`}
                className="text-slate-500 hover:text-slate-900 text-sm transition-colors"
              >
                궁전으로 돌아가기
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
