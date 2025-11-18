"use client";
import React from 'react';
import TagPage from '@/pages/TagPage';

export default function TagPageWrapper({ params }: { params: { tagName: string } }) {
  return <TagPage tagName={params.tagName} />;
}
