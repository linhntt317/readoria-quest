"use client";

import { MangaCard } from "@/components/MangaCard";
import { useTranslation } from "@/hooks/useTranslation";
import type { Manga } from "@/lib/supabase-server";

interface MangaGridProps {
  mangaList: Manga[];
}

export function MangaGrid({ mangaList }: MangaGridProps) {
  const { t } = useTranslation();

  return (
    <div className="lg:col-span-3">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        {t.sections.latest}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mangaList.slice(0, 12).map((item) => (
          <MangaCard
            key={item.id}
            id={item.id}
            image={item.image_url}
            title={item.title}
            chapter={item.chapterCount ? `Chương ${item.chapterCount}` : undefined}
            views={item.views?.toString()}
            rating={item.rating}
          />
        ))}
      </div>
    </div>
  );
}
