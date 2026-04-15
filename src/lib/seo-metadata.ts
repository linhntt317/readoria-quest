const SITE_NAME = "Truyện Nhà Mèo";
const SITE_URL = "https://truyennhameo.vercel.com";
const SITE_DESCRIPTION =
  "Nền tảng đọc truyện ngôn tình, tiểu thuyết, truyện edit và truyện dịch online miễn phí";

const COMMON_KEYWORDS = [
  "đọc truyện online",
  "truyện ngôn tình",
  "tiểu thuyết",
  "truyện edit",
  "truyện dịch",
  "đọc truyện miễn phí",
  "web novel",
  "truyện web",
  "truyện yêu",
  "truyện lãng mạn",
  "truyện xuyên không",
  "đam mỹ",
  "truyện nhà mèo",
];

export function getHomeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/tim-kiem?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 200,
        height: 200,
      },
    },
  };
}

export function getMangaStructuredData(manga: {
  title: string;
  description: string;
  image_url?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: manga.title,
    description: manga.description,
    image: manga.image_url || `${SITE_URL}/og-image.png`,
    url: `${SITE_URL}/truyen/${manga.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    author: {
      "@type": "Person",
      name: "Tác giả",
    },
  };
}

export function getChapterStructuredData(
  chapter: {
    title: string;
    chapter_number: number;
  },
  manga: {
    title: string;
    slug: string;
  },
  chapterId: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${manga.title} - ${chapter.title || `Chương ${chapter.chapter_number}`}`,
    description: `Đọc chương này online miễn phí`,
    url: `${SITE_URL}/truyen/${manga.slug}/chuong/${chapterId}`,
    isPartOf: {
      "@type": "CreativeWork",
      name: manga.title,
      url: `${SITE_URL}/truyen/${manga.slug}`,
    },
  };
}

// Re-export types needed by Next.js pages (kept for compatibility but unused in Vite SPA)
export { SITE_NAME, SITE_URL, SITE_DESCRIPTION, COMMON_KEYWORDS };