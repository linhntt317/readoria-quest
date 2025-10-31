import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Chapter } from "@/hooks/useManga";

const chapterSchema = z.object({
  chapter_number: z.number().min(1, "Số chương phải lớn hơn 0"),
  title: z.string().min(1, "Tiêu đề không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
});

type ChapterForm = z.infer<typeof chapterSchema>;

const EditChapter = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams();

  const { data: chapter, isLoading } = useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', chapterId)
        .single();
      
      if (error) throw error;
      return data as Chapter;
    },
    enabled: !!chapterId
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ChapterForm>({
    resolver: zodResolver(chapterSchema),
    values: chapter ? {
      chapter_number: chapter.chapter_number,
      title: chapter.title,
      content: chapter.content || "",
    } : undefined,
  });

  const onSubmit = async (data: ChapterForm) => {
    try {
      const { data: result, error } = await supabase.functions.invoke(`chapters?id=${chapterId}`, {
        method: 'PUT',
        body: {
          chapterNumber: data.chapter_number,
          title: data.title,
          content: data.content,
        }
      });

      if (error) throw error;

      toast.success("Cập nhật chương thành công!");
      navigate(`/admin/manga-detail/${chapter?.manga_id}`);
    } catch (error) {
      console.error('Error updating chapter:', error);
      toast.error("Có lỗi xảy ra khi cập nhật chương");
    }
  };

  if (isLoading) {
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
        <Button variant="outline" onClick={() => navigate(`/admin/manga-detail/${chapter?.manga_id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Sửa chương</CardTitle>
            <CardDescription>Cập nhật thông tin chương truyện</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chapter_number">Số chương *</Label>
                <Input 
                  id="chapter_number" 
                  type="number" 
                  {...register("chapter_number", { valueAsNumber: true })} 
                />
                {errors.chapter_number && <p className="text-sm text-destructive">{errors.chapter_number.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề chương *</Label>
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung (HTML) *</Label>
                <Textarea 
                  id="content" 
                  {...register("content")} 
                  rows={15} 
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ HTML: &lt;p&gt;, &lt;br&gt;, &lt;img&gt;, &lt;strong&gt;, &lt;em&gt;, v.v.
                </p>
                {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang cập nhật..." : "Cập nhật chương"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(`/admin/manga-detail/${chapter?.manga_id}`)}>
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

export default EditChapter;
