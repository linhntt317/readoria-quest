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
        title="Đọc Tiểu Thuyết - Kho truyện online miễn phí"
        description="Đọc truyện online miễn phí với hàng ngàn bộ truyện hay. Cập nhật liên tục các thể loại: Ngôn tình, Đam mỹ, Huyền huyễn, Tiên hiệp, Xuyên không..."
        url="https://doctieuthuyet.com"
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
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Đọc Tiểu Thuyết. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
