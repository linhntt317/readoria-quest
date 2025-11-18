import Link from "next/link";
import Image from "next/image";
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
import DOMPurify from "dompurify";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const MangaDetail = ({ mangaId }: { mangaId?: string }) => {
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
              <Link href="/">
                <Button>Quay về trang chủ</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Trang chủ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/truyen">Truyện</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{manga.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Manga Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="w-full rounded-lg shadow-lg mb-4 overflow-hidden">
                  <Image
                    src={
                      (manga.image_url || "").trim().replace(/[)]+$/, "") ||
                      "/placeholder.svg"
                    }
                    alt={manga.title}
                    width={600}
                    height={900}
                    className="w-full h-auto object-cover"
                    priority={false}
                  />
                </div>

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
                    {manga.tags?.map((tag) => {
                      const slug = (tag.name || "")
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                      return (
                        <Link key={tag.id} href={`/the-loai/${slug}`}>
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: tag.color,
                              color: "#fff",
                            }}
                          >
                            {tag.name}
                          </Badge>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details & Chapters */}
          <div className="lg:col-span-2 space-y-6">
            {/* Manga Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{manga.title}</CardTitle>
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
                        href={`/truyen/${mangaId}/chuong/${chapter.id}`}
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
