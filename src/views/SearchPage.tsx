"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import Seo from "@/components/Seo";
import { MangaCard } from "@/components/MangaCard";
import { useManga, useTags } from "@/hooks/useManga";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";

type SortOption = "newest" | "oldest" | "views" | "rating" | "title";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: manga, isLoading } = useManga();
  const { data: tags } = useTags();
  const { language } = useTranslation();

  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedTags([]);
    setSortBy("newest");
    setSearchParams({});
  };

  const filteredManga = useMemo(() => {
    if (!manga) return [];

    let results = [...manga];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.author.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q)
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      results = results.filter((m) =>
        selectedTags.every((tagId) => m.tags?.some((t) => t.id === tagId))
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        results.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "views":
        results.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "rating":
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "title":
        results.sort((a, b) => a.title.localeCompare(b.title, "vi"));
        break;
    }

    return results;
  }, [manga, query, selectedTags, sortBy]);

  const hasActiveFilters = query.trim() || selectedTags.length > 0 || sortBy !== "newest";

  const sortLabels: Record<SortOption, string> = {
    newest: language === "vi" ? "Mới nhất" : "Newest",
    oldest: language === "vi" ? "Cũ nhất" : "Oldest",
    views: language === "vi" ? "Lượt xem" : "Most Views",
    rating: language === "vi" ? "Đánh giá" : "Top Rated",
    title: language === "vi" ? "Tên A-Z" : "Title A-Z",
  };

  const seoQuery = query.trim();
  const seoTitle = seoQuery
    ? `Kết quả tìm kiếm "${seoQuery.slice(0, 40)}" - Truyện Nhà Mèo`
    : "Tìm kiếm truyện - Truyện Nhà Mèo";
  const seoDescription = seoQuery
    ? `Kết quả tìm kiếm truyện cho từ khóa "${seoQuery}". Tìm truyện ngôn tình, đam mỹ, huyền huyễn miễn phí trên Truyện Nhà Mèo.`
    : "Tìm kiếm truyện theo tên, tác giả hoặc thể loại. Lọc và sắp xếp hàng ngàn bộ truyện miễn phí trên Truyện Nhà Mèo.";

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={seoTitle}
        description={seoDescription}
        url={`https://tieuthuyet.lovable.app/tim-kiem${seoQuery ? `?q=${encodeURIComponent(seoQuery)}` : ""}`}
      />
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Search header */}
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          {language === "vi" ? "Tìm kiếm truyện" : "Search Stories"}
        </h1>

        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === "vi" ? "Nhập tên truyện, tác giả..." : "Search by title, author..."}
              className="pl-11 h-12 text-base bg-secondary/50"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="lg"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">
              {language === "vi" ? "Bộ lọc" : "Filters"}
            </span>
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mb-6 p-4 rounded-lg border border-border bg-card space-y-4 animate-fade-in">
            {/* Sort */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground min-w-fit">
                {language === "vi" ? "Sắp xếp:" : "Sort by:"}
              </span>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {sortLabels[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div>
              <span className="text-sm font-medium text-muted-foreground mb-2 block">
                {language === "vi" ? "Thể loại:" : "Genres:"}
              </span>
              <div className="flex flex-wrap gap-2">
                {tags?.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 hover:text-primary-foreground transition-colors"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                    {selectedTags.includes(tag.id) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive">
                <X className="h-4 w-4 mr-1" />
                {language === "vi" ? "Xóa bộ lọc" : "Clear all"}
              </Button>
            )}
          </div>
        )}

        {/* Results info */}
        <div className="mb-4 text-sm text-muted-foreground">
          {isLoading
            ? language === "vi" ? "Đang tải..." : "Loading..."
            : language === "vi"
              ? `Tìm thấy ${filteredManga.length} truyện`
              : `Found ${filteredManga.length} stories`}
        </div>

        {/* Results grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted aspect-[2/3] rounded-lg" />
                <div className="h-4 bg-muted rounded mt-2" />
              </div>
            ))}
          </div>
        ) : filteredManga.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {language === "vi" ? "Không tìm thấy truyện nào" : "No stories found"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === "vi"
                ? "Thử thay đổi từ khóa hoặc bộ lọc"
                : "Try changing your search or filters"}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                {language === "vi" ? "Xóa bộ lọc" : "Clear filters"}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredManga.map((item) => (
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
        )}
      </main>
    </div>
  );
};

export default SearchPage;
