"use client";
import React from 'react';
import TagPage from '@/views/TagPage';

export default function TagPageWrapper({ params }: { params: { tagName: string } }) {
  return <TagPage tagName={params.tagName} />;
}
