import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hasAuthTokenCookie(request: NextRequest) {
  // Supabase auth cookies are typically named with a project-specific prefix and include "-auth-token".
  for (const [name] of request.cookies) {
    if (name.includes("-auth-token")) return true;
  }

  // Fallback cookie names
  if (request.cookies.get("sb-access-token")) return true;
  if (request.cookies.get("sb-refresh-token")) return true;

  return false;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin/* except /admin/login
  const isAdminPath = path.startsWith("/admin") && !path.startsWith("/admin/login");

  if (!isAdminPath) return NextResponse.next();

  // Keep middleware Edge-safe: only check presence of auth cookies here.
  // Admin role verification is handled in the client (ProtectedRoute) + backend.
  if (!hasAuthTokenCookie(request)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
