import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Check if path starts with /admin (except /admin/login)
  const isAdminPath =
    path.startsWith("/admin") && !path.startsWith("/admin/login");

  if (isAdminPath) {
    // Check for auth token in cookies
    const token = request.cookies.get("sb-access-token");

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
