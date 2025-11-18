// app/lib/structured-data.ts

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Truyện Nhà Mèo',
    alternateName: 'Readoria Quest',
    url: 'https://truyennhameo.vercel.app',
    description: 'Đọc truyện tranh online miễn phí - Kho truyện manga, manhwa, manhua phong phú',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://truyennhameo.vercel.app/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Truyện Nhà Mèo',
      logo: {
        '@type': 'ImageObject',
        url: 'https://truyennhameo.vercel.app/logo.png'
      }
    }
  }
}

export function getMangaSchema(manga: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: manga.title,
    description: manga.description,
    image: manga.cover_image,
    author: {
      '@type': 'Person',
      name: manga.author || 'Unknown'
    },
    genre: manga.tags?.join(', '),
    inLanguage: 'vi-VN',
    datePublished: manga.created_at,
    dateModified: manga.updated_at,
    aggregateRating: manga.rating ? {
      '@type': 'AggregateRating',
      ratingValue: manga.rating,
      ratingCount: manga.rating_count,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Truyện Nhà Mèo'
    }
  }
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

export function getArticleSchema(chapter: any, manga: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${manga.title} - ${chapter.title}`,
    description: `Đọc ${manga.title} ${chapter.title} online miễn phí`,
    image: chapter.images?.[0] || manga.cover_image,
    datePublished: chapter.created_at,
    dateModified: chapter.updated_at,
    author: {
      '@type': 'Person',
      name: manga.author || 'Unknown'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Truyện Nhà Mèo',
      logo: {
        '@type': 'ImageObject',
        url: 'https://truyennhameo.vercel.app/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://truyennhameo.vercel.app/truyen/${manga.id}/chuong/${chapter.id}`
    }
  }
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Truyện Nhà Mèo',
    alternateName: 'Readoria Quest',
    url: 'https://truyennhameo.vercel.app',
    logo: 'https://truyennhameo.vercel.app/logo.png',
    description: 'Website đọc truyện tranh online miễn phí hàng đầu Việt Nam',
    sameAs: [
      // Add social media links
      'https://facebook.com/truyennhameo',
      'https://twitter.com/truyennhameo',
    ]
  }
}
