import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require an authenticated session. Everything else (landing, blog,
// auth APIs) stays public.
const PROTECTED_PREFIXES = ["/assets", "/create", "/edit", "/invoices"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Optimistic check: presence of the Better Auth session cookie. This does not
  // validate the session (cheap, Edge-safe) — server procedures still enforce
  // real auth via betterAuthMiddleware.
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals, the auth API, and static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|official|social|blogs|.*\\..*).*)"],
};
