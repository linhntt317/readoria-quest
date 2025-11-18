"use client";
import React from 'react';
import AddChapter from '@/pages/admin/AddChapter';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function AddChapterPage({ params }: { params: { mangaId: string } }) {
  return (
    <ProtectedRoute>
      <AddChapter mangaId={params.mangaId} />
    </ProtectedRoute>
  );
}
