import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for middleware
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
  return createClient(supabaseUrl, supabaseKey);
};

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Check if path starts with /admin (except /admin/login)
  const isAdminPath =
    path.startsWith("/admin") && !path.startsWith("/admin/login");

  if (isAdminPath) {
    // Get access token from cookies - Supabase stores it with project ref prefix
    const cookies = request.cookies;
    let accessToken: string | undefined;
    let refreshToken: string | undefined;

    // Find Supabase auth cookies (they have dynamic names based on project)
    for (const [name, cookie] of cookies) {
      if (name.includes("-auth-token")) {
        try {
          // Supabase stores auth data as JSON array in the cookie
          const tokenData = JSON.parse(cookie.value);
          if (Array.isArray(tokenData) && tokenData.length >= 2) {
            accessToken = tokenData[0];
            refreshToken = tokenData[1];
          }
        } catch {
          // Try as direct token value
          accessToken = cookie.value;
        }
        break;
      }
    }

    // Also check for sb-access-token as fallback
    if (!accessToken) {
      const sbToken = cookies.get("sb-access-token");
      if (sbToken) {
        accessToken = sbToken.value;
      }
    }

    if (!accessToken) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      // Verify the token and get user
      const supabase = getSupabaseClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

      if (userError || !user) {
        console.log("Middleware: Invalid token or no user");
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      // Check if user has admin role using RPC
      const { data: hasAdminRole, error: roleError } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (roleError || !hasAdminRole) {
        console.log("Middleware: User is not admin", roleError);
        // Redirect non-admin users to home page
        return NextResponse.redirect(new URL("/", request.url));
      }

      // User is authenticated and is admin, allow access
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware auth error:", error);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
