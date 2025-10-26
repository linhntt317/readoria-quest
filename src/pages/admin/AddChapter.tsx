import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMangaById } from "@/hooks/useManga";

const chapterSchema = z.object({
  chapterNumber: z.string().min(1, "Số chương không được để trống"),
  chapterTitle: z.string().min(1, "Tên chương không được để trống"),
  content: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự"),
});

type ChapterForm = z.infer<typeof chapterSchema>;

const AddChapter = () => {
  const { mangaId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: manga, isLoading } = useMangaById(mangaId);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ChapterForm>({
    resolver: zodResolver(chapterSchema),
  });

  const onSubmit = async (data: ChapterForm) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('chapters', {
        method: 'POST',
        body: {
          mangaId,
          chapterNumber: parseInt(data.chapterNumber),
          title: data.chapterTitle,
          content: data.content
        }
      });

      if (error) throw error;
      
      toast.success("Đã thêm chương thành công!");
      reset();
    } catch (error: any) {
      console.error('Error adding chapter:', error);
      toast.error(error.message || "Có lỗi xảy ra khi thêm chương!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Đang tải thông tin truyện...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Thêm Chương Mới</CardTitle>
            <CardDescription>Truyện: {manga?.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="chapterNumber">Số chương</Label>
                <Input 
                  id="chapterNumber" 
                  {...register("chapterNumber")} 
                  placeholder="Ví dụ: 1, 2, 3..." 
                  type="number"
                />
                {errors.chapterNumber && (
                  <p className="text-sm text-destructive">{errors.chapterNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="chapterTitle">Tên chương</Label>
                <Input 
                  id="chapterTitle" 
                  {...register("chapterTitle")} 
                  placeholder="Nhập tên chương..." 
                />
                {errors.chapterTitle && (
                  <p className="text-sm text-destructive">{errors.chapterTitle.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung (có thể thêm tURL ảnh, mỗi dòng một ảnh)</Label>
                <Textarea 
                  id="content" 
                  {...register("content")} 
                  placeholder="https://example.com/page1.jpg&#10;https://example.com/page2.jpg&#10;..."
                  rows={10}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Đang thêm..." : "Thêm Chương"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddChapter;
