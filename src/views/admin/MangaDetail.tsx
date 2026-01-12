"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useMangaById } from "@/hooks/useManga";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Chapter } from "@/hooks/useManga";
import { toast } from "sonner";
import DOMPurify from "dompurify";

const MangaDetail = ({ mangaId }: { mangaId: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: manga, isLoading } = useMangaById(mangaId);

  const { data: chapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ["chapters", mangaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("manga_id", mangaId)
        .order("chapter_number", { ascending: true });

      if (error) throw error;
      return data as Chapter[];
    },
    enabled: !!mangaId,
  });

  if (isLoading || chaptersLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-muted-foreground">Đang tải...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Không tìm thấy truyện
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá chương này?")) return;

    try {
      const { error } = await supabase.functions.invoke("chapters", {
        body: { action: "delete", id: chapterId },
      });

      if (error) throw error;

      toast.success("Xoá chương thành công!");
      queryClient.invalidateQueries({ queryKey: ["chapters", mangaId] });
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast.error("Có lỗi xảy ra khi xoá chương");
    }
  };

  const handleDeleteManga = async () => {
    if (
      !confirm("Bạn có chắc chắn muốn xoá truyện này? Tất cả chương sẽ bị xoá.")
    )
      return;

    try {
      const { error } = await supabase.functions.invoke(`truyen/${mangaId}`, {
        method: "DELETE",
      });

      if (error) throw error;

      toast.success("Xoá truyện thành công!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error deleting manga:", error);
      toast.error("Có lỗi xảy ra khi xoá truyện");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/edit-manga/${mangaId}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Sửa truyện
            </Button>
            <Button
              onClick={() => router.push(`/admin/add-chapter/${mangaId}`)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm chương
            </Button>
          </div>
        </div>

        {/* Manga Information */}
        <Card>
          <CardHeader>
            <div className="flex gap-6">
              <img
                src={manga.image_url}
                alt={manga.title}
                loading="lazy"
                className="w-32 h-44 object-cover rounded"
              />
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{manga.title}</CardTitle>
                <CardDescription className="text-base mb-3">
                  Tác giả: {manga.author}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mb-3">
                  {manga.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>👁️ {manga.views} lượt xem</span>
                  <span>⭐ {manga.rating}/5</span>
                  <span>📚 {chapters?.length || 0} chương</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">Giới thiệu:</h3>
            <div
              className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground whitespace-pre-wrap"
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

        {/* Chapters List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách chương ({chapters?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {!chapters || chapters.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Chưa có chương nào
              </p>
            ) : (
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        Chương {chapter.chapter_number}: {chapter.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(chapter.created_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/admin/view-chapter/${chapter.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/admin/edit-chapter/${chapter.id}`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteChapter(chapter.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Manga Button */}
        <div className="flex justify-center">
          <Button variant="destructive" size="sm" onClick={handleDeleteManga}>
            <Trash2 className="h-4 w-4 mr-2" />
            Xoá truyện
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MangaDetail;
