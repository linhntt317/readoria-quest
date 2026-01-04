"use client";
import React from 'react';
import ManageTags from '@/views/admin/ManageTags';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function ManageTagsPage() {
  return (
    <ProtectedRoute>
      <ManageTags />
    </ProtectedRoute>
  );
}
