"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircle, BookmarkPlus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { Manga } from "@/lib/supabase-server";

interface HeroCarouselProps {
  mangaList: Manga[];
}

export function HeroCarousel({ mangaList }: HeroCarouselProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = async (id: string) => {
    setIsLoading(true);
    try {
      router.push(`/truyen/${id}`);
    } catch (error) {
      console.error("Navigation error:", error);
      setIsLoading(false);
    }
  };

  const featured = mangaList.slice(0, 10);

  if (!featured.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden">
      <LoadingOverlay
        isVisible={isLoading}
        message="Đang tải thông tin truyện..."
      />
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {featured.map((manga) => (
            <CarouselItem key={manga.id}>
              <div className="relative h-[400px] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${manga.image_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                </div>

                <div className="relative container h-full flex items-center px-4">
                  <div className="max-w-2xl space-y-3 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {t.hero.featured}
                      </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                      {manga.title}
                      <span className="block text-xl md:text-2xl mt-2 text-muted-foreground font-normal">
                        {manga.author}
                      </span>
                    </h1>

                    <p className="text-sm text-muted-foreground max-w-xl line-clamp-3">
                      {manga.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Link href={`/truyen/${manga.id}`}>
                        <Button
                          size="default"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                        >
                          <PlayCircle className="mr-2 h-5 w-5" />
                          {t.hero.readNow}
                        </Button>
                      </Link>
                      <Button
                        size="default"
                        variant="outline"
                        className="border-primary/50 hover:bg-primary/10"
                      >
                        <BookmarkPlus className="mr-2 h-5 w-5" />
                        {t.hero.addBookmark}
                      </Button>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          {t.hero.genreLabel}:{" "}
                        </span>
                        <span className="text-foreground font-medium">
                          {manga.tags?.map((tag) => tag.name).join(", ") ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="h-4 w-px bg-border" />
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
}
