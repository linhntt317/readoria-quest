const SITE_URL = 'https://truyennhameo.vercel.com';
const SITE_NAME = 'Truyện Nhà Mèo';

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Readoria Quest',
    url: SITE_URL,
    description: 'Đọc truyện tranh online miễn phí - Kho truyện manga, manhwa, manhua phong phú',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/tim-kiem?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`
      }
    }
  }
}

export function getMangaSchema(manga: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: manga.title,
    description: (manga.description || '').replace(/<[^>]*>/g, '').slice(0, 300),
    image: manga.image_url,
    author: {
      '@type': 'Person',
      name: manga.author || 'Unknown'
    },
    genre: manga.tags?.map((t: any) => t.name).join(', '),
    inLanguage: 'vi-VN',
    datePublished: manga.created_at,
    dateModified: manga.updated_at,
    aggregateRating: manga.rating ? {
      '@type': 'AggregateRating',
      ratingValue: manga.rating,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME
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
    headline: `${manga.title} - Chương ${chapter.chapter_number}: ${chapter.title}`,
    description: `Đọc ${manga.title} Chương ${chapter.chapter_number} online miễn phí`,
    image: manga.image_url,
    datePublished: chapter.created_at,
    author: {
      '@type': 'Person',
      name: manga.author || 'Unknown'
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/truyen/${manga.id}/chuong/${chapter.id}`
    }
  }
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: 'Readoria Quest',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Website đọc truyện tranh online miễn phí hàng đầu Việt Nam',
    sameAs: [
      'https://facebook.com/truyennhameo',
      'https://twitter.com/truyennhameo',
    ]
  }
}