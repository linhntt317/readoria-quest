import { Metadata } from 'next'
import React from 'react'
import ChapterReader from '@/pages/ChapterReader'

type Params = { slug: string; chapterId: string }

function extractId(slug: string): string | null {
  const match = slug.match(/(\d+)$/)
  return match ? match[1] : null
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
