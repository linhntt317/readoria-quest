"use client";
import React, { useEffect } from 'react';
import AdminLogin from '@/views/admin/AdminLogin';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
  const { user, isAdmin, loading } = useAuth();
  
  // If already logged in as admin, redirect directly to dashboard
  useEffect(() => {
    if (!loading && user && isAdmin) {
      window.location.replace('/admin/dashboard');
    }
  }, [user, isAdmin, loading]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-muted-foreground">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // If already logged in as admin, show redirect message
  if (user && isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-muted-foreground">Đang chuyển hướng đến Dashboard...</p>
        </div>
      </div>
    );
  }

  return <AdminLogin />;
}
