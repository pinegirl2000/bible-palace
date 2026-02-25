// ============================================
// Bible Palace — Route Protection Middleware
// 인증이 필요한 경로 보호 (Edge Runtime 호환)
// ============================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // JWT 기반 세션 쿠키 확인 (Edge Runtime에서 Prisma 없이 동작)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/palace/:path*",
    "/review/:path*",
    "/group/:path*",
    "/profile/:path*",
    "/bookmarks/:path*",
    "/notes/:path*",
  ],
};
