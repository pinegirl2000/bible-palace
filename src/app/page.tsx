// ============================================
// Bible Palace — Home Page (Dashboard)
// ============================================

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-white">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Bible Palace
        </h1>
        <Link
          href="/login"
          className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          로그인
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-fade-in-up">
          <div className="text-6xl mb-4">🏛️</div>
          <h2 className="text-4xl font-semibold tracking-tight mb-4 text-slate-900">
            기억의 궁전으로
            <br />
            <span className="text-indigo-600">성경을 암송</span>하세요
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto mb-8">
            익숙한 공간에 말씀을 배치하고, AI가 만든 이미지와 이야기로
            장기 기억으로 전환합니다.
          </p>
          <Link
            href="/palace/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-medium transition-all duration-300 pulse-primary"
          >
            <span>🏛️</span>
            <span>새 궁전 만들기</span>
          </Link>
        </section>

        {/* Quick Navigation */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <Link
            href="/palace"
            className="card-hover p-6 bg-white border border-slate-200 rounded-2xl text-center hover:border-indigo-300 transition-colors"
          >
            <div className="text-3xl mb-2">🏛️</div>
            <div className="font-medium text-slate-900">내 궁전</div>
            <div className="text-slate-500 text-sm mt-1">암송 궁전 관리</div>
          </Link>

          <Link
            href="/review"
            className="card-hover p-6 bg-white border border-slate-200 rounded-2xl text-center hover:border-indigo-300 transition-colors"
          >
            <div className="text-3xl mb-2">📅</div>
            <div className="font-medium text-slate-900">오늘의 복습</div>
            <div className="text-slate-500 text-sm mt-1">간격 반복 복습</div>
          </Link>

          <Link
            href="/read"
            className="card-hover p-6 bg-white border border-slate-200 rounded-2xl text-center hover:border-indigo-300 transition-colors"
          >
            <div className="text-3xl mb-2">📖</div>
            <div className="font-medium text-slate-900">성경 읽기</div>
            <div className="text-slate-500 text-sm mt-1">66권 전체</div>
          </Link>

          <Link
            href="/search"
            className="card-hover p-6 bg-white border border-slate-200 rounded-2xl text-center hover:border-indigo-300 transition-colors"
          >
            <div className="text-3xl mb-2">🔍</div>
            <div className="font-medium text-slate-900">말씀 검색</div>
            <div className="text-slate-500 text-sm mt-1">구절 찾기</div>
          </Link>

          <Link
            href="/group"
            className="card-hover p-6 bg-white border border-slate-200 rounded-2xl text-center hover:border-indigo-300 transition-colors"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="font-medium text-slate-900">셀 그룹</div>
            <div className="text-slate-500 text-sm mt-1">함께 암송</div>
          </Link>

          <Link
            href="/profile"
            className="card-hover p-6 bg-white border border-slate-200 rounded-2xl text-center hover:border-indigo-300 transition-colors"
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-medium text-slate-900">프로필</div>
            <div className="text-slate-500 text-sm mt-1">배지 & 통계</div>
          </Link>
        </section>

        {/* How it works */}
        <section className="mb-12 bg-slate-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-center mb-8 text-slate-900">
            어떻게 작동하나요?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", emoji: "📖", title: "성구 선택", desc: "암송할 구절을 선택합니다" },
              { step: "2", emoji: "🏠", title: "공간 배치", desc: "아파트 20개 지점에 키워드를 배치합니다" },
              { step: "3", emoji: "🎨", title: "이미지 생성", desc: "AI가 각 지점에 생생한 이미지를 만듭니다" },
              { step: "4", emoji: "🔄", title: "간격 복습", desc: "1일→3일→7일 간격으로 궁전을 다시 걸어봅니다" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="step-badge mx-auto mb-3">{item.step}</div>
                <div className="text-2xl mb-2">{item.emoji}</div>
                <div className="font-medium text-slate-900 mb-1">{item.title}</div>
                <div className="text-slate-500 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-slate-400 text-sm pt-8 border-t border-slate-200">
          Bible Palace — 기억의 궁전 성경 암송 · Railway · Redis
        </footer>
      </main>
    </div>
  );
}
