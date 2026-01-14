"use client";
import React, { use } from "react";
import AdminMangaDetail from "@/views/admin/MangaDetail";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function AdminMangaDetailPage({
  params,
}: {
  params: Promise<{ mangaId: string }>;
}) {
  const { mangaId } = use(params);
  return (
    <ProtectedRoute>
      <AdminMangaDetail mangaId={mangaId} />
    </ProtectedRoute>
  );
}
