"use client";

import { AppLink as Link } from "@/lib/navigation";
import { useEffect } from "react";
import { useChapterById } from "@/hooks/useChapter";
import { useMangaById } from "@/hooks/useManga";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { CommentSection } from "@/components/CommentSection";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";

const ChapterReader = ({
  mangaId,
  chapterId,
}: {
  mangaId?: string;
  chapterId?: string;
}) => {
  const { data: chapter, isLoading: chapterLoading } =
    useChapterById(chapterId);
  const { data: manga, isLoading: mangaLoading } = useMangaById(mangaId);

  // Increment view count for each chapter read via rate-limited Edge Function
  useEffect(() => {
    const incrementViews = async () => {
      if (mangaId && chapterId) {
        // Check if this specific chapter view already counted in this session
        const viewKey = `manga_view_${mangaId}_${chapterId}`;
        const hasViewed = sessionStorage.getItem(viewKey);

        if (!hasViewed) {
          try {
            // Use the rate-limited Edge Function instead of direct RPC
            const { data, error } = await supabase.functions.invoke("increment-views", {
              body: { mangaId },
            });
            
            if (!error && data?.success) {
              // Mark this chapter as viewed in session
              sessionStorage.setItem(viewKey, "true");
            } else if (error) {
              console.error("Failed to increment views:", error);
            }
          } catch (error) {
            console.error("Failed to increment views:", error);
          }
        }
      }
    };

    incrementViews();
  }, [mangaId, chapterId]);

  if (chapterLoading || mangaLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-4 text-muted-foreground">Đang tải chương...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!chapter || !manga) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Không tìm thấy chương</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/truyen/${mangaId}`}>
                <Button>Quay về trang truyện</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Find current chapter index and neighbors
  const currentIndex =
    manga.chapters?.findIndex((c) => c.id === chapter.id) ?? -1;
  const prevChapter =
    currentIndex > 0 ? manga.chapters![currentIndex - 1] : null;
  const nextChapter =
    currentIndex < (manga.chapters?.length ?? 0) - 1
      ? manga.chapters![currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Navigation Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link href={`/truyen/${mangaId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại truyện
                </Button>
              </Link>
              <div className="text-center flex-1">
                <h1 className="text-xl font-bold">{manga.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Chương {chapter.chapter_number}: {chapter.title}
                </p>
              </div>

              <div className="flex gap-2">
                {prevChapter && (
                  <Link href={`/truyen/${mangaId}/chuong/${prevChapter.id}`}>
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {nextChapter && (
                  <Link href={`/truyen/${mangaId}/chuong/${nextChapter.id}`}>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chapter Content */}
        <Card>
          <CardContent className="p-6">
            {!chapter.content || chapter.content.trim() === "" ? (
              <p className="text-center text-muted-foreground py-8">
                Chương này chưa có nội dung
              </p>
            ) : (
              <div
                className="prose prose-sm md:prose-base lg:prose-lg max-w-none dark:prose-invert whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(chapter.content, {
                    ALLOWED_TAGS: [
                      "p",
                      "br",
                      "strong",
                      "em",
                      "u",
                      "h1",
                      "h2",
                      "h3",
                      "h4",
                      "h5",
                      "h6",
                      "ul",
                      "ol",
                      "li",
                      "blockquote",
                      "a",
                      "img",
                      "span",
                      "div",
                    ],
                    ALLOWED_ATTR: ["href", "src", "alt", "title", "class"],
                    FORBID_TAGS: [
                      "script",
                      "iframe",
                      "object",
                      "embed",
                      "form",
                      "input",
                    ],
                    FORBID_ATTR: [
                      "onerror",
                      "onload",
                      "onclick",
                      "onmouseover",
                      "onfocus",
                      "onblur",
                    ],
                  }),
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div className="mt-6 flex justify-center gap-4">
          {prevChapter && (
            <Link href={`/truyen/${mangaId}/chuong/${prevChapter.id}`}>
              <Button variant="outline">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Chương trước
              </Button>
            </Link>
          )}
          <Link href={`/truyen/${mangaId}`}>
            <Button variant="outline">Danh sách chương</Button>
          </Link>
          {nextChapter && (
            <Link href={`/truyen/${mangaId}/chuong/${nextChapter.id}`}>
              <Button variant="outline">
                Chương tiếp
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>

        {/* Comments Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <CommentSection chapterId={chapterId} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ChapterReader;
