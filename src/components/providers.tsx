// ============================================
// Bible Palace — Client-side Providers
// SessionProvider + 기타 Context 래퍼
// ============================================

"use client";

import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
