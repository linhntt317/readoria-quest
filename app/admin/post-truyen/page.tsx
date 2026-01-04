"use client";
import React from 'react';
import PostTruyen from '@/views/admin/PostTruyen';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function PostTruyenPage() {
  return (
    <ProtectedRoute>
      <PostTruyen />
    </ProtectedRoute>
  );
}
