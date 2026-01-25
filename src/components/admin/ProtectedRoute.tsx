"use client";
import { useAppRouter } from "@/lib/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();
  const router = useAppRouter();
  const redirectedRef = useRef(false);

  useEffect(() => {
    // Wait for auth check to complete
    if (loading) {
      return;
    }

    // Only redirect once
    if (redirectedRef.current) {
      return;
    }

    // If not authenticated, redirect to home
    if (!user) {
      redirectedRef.current = true;
      console.warn("ProtectedRoute - no user, redirecting to home");
      router.replace("/");
      return;
    }

    // If not admin, redirect to home
    if (!isAdmin) {
      redirectedRef.current = true;
      console.warn(
        "ProtectedRoute - user is not admin (isAdmin:",
        isAdmin,
        "), redirecting to home",
      );
      router.replace("/");
      return;
    }

    // User is authenticated and is admin - allow access
    redirectedRef.current = true;
  }, [loading, user, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};
