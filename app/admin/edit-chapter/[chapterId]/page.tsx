"use client";
import React, { use } from "react";
import EditChapter from "@/views/admin/EditChapter";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function EditChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = use(params);
  return (
    <ProtectedRoute>
      <EditChapter chapterId={chapterId} />
    </ProtectedRoute>
  );
}
