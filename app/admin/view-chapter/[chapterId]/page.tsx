"use client";
import React from 'react';
import ViewChapter from '@/views/admin/ViewChapter';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function ViewChapterPage({ params }: { params: { chapterId: string } }) {
  return (
    <ProtectedRoute>
      <ViewChapter chapterId={params.chapterId} />
    </ProtectedRoute>
  );
}
