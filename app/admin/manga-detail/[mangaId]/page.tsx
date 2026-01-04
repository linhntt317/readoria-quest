"use client";
import React from 'react';
import AdminMangaDetail from '@/views/admin/MangaDetail';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function AdminMangaDetailPage({ params }: { params: { mangaId: string } }) {
  return (
    <ProtectedRoute>
      <AdminMangaDetail mangaId={params.mangaId} />
    </ProtectedRoute>
  );
}
