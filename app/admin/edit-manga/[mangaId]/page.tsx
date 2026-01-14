"use client";
import React, { use } from "react";
import EditManga from "@/views/admin/EditManga";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function EditMangaPage({
  params,
}: {
  params: Promise<{ mangaId: string }>;
}) {
  const { mangaId } = use(params);
  return (
    <ProtectedRoute>
      <EditManga mangaId={mangaId} />
    </ProtectedRoute>
  );
}
