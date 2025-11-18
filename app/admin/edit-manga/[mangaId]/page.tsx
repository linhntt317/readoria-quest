"use client";
import React from 'react';
import EditManga from '@/pages/admin/EditManga';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function EditMangaPage({ params }: { params: { mangaId: string } }) {
  return (
    <ProtectedRoute>
      <EditManga mangaId={params.mangaId} />
    </ProtectedRoute>
  );
}
