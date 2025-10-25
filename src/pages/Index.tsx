import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MangaCard } from "@/components/MangaCard";
import { TrendingSection } from "@/components/TrendingSection";
import { Sparkles, Clock, Star } from "lucide-react";

import manga1 from "@/assets/manga-1.jpg";
import manga2 from "@/assets/manga-2.jpg";
import manga3 from "@/assets/manga-3.jpg";
import manga4 from "@/assets/manga-4.jpg";
import manga5 from "@/assets/manga-5.jpg";
import manga6 from "@/assets/manga-6.jpg";
import manga7 from "@/assets/manga-7.jpg";
import manga8 from "@/assets/manga-8.jpg";

const featuredManga = [
  { id: 1, image: manga1, title: "Chiến Thần Năng Lượng", chapter: "Chương 245", views: "2.5M", rating: 9.5, isNew: true },
  { id: 2, image: manga2, title: "Nữ Thần Ma Pháp", chapter: "Chương 189", views: "1.8M", rating: 9.3, isNew: true },
  { id: 3, image: manga3, title: "Kiếm Sỹ Bóng Đêm", chapter: "Chương 312", views: "3.2M", rating: 9.7 },
  { id: 4, image: manga4, title: "Tình Yêu Anh Hoa", chapter: "Chương 156", views: "1.5M", rating: 9.1, isNew: true },
  { id: 5, image: manga5, title: "Mối Tình Học Đường", chapter: "Chương 98", views: "890K", rating: 8.8 },
  { id: 6, image: manga6, title: "Đấu Sĩ Huyền Thoại", chapter: "Chương 278", views: "2.1M", rating: 9.4 },
];

const latestManga = [
  { id: 7, image: manga7, title: "Bộ Ba Chibi Vui Nhộn", chapter: "Chương 45", views: "456K", rating: 8.5 },
  { id: 8, image: manga8, title: "Thám Tử Bí Ẩn", chapter: "Chương 167", views: "1.1M", rating: 9.0 },
  { id: 1, image: manga1, title: "Chiến Thần Năng Lượng", chapter: "Chương 244", views: "2.5M", rating: 9.5 },
  { id: 3, image: manga3, title: "Kiếm Sỹ Bóng Đêm", chapter: "Chương 311", views: "3.2M", rating: 9.7 },
  { id: 6, image: manga6, title: "Đấu Sĩ Huyền Thoại", chapter: "Chương 277", views: "2.1M", rating: 9.4 },
  { id: 2, image: manga2, title: "Nữ Thần Ma Pháp", chapter: "Chương 188", views: "1.8M", rating: 9.3 },
];

const Index = () => {
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
                <h2 className="text-2xl font-bold">Truyện Nổi Bật</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {featuredManga.map((manga) => (
                  <MangaCard key={manga.id} {...manga} />
                ))}
              </div>
            </section>

            {/* Latest Updates Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Cập Nhật Mới Nhất</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {latestManga.map((manga, index) => (
                  <MangaCard key={`${manga.id}-${index}`} {...manga} />
                ))}
              </div>
            </section>

            {/* Top Rated Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Star className="h-6 w-6 text-primary fill-primary" />
                <h2 className="text-2xl font-bold">Đánh Giá Cao</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...featuredManga].sort((a, b) => b.rating! - a.rating!).map((manga) => (
                  <MangaCard key={`rated-${manga.id}`} {...manga} />
                ))}
              </div>
            </section>
          </div>

          <TrendingSection />
        </div>
      </main>

      <footer className="border-t border-border mt-12 py-8 bg-card/50">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">© 2025 TruyệnHD. Tất cả quyền được bảo lưu.</p>
          <p>Website đọc truyện tranh online miễn phí</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
