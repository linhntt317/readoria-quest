import { Button } from "@/components/ui/button";
import { PlayCircle, BookmarkPlus } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

export const HeroSection = () => {
  return (
    <section className="relative h-[500px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      <div className="relative container h-full flex items-center px-4">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">Truyện Nổi Bật</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Đại Lục Thu Nhân
            <span className="block text-3xl md:text-5xl mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Giống Cải Tất Là Ý Thiên Tài
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl">
            Một câu chuyện hấp dẫn về phép thuật, phiêu lưu và khám phá thế giới mới đầy bí ẩn.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30">
              <PlayCircle className="mr-2 h-5 w-5" />
              Đọc Ngay
            </Button>
            <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
              <BookmarkPlus className="mr-2 h-5 w-5" />
              Thêm Bookmark
            </Button>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Thể loại: </span>
              <span className="text-foreground font-medium">Hành Động, Phiêu Lưu</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div>
              <span className="text-muted-foreground">Chương: </span>
              <span className="text-primary font-medium">156</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
