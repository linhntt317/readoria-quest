"use client";
import React, { use } from "react";
import ViewChapter from "@/views/admin/ViewChapter";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function ViewChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = use(params);
  return (
    <ProtectedRoute>
      <ViewChapter chapterId={chapterId} />
    </ProtectedRoute>
  );
}
