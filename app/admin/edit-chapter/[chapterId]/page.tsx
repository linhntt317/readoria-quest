"use client";
import React from 'react';
import EditChapter from '@/views/admin/EditChapter';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function EditChapterPage({ params }: { params: { chapterId: string } }) {
  return (
    <ProtectedRoute>
      <EditChapter chapterId={params.chapterId} />
    </ProtectedRoute>
  );
}
