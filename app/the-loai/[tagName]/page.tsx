"use client";
import React, { use } from "react";
import { Metadata } from "next";
import TagPage from "@/views/TagPage";

// Dynamic metadata for category pages
// Note: This is a client component, so we can't use generateMetadata
// SEO is handled by the Seo component inside TagPage
export default function TagPageWrapper({
  params,
}: {
  params: Promise<{ tagName: string }>;
}) {
  const { tagName } = use(params);
  return <TagPage tagName={tagName} />;
}
