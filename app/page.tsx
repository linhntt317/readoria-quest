import { Metadata } from "next";
import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { MangaGrid } from "@/components/home/MangaGrid";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { fetchMangaList } from "@/lib/supabase-server";

// Static metadata for SEO
export const metadata: Metadata = {
  title: "Đọc Tiểu Thuyết - Kho truyện online miễn phí",
  description:
    "Đọc truyện online miễn phí với hàng ngàn bộ truyện hay. Cập nhật liên tục các thể loại: Ngôn tình, Đam mỹ, Huyền huyễn, Tiên hiệp, Xuyên không...",
  keywords: [
    "đọc truyện",
    "truyện online",
    "tiểu thuyết",
    "ngôn tình",
    "đam mỹ",
    "huyền huyễn",
  ],
  openGraph: {
    title: "Đọc Tiểu Thuyết - Kho truyện online miễn phí",
    description:
      "Đọc truyện online miễn phí với hàng ngàn bộ truyện hay. Cập nhật liên tục các thể loại.",
    url: "https://doctieuthuyet.com",
    siteName: "Đọc Tiểu Thuyết",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Đọc Tiểu Thuyết - Kho truyện online miễn phí",
    description:
      "Đọc truyện online miễn phí với hàng ngàn bộ truyện hay.",
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
