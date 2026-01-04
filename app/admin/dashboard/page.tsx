"use client";
import React from 'react';
import AdminDashboard from '@/views/admin/AdminDashboard';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
