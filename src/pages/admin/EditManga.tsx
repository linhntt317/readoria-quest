import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search } from "lucide-react";
import { useMangaById, useTags } from "@/hooks/useManga";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const mangaSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  author: z.string().min(1, "Tác giả không được để trống"),
  description: z.string().min(1, "Giới thiệu không được để trống"),
  image_url: z.string().url("URL ảnh không hợp lệ"),
  tags: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 thể loại"),
});

type MangaForm = z.infer<typeof mangaSchema>;

const EditManga = ({ mangaId }: { mangaId: string }) => {
  const navigate = useNavigate();
  const { data: manga, isLoading: mangaLoading } = useMangaById(mangaId);
  const { data: tags, isLoading: tagsLoading } = useTags();
  const [searchTag, setSearchTag] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<MangaForm>({
    resolver: zodResolver(mangaSchema),
    values: manga
      ? {
          title: manga.title,
          author: manga.author,
          description: manga.description,
          image_url: manga.image_url,
          tags: manga.tags.map((t) => t.id),
        }
      : undefined,
  });

  const selectedTags = watch("tags") || [];

  const onSubmit = async (data: MangaForm) => {
    try {
      const { data: result, error } = await supabase.functions.invoke(
        "truyen",
        {
          body: {
            action: "update",
            id: mangaId,
            title: data.title,
            author: data.author,
            description: data.description,
            imageUrl: data.image_url,
            tagIds: data.tags,
          },
        }
      );

      if (error) throw error;

      toast.success("Cập nhật truyện thành công!");
      navigate(`/admin/manga-detail/${mangaId}`);
    } catch (error: any) {
      console.error("Error updating manga:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật truyện");
    }
  };

  if (mangaLoading || tagsLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
              <p className="mt-4 text-muted-foreground">Đang tải...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/manga-detail/${mangaId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Sửa thông tin truyện</CardTitle>
            <CardDescription>Cập nhật thông tin truyện</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input id="title" {...register("title")} />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Tác giả *</Label>
                <Input id="author" {...register("author")} />
                {errors.author && (
                  <p className="text-sm text-destructive">
                    {errors.author.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL ảnh bìa *</Label>
                <Input
                  id="image_url"
                  {...register("image_url")}
                  placeholder="https://..."
                />
                {errors.image_url && (
                  <p className="text-sm text-destructive">
                    {errors.image_url.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Giới thiệu (HTML) *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ HTML: &lt;p&gt;, &lt;br&gt;, &lt;strong&gt;,
                  &lt;em&gt;, v.v.
                </p>
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Thể loại *</Label>
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm thể loại..."
                      value={searchTag}
                      onChange={(e) => setSearchTag(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <ScrollArea className="h-[300px] border rounded-lg p-4">
                    <div className="space-y-4">
                      {Object.entries(
                        tags?.reduce((acc, tag) => {
                          if (!acc[tag.category]) {
                            acc[tag.category] = [];
                          }
                          acc[tag.category].push(tag);
                          return acc;
                        }, {} as Record<string, typeof tags>) || {}
                      )
                        .map(([category, categoryTags]) => ({
                          category,
                          tags: categoryTags.filter((tag) =>
                            tag.name
                              .toLowerCase()
                              .includes(searchTag.toLowerCase())
                          ),
                        }))
                        .filter((group) => group.tags.length > 0)
                        .map(({ category, tags: categoryTags }) => (
                          <div key={category}>
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: categoryTags[0]?.color,
                                }}
                              />
                              <h4 className="font-semibold text-sm">
                                {category}
                              </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2 ml-5">
                              {categoryTags.map((tag) => (
                                <div
                                  key={tag.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={tag.id}
                                    checked={selectedTags.includes(tag.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setValue("tags", [
                                          ...selectedTags,
                                          tag.id,
                                        ]);
                                      } else {
                                        setValue(
                                          "tags",
                                          selectedTags.filter(
                                            (id) => id !== tag.id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={tag.id}
                                    className="text-sm cursor-pointer"
                                    style={{ color: tag.color }}
                                  >
                                    {tag.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tagId) => {
                        const tag = tags?.find((t) => t.id === tagId);
                        return tag ? (
                          <div
                            key={tag.id}
                            className="px-2 py-1 rounded-full text-xs text-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                {errors.tags && (
                  <p className="text-sm text-destructive">
                    {errors.tags.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang cập nhật..." : "Cập nhật truyện"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/admin/manga-detail/${mangaId}`)}
                >
                  Huỷ
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditManga;
