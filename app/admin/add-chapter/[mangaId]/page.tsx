"use client";
import React, { use } from "react";
import AddChapter from "@/views/admin/AddChapter";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function AddChapterPage({
  params,
}: {
  params: Promise<{ mangaId: string }>;
}) {
  const { mangaId } = use(params);
  return (
    <ProtectedRoute>
      <AddChapter mangaId={mangaId} />
    </ProtectedRoute>
  );
}
