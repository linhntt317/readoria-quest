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

    // If not authenticated or not admin, redirect to login
    if (!user || !isAdmin) {
      redirectedRef.current = true;
      router.replace("/admin/login");
      return;
    }

    // Mark as checked only if auth passed
    redirectedRef.current = true;
  }, [loading]); // ✅ Only depend on loading!

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
