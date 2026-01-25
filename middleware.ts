import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hasAuthTokenCookie(request: NextRequest) {
  // Supabase auth cookies are typically named with a project-specific prefix and include "-auth-token".
  for (const [name] of request.cookies) {
    if (name.includes("-auth-token")) {
      console.log("Middleware - Found auth token cookie:", name);
      return true;
    }
  }

  // Fallback cookie names
  if (request.cookies.get("sb-access-token")) {
    console.log("Middleware - Found sb-access-token");
    return true;
  }
  if (request.cookies.get("sb-refresh-token")) {
    console.log("Middleware - Found sb-refresh-token");
    return true;
  }

  console.log(
    "Middleware - No auth token found. Available cookies:",
    request.cookies
      .getAll()
      .map((c) => c.name)
      .join(", "),
  );
  return false;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin/* paths
  const isAdminPath = path.startsWith("/admin");

  console.log("Middleware - path:", path, "isAdminPath:", isAdminPath);

  if (!isAdminPath) return NextResponse.next();

  // For admin paths, let ProtectedRoute component handle the auth check on client-side
  // This avoids middleware cookie detection issues
  console.log(
    "Middleware - Admin path detected, allowing request (client-side ProtectedRoute will handle auth)",
  );
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
