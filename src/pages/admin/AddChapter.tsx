import { useState, useEffect } from "react";
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

const chapterSchema = z.object({
  chapterNumber: z.string().min(1, "Số chương không được để trống"),
  chapterTitle: z.string().min(1, "Tên chương không được để trống"),
  content: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự"),
});

type ChapterForm = z.infer<typeof chapterSchema>;

const AddChapter = () => {
  const { mangaId } = useParams();
  const navigate = useNavigate();
  const [mangaTitle, setMangaTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ChapterForm>({
    resolver: zodResolver(chapterSchema),
  });

  useEffect(() => {
    const stored = localStorage.getItem("manga_list");
    if (stored) {
      const mangaList = JSON.parse(stored);
      const manga = mangaList.find((m: any) => m.id === mangaId);
      if (manga) {
        setMangaTitle(manga.title);
      }
    }
  }, [mangaId]);

  const onSubmit = (data: ChapterForm) => {
    setIsSubmitting(true);
    
    try {
      const stored = localStorage.getItem("manga_list");
      if (!stored) return;
      
      const mangaList = JSON.parse(stored);
      const mangaIndex = mangaList.findIndex((m: any) => m.id === mangaId);
      
      if (mangaIndex === -1) {
        toast.error("Không tìm thấy truyện!");
        return;
      }

      const newChapter = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
      };

      if (!mangaList[mangaIndex].chapters) {
        mangaList[mangaIndex].chapters = [];
      }
      
      mangaList[mangaIndex].chapters.push(newChapter);
      localStorage.setItem("manga_list", JSON.stringify(mangaList));
      
      toast.success("Đã thêm chương thành công!");
      reset();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm chương!");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <CardDescription>Truyện: {mangaTitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="chapterNumber">Số chương</Label>
                <Input 
                  id="chapterNumber" 
                  {...register("chapterNumber")} 
                  placeholder="Ví dụ: 1, 2, 3..." 
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
                <Label htmlFor="content">Nội dung (URL ảnh, mỗi dòng một ảnh)</Label>
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
