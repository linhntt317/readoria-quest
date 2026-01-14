"use client";
import React, { use } from "react";
import TagPage from "@/views/TagPage";

export default function TagPageWrapper({
  params,
}: {
  params: Promise<{ tagName: string }>;
}) {
  const { tagName } = use(params);
  return <TagPage tagName={tagName} />;
}
