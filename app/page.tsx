import { Metadata } from "next";
import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { MangaGrid } from "@/components/home/MangaGrid";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { fetchMangaList } from "@/lib/supabase-server";

// Static metadata for SEO
export const metadata: Metadata = {
  title:
    "Truyện Nhà Mèo - Đọc Truyện Tranh Online Miễn Phí | Manga, Manhwa, Manhua",
  description:
    "Đọc truyện tranh online miễn phí tại Truyện Nhà Mèo. Kho truyện manga, manhwa, manhua đa dạng với hàng ngàn bộ truyện. Cập nhật chapter mới mỗi ngày. Hành động, romance, kinh dị, hài hước và nhiều thể loại khác.",
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
    "truyện tranh hay",
    "manga hay",
  ],
  openGraph: {
    title: "Truyện Nhà Mèo - Đọc Truyện Tranh Online Miễn Phí",
    description:
      "Đọc truyện tranh online miễn phí tại Truyện Nhà Mèo. Kho truyện manga, manhwa, manhua đa dạng với hàng ngàn bộ truyện. Cập nhật chapter mới mỗi ngày.",
    url: "https://truyennhameo.vercel.app",
    siteName: "Truyện Nhà Mèo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Truyện Nhà Mèo - Đọc Truyện Tranh Online Miễn Phí",
    description:
      "Đọc truyện tranh online miễn phí tại Truyện Nhà Mèo. Manga, manhwa, manhua hay nhất.",
  },
  alternates: {
    canonical: "https://truyennhameo.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

// Server Component - fetches data at build/request time
export default async function HomePage() {
  // Server-side data fetching
  const mangaList = await fetchMangaList();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero section with featured manga */}
        <HeroCarousel mangaList={mangaList} />

        {/* Main content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Manga grid */}
            <MangaGrid mangaList={mangaList} />

            {/* Trending sidebar */}
            <TrendingSidebar mangaList={mangaList} />
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Đọc Tiểu Thuyết. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
