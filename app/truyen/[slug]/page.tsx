import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import React from 'react'
import MangaDetail from '@/pages/MangaDetail'

type Params = { slug: string }

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

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
  const siteOrigin = process.env.SITE_ORIGIN || 'https://truyennhameo.vercel.app'

  let title = 'Truyện Nhà Mèo'
  let description = 'Đọc truyện online miễn phí tại Truyện Nhà Mèo'
  let image = '/og-image.jpg'

  const id = extractId(params.slug)

  if (url && key && id) {
    try {
      const supabase = createClient(url, key)
      const { data } = await supabase
        .from('manga')
        .select('id,title,description,image_url,updated_at')
        .eq('id', id)
        .single()

      if (data) {
        title = `${data.title} | Truyện Nhà Mèo`
        description = (data.description || '').slice(0, 160) || description
        image = data.image_url || image
      }
    } catch {}
  }

  const pageUrl = `${siteOrigin}/truyen/${params.slug}`

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'article',
      url: pageUrl,
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default function MangaPage({ params }: { params: Params }) {
  const id = extractId(params.slug)
  return <MangaDetail mangaId={id || undefined} />
}
