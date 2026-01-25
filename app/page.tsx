import { Metadata } from "next";
import Script from "next/script";
import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { MangaGrid } from "@/components/home/MangaGrid";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { NovelContentSection } from "@/components/home/NovelContentSection";
import { fetchMangaList } from "@/lib/supabase-server";
import { homeMetadata, getHomeStructuredData } from "@/lib/seo-metadata";

// Use centralized SEO metadata for home page
export const metadata: Metadata = homeMetadata;

export default async function HomePage() {
  // Server-side data fetching
  const mangaList = await fetchMangaList();

  // Get structured data for home page
  const structuredData = getHomeStructuredData();

  return (
    <div className="min-h-screen bg-background">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Header />

      <main>
        {/* Hero section with featured stories */}
        <HeroCarousel mangaList={mangaList} />

        {/* Main content */}
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-8">Truyện Mới Cập Nhật</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Novel grid */}
            <MangaGrid mangaList={mangaList} />

            {/* Trending sidebar */}
            <TrendingSidebar mangaList={mangaList} />
          </div>
        </div>

        {/* Novel Content Section with SEO benefits */}
        <NovelContentSection />
      </main>

      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="font-bold mb-4">Về Truyện Nhà Mèo</h3>
              <p className="text-sm text-muted-foreground">
                Nền tảng đọc truyện ngôn tình, tiểu thuyết, truyện edit và dịch
                online hàng đầu Việt Nam. Với kho tàng truyện khổng lồ và cộng
                đồng bạn đọc sôi động, Truyện Nhà Mèo là điểm đến lý tưởng cho
                mọi tình yêu văn học.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold mb-4">Liên Kết</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    Trang Chủ
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Chính Sách Bảo Mật
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    Điều Khoản Sử Dụng
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold mb-4">Liên Hệ</h3>
              <p className="text-sm text-muted-foreground">
                Email: contact@truyennhameo.com
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Truyện Nhà Mèo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
