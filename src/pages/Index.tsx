import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MangaCard } from "@/components/MangaCard";
import { TrendingSection } from "@/components/TrendingSection";
import { SEO } from "@/components/SEO";
import { Sparkles, Clock, Star } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useManga } from "@/hooks/useManga";

const Index = () => {
  const { t } = useTranslation();
  const { data: mangaList, isLoading } = useManga();

  const featured = mangaList?.slice(0, 6) || [];
  const latest = mangaList?.slice().sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 6) || [];
  const topRated = mangaList?.slice().sort((a, b) => b.rating - a.rating).slice(0, 6) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Đang tải truyện...</p>
        </div>
      </div>
    );
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Web Truyện Nhanh",
    "description": "Website đọc truyện online miễn phí với hàng nghìn đầu truyện hay, cập nhật liên tục mỗi ngày. Đọc truyện ngôn tình, đam mỹ, huyền huyễn, tiên hiệp, xuyên không.",
    "url": typeof window !== 'undefined' ? window.location.origin : '',
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${typeof window !== 'undefined' ? window.location.origin : ''}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Đọc Truyện Online Miễn Phí"
        description="Website đọc truyện online miễn phí với hàng nghìn đầu truyện hay, cập nhật liên tục mỗi ngày. Đọc truyện ngôn tình, đam mỹ, huyền huyễn, tiên hiệp, xuyên không, học đường và nhiều thể loại khác."
        keywords="đọc truyện online, truyện hay, web truyện, truyện ngôn tình, truyện đam mỹ, truyện xuyên không, truyện full, đọc truyện miễn phí"
        structuredData={websiteSchema}
      />
      <Header />
      <HeroSection />
      
      <main className="container px-4 py-8" role="main">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Section */}
            <section aria-labelledby="featured-heading">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 id="featured-heading" className="text-2xl font-bold">{t.sections.featured}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" aria-hidden="true" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {featured.map((manga) => (
                  <MangaCard 
                    key={manga.id}
                    id={manga.id}
                    image={manga.image_url}
                    title={manga.title}
                    chapter={manga.chapterCount ? `${t.common.chapter} ${manga.chapterCount}` : "Chưa có chương"}
                    views={manga.views.toString()}
                    rating={manga.rating}
                    isNew={new Date(manga.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000}
                  />
                ))}
              </div>
            </section>

            {/* Latest Updates Section */}
            <section aria-labelledby="latest-heading">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 id="latest-heading" className="text-2xl font-bold">{t.sections.latest}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" aria-hidden="true" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {latest.map((manga, index) => (
                  <MangaCard 
                    key={`${manga.id}-${index}`}
                    id={manga.id}
                    image={manga.image_url}
                    title={manga.title}
                    chapter={manga.chapterCount ? `${t.common.chapter} ${manga.chapterCount}` : "Chưa có chương"}
                    views={manga.views.toString()}
                    rating={manga.rating}
                    isNew={new Date(manga.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000}
                  />
                ))}
              </div>
            </section>

            {/* Top Rated Section */}
            <section aria-labelledby="toprated-heading">
              <div className="flex items-center gap-3 mb-6">
                <Star className="h-6 w-6 text-primary fill-primary" aria-hidden="true" />
                <h2 id="toprated-heading" className="text-2xl font-bold">{t.sections.topRated}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" aria-hidden="true" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {topRated.map((manga) => (
                  <MangaCard 
                    key={`rated-${manga.id}`}
                    id={manga.id}
                    image={manga.image_url}
                    title={manga.title}
                    chapter={manga.chapterCount ? `${t.common.chapter} ${manga.chapterCount}` : "Chưa có chương"}
                    views={manga.views.toString()}
                    rating={manga.rating}
                    isNew={new Date(manga.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000}
                  />
                ))}
              </div>
            </section>
          </div>

          <aside aria-label="Trending content">
            <TrendingSection />
          </aside>
        </div>
      </main>

      <footer className="border-t border-border mt-12 py-8 bg-card/50" role="contentinfo">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">{t.footer.copyright}</p>
          <p>{t.footer.description}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
