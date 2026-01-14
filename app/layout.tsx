import React from "react";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "../src/index.css";

export const metadata = {
  metadataBase: new URL("https://truyennhameo.vercel.app"),
  title: {
    default:
      "Truyện Nhà Mèo - Đọc Truyện Tranh Online Miễn Phí | Manga, Manhwa, Manhua",
    template: "%s | Truyện Nhà Mèo",
  },
  description:
    "Đọc truyện tranh online miễn phí tại Truyện Nhà Mèo. Kho truyện manga, manhwa, manhua đa dạng với hàng ngàn bộ truyện. Nhiều thể loại: hành động, romance, kinh dị, hài hước, thần thoại. Cập nhật chapter mới mỗi ngày.",
  keywords: [
    "đọc truyện online",
    "truyện tranh online",
    "manga",
    "manhwa",
    "manhua",
    "đọc truyện miễn phí",
    "truyện tranh miễn phí",
    "manga tiếng việt",
    "manhwa tiếng việt",
    "đọc manga online",
    "truyện nhà mèo",
    "đọc truyện tiếng việt",
    "truyện tranh hay",
    "manga hay",
    "chapter truyện",
  ],
  authors: [{ name: "Truyện Nhà Mèo" }],
  creator: "Truyện Nhà Mèo",
  publisher: "Truyện Nhà Mèo",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://truyennhameo.vercel.app",
    siteName: "Truyện Nhà Mèo",
    title: "Truyện Nhà Mèo - Đọc Truyện Tranh Online Miễn Phí",
    description:
      "Đọc truyện tranh online miễn phí. Kho truyện manga, manhwa, manhua đa dạng, cập nhật mỗi ngày.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Truyện Nhà Mèo - Đọc Truyện Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Truyện Nhà Mèo - Đọc Truyện Tranh Online Miễn Phí",
    description:
      "Đọc truyện tranh online miễn phí. Kho truyện manga, manhwa, manhua đa dạng.",
    images: ["/twitter-image.jpg"],
    creator: "@truyennhameo",
  },
  alternates: {
    canonical: "https://truyennhameo.vercel.app",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  category: "entertainment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link
          rel="alternate"
          hrefLang="vi"
          href="https://truyennhameo.vercel.app"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Truyện Nhà Mèo",
              url: "https://truyennhameo.vercel.app",
              description: "Đọc truyện tranh online miễn phí",
              inLanguage: "vi",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://truyennhameo.vercel.app/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Truyện Nhà Mèo",
              url: "https://truyennhameo.vercel.app",
              logo: "https://truyennhameo.vercel.app/logo.png",
              sameAs: [],
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
