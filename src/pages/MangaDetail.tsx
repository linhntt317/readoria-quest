import { useParams, Link } from "react-router-dom";
import { useMangaById } from "@/hooks/useManga";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Eye, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { CommentSection } from "@/components/CommentSection";
import { SEO } from "@/components/SEO";
import DOMPurify from "dompurify";

const MangaDetail = () => {
  const { mangaId } = useParams();
  const { data: manga, isLoading } = useMangaById(mangaId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-4 text-muted-foreground">
              Đang tải thông tin truyện...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title="Không tìm thấy truyện"
          description="Truyện bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
        />
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Không tìm thấy truyện</CardTitle>
              <CardDescription>
                Truyện bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/">
                <Button>Quay về trang chủ</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Strip HTML tags for clean description
  const cleanDescription = manga.description
    .replace(/<[^>]*>/g, '')
    .substring(0, 155) + '...';

  const mangaSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": manga.title,
    "author": {
      "@type": "Person",
      "name": manga.author
    },
    "description": cleanDescription,
    "image": manga.image_url,
    "aggregateRating": manga.rating ? {
      "@type": "AggregateRating",
      "ratingValue": manga.rating,
      "ratingCount": manga.views || 1,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "numberOfPages": manga.chapters?.length || 0,
    "genre": manga.tags?.map(tag => tag.name).join(', ')
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${manga.title} - ${manga.author}`}
        description={cleanDescription}
        image={manga.image_url}
        type="article"
        keywords={`${manga.title}, ${manga.author}, ${manga.tags?.map(t => t.name).join(', ')}, đọc truyện online, truyện hay`}
        author={manga.author}
        structuredData={mangaSchema}
      />
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Manga Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <img
                  src={manga.image_url}
                  alt={`Ảnh bìa truyện ${manga.title} - ${manga.author}`}
                  loading="lazy"
                  className="w-full rounded-lg shadow-lg mb-4"
                />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{manga.views?.toLocaleString() || 0} lượt xem</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{manga.chapters?.length || 0} chương</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="font-semibold mb-2">Thể loại</h3>
                  <div className="flex flex-wrap gap-2">
                    {manga.tags?.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        style={{ backgroundColor: tag.color, color: "#fff" }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details & Chapters */}
          <div className="lg:col-span-2 space-y-6">
            {/* Manga Details */}
            <Card role="article">
              <CardHeader>
                <h1 className="text-3xl font-bold">{manga.title}</h1>
                <CardDescription className="text-base">
                  Tác giả: {manga.author}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Giới thiệu</h3>
                <div
                  className="prose prose-sm md:prose-base max-w-none dark:prose-invert text-muted-foreground whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(manga.description, {
                      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'span', 'div'],
                      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
                      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
                      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
                    })
                  }}
                />
              </CardContent>
            </Card>

            {/* Chapter List */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách chương</CardTitle>
                <CardDescription>
                  {manga.chapters?.length || 0} chương
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!manga.chapters || manga.chapters.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Chưa có chương nào được đăng
                  </p>
                ) : (
                  <div className="space-y-2">
                    {manga.chapters.map((chapter) => (
                      <Link
                        key={chapter.id}
                        to={`/truyen/${mangaId}/chuong/${chapter.id}`}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-between hover:bg-accent"
                        >
                          <span>
                            Chương {chapter.chapter_number}: {chapter.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(chapter.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardContent className="p-6">
                <CommentSection mangaId={mangaId} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MangaDetail;
