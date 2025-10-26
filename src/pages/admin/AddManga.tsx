import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const mangaSchema = z.object({
  title: z.string().min(1, "Tên truyện không được để trống"),
  author: z.string().min(1, "Tác giả không được để trống"),
  description: z.string().min(10, "Giới thiệu phải có ít nhất 10 ký tự"),
  tags: z.string().min(1, "Thể loại không được để trống"),
  imageUrl: z.string().url("URL hình ảnh không hợp lệ"),
});

type MangaForm = z.infer<typeof mangaSchema>;

const AddManga = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MangaForm>({
    resolver: zodResolver(mangaSchema),
  });

  const onSubmit = (data: MangaForm) => {
    setIsSubmitting(true);
    
    try {
      const existingManga = JSON.parse(localStorage.getItem("manga_list") || "[]");
      const newManga = {
        id: Date.now().toString(),
        ...data,
        tags: data.tags.split(",").map(tag => tag.trim()),
        chapters: [],
        createdAt: new Date().toISOString(),
      };
      
      existingManga.push(newManga);
      localStorage.setItem("manga_list", JSON.stringify(existingManga));
      
      toast.success("Đã thêm truyện thành công!");
      reset();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm truyện!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Thêm Truyện Mới</CardTitle>
        <CardDescription>Điền đầy đủ thông tin để thêm truyện mới vào hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Tên truyện</Label>
            <Input id="title" {...register("title")} placeholder="Nhập tên truyện..." />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Tác giả</Label>
            <Input id="author" {...register("author")} placeholder="Nhập tên tác giả..." />
            {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL Hình ảnh</Label>
            <Input id="imageUrl" {...register("imageUrl")} placeholder="https://example.com/image.jpg" />
            {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Thể loại (phân cách bằng dấu phẩy)</Label>
            <Input id="tags" {...register("tags")} placeholder="Hành động, Phiêu lưu, Hài hước" />
            {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Giới thiệu</Label>
            <Textarea 
              id="description" 
              {...register("description")} 
              placeholder="Nhập giới thiệu truyện..."
              rows={6}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Đang thêm..." : "Thêm Truyện"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddManga;
