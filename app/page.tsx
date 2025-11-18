"use client";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TrendingSection } from "@/components/TrendingSection";
import { useManga } from "@/hooks/useManga";
import { MangaCard } from "@/components/MangaCard";

export default function Page() {
  const { data: mangaList, isLoading } = useManga();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <HeroSection />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">Truyện HOT (Truyện đọc nhiều)</h2>
            {isLoading ? (
              <p>Đang tải...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(mangaList || []).map((m) => (
                  <MangaCard
                    key={m.id}
                    id={m.id}
                    image={m.image_url}
                    title={m.title}
                    chapter={""}
                    views={(m.views || 0).toString()}
                    rating={m.rating || 0}
                  />
                ))}
              </div>
            )}
          </div>

          <TrendingSection />
        </div>
      </main>
    </div>
  );
}
