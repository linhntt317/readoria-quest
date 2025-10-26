import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useTags } from "@/hooks/useManga";

const mangaSchema = z.object({
  title: z.string().min(1, "Tên truyện không được để trống"),
  author: z.string().min(1, "Tác giả không được để trống"),
  description: z.string().min(10, "Giới thiệu phải có ít nhất 10 ký tự"),
  tagIds: z.array(z.string()).min(0, "Vui lòng chọn ít nhất một thể loại"),
  imageUrl: z.string().url("URL hình ảnh không hợp lệ"),
});

type MangaForm = z.infer<typeof mangaSchema>;

const AddManga = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: tags, isLoading: tagsLoading } = useTags();
  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<MangaForm>({
    resolver: zodResolver(mangaSchema),
    defaultValues: {
      tagIds: []
    }
  });

  const onSubmit = async (data: MangaForm) => {
    setIsSubmitting(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('manga', {
        method: 'POST',
        body: {
          title: data.title,
          author: data.author,
          description: data.description,
          imageUrl: data.imageUrl,
          tagIds: data?.tagIds
        }
      });

      if (error) throw error;
      
      toast.success("Đã thêm truyện thành công!");
      reset();
    } catch (error: any) {
      console.error('Error adding manga:', error);
      toast.error(error.message || "Có lỗi xảy ra khi thêm truyện!");
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
            <Label>Thể loại</Label>
            {tagsLoading ? (
              <p className="text-sm text-muted-foreground">Đang tải thể loại...</p>
            ) : (
              <Controller
                name="tagIds"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
                    {tags?.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag.id}
                          checked={field.value?.includes(tag.id)}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...(field.value || []), tag.id]
                              : field.value?.filter((id) => id !== tag.id) || [];
                            field.onChange(newValue);
                          }}
                        />
                        <Label htmlFor={tag.id} className="cursor-pointer font-normal">
                          {tag.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              />
            )}
            {errors.tagIds && <p className="text-sm text-destructive">{errors.tagIds.message}</p>}
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
