import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MangaCard } from "@/components/MangaCard";
import { TrendingSection } from "@/components/TrendingSection";
import { Sparkles, Clock, Star } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

import manga1 from "@/assets/manga-1.jpg";
import manga2 from "@/assets/manga-2.jpg";
import manga3 from "@/assets/manga-3.jpg";
import manga4 from "@/assets/manga-4.jpg";
import manga5 from "@/assets/manga-5.jpg";
import manga6 from "@/assets/manga-6.jpg";
import manga7 from "@/assets/manga-7.jpg";
import manga8 from "@/assets/manga-8.jpg";

const getMangaData = (t: any) => ({
  featured: [
    { id: 1, titleKey: "manga1", image: manga1, chapter: 245, views: "2.5M", rating: 9.5, isNew: true },
    { id: 2, titleKey: "manga2", image: manga2, chapter: 189, views: "1.8M", rating: 9.3, isNew: true },
    { id: 3, titleKey: "manga3", image: manga3, chapter: 312, views: "3.2M", rating: 9.7, isNew: false },
    { id: 4, titleKey: "manga4", image: manga4, chapter: 156, views: "1.5M", rating: 9.1, isNew: true },
    { id: 5, titleKey: "manga5", image: manga5, chapter: 98, views: "890K", rating: 8.8, isNew: false },
    { id: 6, titleKey: "manga6", image: manga6, chapter: 278, views: "2.1M", rating: 9.4, isNew: false },
  ],
  latest: [
    { id: 7, titleKey: "manga7", image: manga7, chapter: 45, views: "456K", rating: 8.5, isNew: false },
    { id: 8, titleKey: "manga8", image: manga8, chapter: 167, views: "1.1M", rating: 9.0, isNew: false },
    { id: 1, titleKey: "manga1", image: manga1, chapter: 244, views: "2.5M", rating: 9.5, isNew: false },
    { id: 3, titleKey: "manga3", image: manga3, chapter: 311, views: "3.2M", rating: 9.7, isNew: false },
    { id: 6, titleKey: "manga6", image: manga6, chapter: 277, views: "2.1M", rating: 9.4, isNew: false },
    { id: 2, titleKey: "manga2", image: manga2, chapter: 188, views: "1.8M", rating: 9.3, isNew: false },
  ]
});

const Index = () => {
  const { t } = useTranslation();
  const mangaData = getMangaData(t);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <main className="container px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{t.sections.featured}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mangaData.featured.map((manga) => (
                  <MangaCard 
                    key={manga.id} 
                    image={manga.image}
                    title={t.manga.titles[manga.titleKey as keyof typeof t.manga.titles]}
                    chapter={`${t.common.chapter} ${manga.chapter}`}
                    views={manga.views}
                    rating={manga.rating}
                    isNew={manga.isNew}
                  />
                ))}
              </div>
            </section>

            {/* Latest Updates Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{t.sections.latest}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mangaData.latest.map((manga, index) => (
                  <MangaCard 
                    key={`${manga.id}-${index}`}
                    image={manga.image}
                    title={t.manga.titles[manga.titleKey as keyof typeof t.manga.titles]}
                    chapter={`${t.common.chapter} ${manga.chapter}`}
                    views={manga.views}
                    rating={manga.rating}
                    isNew={manga.isNew}
                  />
                ))}
              </div>
            </section>

            {/* Top Rated Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Star className="h-6 w-6 text-primary fill-primary" />
                <h2 className="text-2xl font-bold">{t.sections.topRated}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...mangaData.featured].sort((a, b) => b.rating! - a.rating!).map((manga) => (
                  <MangaCard 
                    key={`rated-${manga.id}`}
                    image={manga.image}
                    title={t.manga.titles[manga.titleKey as keyof typeof t.manga.titles]}
                    chapter={`${t.common.chapter} ${manga.chapter}`}
                    views={manga.views}
                    rating={manga.rating}
                    isNew={manga.isNew}
                  />
                ))}
              </div>
            </section>
          </div>

          <TrendingSection />
        </div>
      </main>

      <footer className="border-t border-border mt-12 py-8 bg-card/50">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">{t.footer.copyright}</p>
          <p>{t.footer.description}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
