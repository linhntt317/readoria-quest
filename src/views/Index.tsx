"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TrendingSection } from "@/components/TrendingSection";
import { MangaCard } from "@/components/MangaCard";
import Seo from "@/components/Seo";
import { useManga } from "@/hooks/useManga";
import { useTranslation } from "@/hooks/useTranslation";
import { getWebsiteSchema } from "@/lib/structured-data";

const ITEMS_PER_PAGE = 12;

const Index = () => {
  const { data: manga, isLoading } = useManga();
  const { t } = useTranslation();
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  const structuredData = getWebsiteSchema();

  // OPTIMIZED: Only display the items user has scrolled to
  const displayedManga = manga?.slice(0, displayCount) || [];
  const hasMore = (manga?.length || 0) > displayCount;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Truyện Nhà Mèo - Kho truyện online miễn phí"
        description="Đọc truyện online miễn phí với hàng ngàn bộ truyện hay. Cập nhật liên tục các thể loại: Ngôn tình, Đam mỹ, Huyền huyễn, Tiên hiệp, Xuyên không..."
        url="https://truyennhameo.vercel.com"
        keywords={[
          "đọc truyện",
          "truyện online",
          "tiểu thuyết",
          "ngôn tình",
          "đam mỹ",
          "huyền huyễn",
        ]}
        jsonLd={structuredData}
      />

      <Header />

      <main>
        <HeroSection />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content - Manga list */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                {t.sections.latest}
              </h2>

              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted aspect-[3/4] rounded-lg" />
                      <div className="h-4 bg-muted rounded mt-2" />
                      <div className="h-3 bg-muted rounded mt-1 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayedManga.map((item) => (
                      <MangaCard
                        key={item.id}
                        id={item.id}
                        image={item.image_url}
                        title={item.title}
                        chapter={
                          item.chapterCount
                            ? `Chương ${item.chapterCount}`
                            : undefined
                        }
                        views={item.views?.toString()}
                        rating={item.rating}
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={handleLoadMore}
                        className="px-8 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                      >
                        Tải thêm
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar - Trending */}
            <aside className="lg:col-span-1">
              <TrendingSection />
            </aside>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-bold text-foreground mb-3">Truyện Nhà Mèo</h3>
              <p className="text-sm text-muted-foreground">
                Nền tảng đọc truyện online miễn phí với hàng ngàn bộ truyện hay, cập nhật liên tục.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-3">Thể loại</h3>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {["Ngôn tình", "Đam mỹ", "Xuyên không", "Huyền huyễn", "Cổ đại"].map((genre) => (
                  <a key={genre} href={`/the-loai/${genre.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-primary transition-colors">
                    {genre}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-3">Liên kết</h3>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <a href="/tim-kiem" className="hover:text-primary transition-colors">Tìm kiếm truyện</a>
                <a href="/dang-nhap" className="hover:text-primary transition-colors">Đăng nhập</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-4 text-center text-sm text-muted-foreground">
            <p>© 2026 Truyện Nhà Mèo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
