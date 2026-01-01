import { Metadata } from 'next'
import React from 'react'
import ChapterReader from '@/pages/ChapterReader'

type Params = { slug: string; chapterId: string }

function extractId(slug: string): string | null {
  // Check if the entire slug is a UUID
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (uuidPattern.test(slug)) {
    return slug
  }

  // Try to extract UUID from the end of the slug (e.g., "ten-truyen-uuid")
  const uuidMatch = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  if (uuidMatch) {
    return uuidMatch[0]
  }

  // Fallback: try to find numeric ID at the end
  const numericMatch = slug.match(/(\d+)$/)
  return numericMatch ? numericMatch[1] : null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const siteOrigin = process.env.SITE_ORIGIN || 'https://truyennhameo.vercel.app'
  const pageUrl = `${siteOrigin}/truyen/${params.slug}/chuong/${params.chapterId}`
  return {
    title: `Chương ${params.chapterId} | Truyện Nhà Mèo`,
    alternates: { canonical: pageUrl },
    openGraph: { type: 'article', url: pageUrl, title: `Chương ${params.chapterId}` },
    twitter: { card: 'summary', title: `Chương ${params.chapterId}` },
  }
}

export default function ChapterPage({ params }: { params: Params }) {
  const id = extractId(params.slug)
  return <ChapterReader mangaId={id || undefined} chapterId={params.chapterId} />
}
