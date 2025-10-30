import { useParams, useNavigate, Link } from "react-router-dom";
import { useChapterById } from "@/hooks/useChapter";
import { useMangaById } from "@/hooks/useManga";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";

const ChapterReader = () => {
  const { mangaId, chapterId } = useParams();
  const navigate = useNavigate();
  const { data: chapter, isLoading: chapterLoading } = useChapterById(chapterId);
  const { data: manga, isLoading: mangaLoading } = useMangaById(mangaId);

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
              <Link to={`/truyen/${mangaId}`}>
                <Button>Quay về trang truyện</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Find current chapter index and neighbors
  const currentIndex = manga.chapters?.findIndex((c) => c.id === chapter.id) ?? -1;
  const prevChapter = currentIndex > 0 ? manga.chapters![currentIndex - 1] : null;
  const nextChapter = currentIndex < (manga.chapters?.length ?? 0) - 1 ? manga.chapters![currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Navigation Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link to={`/truyen/${mangaId}`}>
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
                  <Link to={`/truyen/${mangaId}/chuong/${prevChapter.id}`}>
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {nextChapter && (
                  <Link to={`/truyen/${mangaId}/chuong/${nextChapter.id}`}>
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
            {!chapter.content || chapter.content.trim() === '' ? (
              <p className="text-center text-muted-foreground py-8">
                Chương này chưa có nội dung
              </p>
            ) : (
              <div 
                className="prose prose-sm md:prose-base lg:prose-lg max-w-none dark:prose-invert whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: chapter.content }}
              />
            )}
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div className="mt-6 flex justify-center gap-4">
          {prevChapter && (
            <Link to={`/truyen/${mangaId}/chuong/${prevChapter.id}`}>
              <Button variant="outline">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Chương trước
              </Button>
            </Link>
          )}
          <Link to={`/truyen/${mangaId}`}>
            <Button variant="outline">Danh sách chương</Button>
          </Link>
          {nextChapter && (
            <Link to={`/truyen/${mangaId}/chuong/${nextChapter.id}`}>
              <Button variant="outline">
                Chương tiếp
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChapterReader;
