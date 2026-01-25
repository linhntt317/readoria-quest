import { Metadata } from "next";

const SITE_NAME = "Truyện Nhà Mèo";
const SITE_URL = "https://truyennhameo.vercel.app";
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
  "lighten",
  "truyện nhà mèo",
];

// ==================== HOME PAGE ====================
export const homeMetadata: Metadata = {
  title: `${SITE_NAME} - Đọc Truyện Ngôn Tình, Tiểu Thuyết, Truyện Edit Online Miễn Phí`,
  description: `${SITE_DESCRIPTION}. Hàng ngàn bộ truyện ngôn tình hay, tiểu thuyết lãng mạn, truyện edit sáng tạo. Cập nhật hàng ngày.`,
  keywords: COMMON_KEYWORDS,
  openGraph: {
    title: `${SITE_NAME} - Đọc Truyện Ngôn Tình, Tiểu Thuyết Miễn Phí`,
    description: `${SITE_DESCRIPTION}. Khám phá hàng ngàn bộ truyện đa dạng.`,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Đọc Truyện Online Miễn Phí`,
    description: SITE_DESCRIPTION,
    creator: "@truyennhameo",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

// ==================== MANGA DETAIL PAGE ====================
export function getMangaMetadata(
  manga: {
    title: string;
    description: string;
    slug: string;
    image_url?: string;
    tags?: string[];
  },
  canonicalUrl: string,
): Metadata {
  const mangaKeywords = [
    ...COMMON_KEYWORDS,
    manga.title,
    ...(manga.tags || []),
  ];

  return {
    title: `${manga.title} - Đọc Online Miễn Phí | ${SITE_NAME}`,
    description: `Đọc truyện "${manga.title}" online miễn phí trên ${SITE_NAME}. ${manga.description?.substring(0, 120)}...`,
    keywords: mangaKeywords,
    openGraph: {
      title: `${manga.title} | ${SITE_NAME}`,
      description: manga.description || SITE_DESCRIPTION,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      images: [
        {
          url: manga.image_url || `${SITE_URL}/og-image.png`,
          width: 600,
          height: 800,
          alt: manga.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${manga.title}`,
      description: manga.description?.substring(0, 160) || SITE_DESCRIPTION,
      creator: "@truyennhameo",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

// ==================== CHAPTER PAGE ====================
export function getChapterMetadata(
  chapter: {
    title: string;
    chapter_number: number;
  },
  manga: {
    title: string;
    slug: string;
  },
  canonicalUrl: string,
  chapterId: string,
): Metadata {
  const chapterKeywords = [
    ...COMMON_KEYWORDS,
    manga.title,
    `${manga.title} chương ${chapter.chapter_number}`,
    chapter.title,
  ];

  const pageTitle = `${manga.title} - ${chapter.title || `Chương ${chapter.chapter_number}`}`;
  const pageDescription = `Đọc ${pageTitle} online miễn phí. Cập nhật chương mới hàng ngày trên ${SITE_NAME}.`;

  return {
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    keywords: chapterKeywords,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description: pageDescription,
      creator: "@truyennhameo",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ==================== CATEGORY PAGE ====================
export function getCategoryMetadata(
  categoryName: string,
  count: number = 0,
): Metadata {
  const categoryKeywords = [
    ...COMMON_KEYWORDS,
    `truyện ${categoryName.toLowerCase()}`,
    `đọc ${categoryName.toLowerCase()}`,
  ];

  return {
    title: `Truyện ${categoryName} - Đọc Online Miễn Phí | ${SITE_NAME}`,
    description: `Khám phá ${count > 0 ? count : ""} bộ truyện ${categoryName.toLowerCase()} đa dạng trên ${SITE_NAME}. Các tác phẩm hay, mới, được đọc nhiều nhất.`,
    keywords: categoryKeywords,
    openGraph: {
      title: `Truyện ${categoryName} | ${SITE_NAME}`,
      description: `Đọc truyện ${categoryName.toLowerCase()} online miễn phí`,
      url: `${SITE_URL}/the-loai/${categoryName.toLowerCase()}`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `Truyện ${categoryName} - ${SITE_NAME}`,
      description: `Khám phá truyện ${categoryName.toLowerCase()} hay nhất`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ==================== LOGIN PAGE ====================
export const loginMetadata: Metadata = {
  title: `Đăng Nhập | ${SITE_NAME}`,
  description:
    "Đăng nhập để theo dõi truyện yêu thích, bình luận và lưu bookmark",
  robots: {
    index: false,
    follow: true,
  },
};

// ==================== STRUCTURED DATA ====================
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
        urlTemplate: `${SITE_URL}?search={search_term_string}`,
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
