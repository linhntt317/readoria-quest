import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ljmoqseafxhncpwzuwex.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbW9xc2VhZnhobmNwd3p1d2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTIzODksImV4cCI6MjA3NzA2ODM4OX0.y0s_VRhxIrq23q5nBkjm6v3rlenqf6OeQGGdah981n4";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tagName: string }>;
}): Promise<Metadata> {
  const { tagName } = await params;
  const decodedTagName = decodeURIComponent(tagName);
  const displayName = decodedTagName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const SITE_ORIGIN = "https://truyennhameo.vercel.app";
  const pageUrl = `${SITE_ORIGIN}/the-loai/${tagName}`;

  return {
    title: `${displayName} - Đọc Truyện Online | Truyện Nhà Mèo`,
    description: `Đọc truyện tranh ${displayName} online miễn phí tại Truyện Nhà Mèo. Kho truyện ${displayName} đa dạng, cập nhật chapter mới liên tục.`,
    keywords: [
      `truyện ${displayName}`,
      `${displayName} online`,
      `đọc ${displayName}`,
      "truyện tranh online",
      "manga",
      "manhwa",
    ],
    openGraph: {
      title: `${displayName} - Đọc Truyện Online | Truyện Nhà Mèo`,
      description: `Đọc truyện tranh ${displayName} online miễn phí`,
      url: pageUrl,
      type: "website",
      siteName: "Truyện Nhà Mèo",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} - Truyện Nhà Mèo`,
      description: `Đọc truyện ${displayName} online miễn phí`,
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TheLoaiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
