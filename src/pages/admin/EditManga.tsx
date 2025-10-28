import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useMangaById, useTags } from "@/hooks/useManga";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const mangaSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  author: z.string().min(1, "Tác giả không được để trống"),
  description: z.string().min(1, "Giới thiệu không được để trống"),
  image_url: z.string().url("URL ảnh không hợp lệ"),
  tags: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 thể loại"),
});

type MangaForm = z.infer<typeof mangaSchema>;

const EditManga = () => {
  const navigate = useNavigate();
  const { mangaId } = useParams();
  const { data: manga, isLoading: mangaLoading } = useMangaById(mangaId);
  const { data: tags, isLoading: tagsLoading } = useTags();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<MangaForm>({
    resolver: zodResolver(mangaSchema),
    values: manga ? {
      title: manga.title,
      author: manga.author,
      description: manga.description,
      image_url: manga.image_url,
      tags: manga.tags.map(t => t.id),
    } : undefined,
  });

  const selectedTags = watch("tags") || [];

  const onSubmit = async (data: MangaForm) => {
    try {
      const { error: updateError } = await supabase
        .from('manga')
        .update({
          title: data.title,
          author: data.author,
          description: data.description,
          image_url: data.image_url,
        })
        .eq('id', mangaId);

      if (updateError) throw updateError;

      // Delete old tags
      const { error: deleteTagsError } = await supabase
        .from('manga_tags')
        .delete()
        .eq('manga_id', mangaId);

      if (deleteTagsError) throw deleteTagsError;

      // Insert new tags
      const mangaTags = data.tags.map(tagId => ({
        manga_id: mangaId!,
        tag_id: tagId,
      }));

      const { error: insertTagsError } = await supabase
        .from('manga_tags')
        .insert(mangaTags);

      if (insertTagsError) throw insertTagsError;

      toast.success("Cập nhật truyện thành công!");
      navigate(`/admin/manga-detail/${mangaId}`);
    } catch (error) {
      console.error('Error updating manga:', error);
      toast.error("Có lỗi xảy ra khi cập nhật truyện");
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
        <Button variant="outline" onClick={() => navigate(`/admin/manga-detail/${mangaId}`)}>
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
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Tác giả *</Label>
                <Input id="author" {...register("author")} />
                {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL ảnh bìa *</Label>
                <Input id="image_url" {...register("image_url")} placeholder="https://..." />
                {errors.image_url && <p className="text-sm text-destructive">{errors.image_url.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Giới thiệu *</Label>
                <Textarea id="description" {...register("description")} rows={5} />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Thể loại *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {tags?.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={tag.id}
                        checked={selectedTags.includes(tag.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setValue("tags", [...selectedTags, tag.id]);
                          } else {
                            setValue("tags", selectedTags.filter(id => id !== tag.id));
                          }
                        }}
                      />
                      <label htmlFor={tag.id} className="text-sm cursor-pointer">
                        {tag.name}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang cập nhật..." : "Cập nhật truyện"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(`/admin/manga-detail/${mangaId}`)}>
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
