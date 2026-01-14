"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useTags } from "@/hooks/useManga";
import { useAsyncWithLoading } from "@/hooks/useAsyncWithLoading";
import { Search } from "lucide-react";

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
  const [searchTag, setSearchTag] = useState("");
  const { data: tags, isLoading: tagsLoading } = useTags();
  const { execute } = useAsyncWithLoading();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<MangaForm>({
    resolver: zodResolver(mangaSchema),
    defaultValues: {
      tagIds: [],
    },
  });

  const onSubmit = async (data: MangaForm) => {
    setIsSubmitting(true);

    try {
      await execute(async () => {
        const { data: result, error } = await supabase.functions.invoke(
          "truyen",
          {
            method: "POST",
            body: {
              title: data.title,
              author: data.author,
              description: data.description,
              imageUrl: data.imageUrl,
              tagIds: data?.tagIds,
            },
          }
        );

        if (error) throw error;

        toast.success("Đã thêm truyện thành công!");
        reset();
      });
    } catch (error: any) {
      console.error("Error adding manga:", error);
      toast.error(error.message || "Có lỗi xảy ra khi thêm truyện!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Thêm Truyện Mới</CardTitle>
        <CardDescription>
          Điền đầy đủ thông tin để thêm truyện mới vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Tên truyện</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Nhập tên truyện..."
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Tác giả</Label>
            <Input
              id="author"
              {...register("author")}
              placeholder="Nhập tên tác giả..."
            />
            {errors.author && (
              <p className="text-sm text-destructive">
                {errors.author.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL Hình ảnh</Label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <p className="text-sm text-destructive">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Thể loại</Label>
            {tagsLoading ? (
              <p className="text-sm text-muted-foreground">
                Đang tải thể loại...
              </p>
            ) : (
              <Controller
                name="tagIds"
                control={control}
                render={({ field }) => {
                  const groupedTags = tags?.reduce((acc, tag) => {
                    if (!acc[tag.category]) {
                      acc[tag.category] = [];
                    }
                    acc[tag.category].push(tag);
                    return acc;
                  }, {} as Record<string, typeof tags>);

                  const filteredGroups = Object.entries(groupedTags || {})
                    .map(([category, categoryTags]) => ({
                      category,
                      tags: categoryTags.filter((tag) =>
                        tag.name.toLowerCase().includes(searchTag.toLowerCase())
                      ),
                    }))
                    .filter((group) => group.tags.length > 0);

                  return (
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
                          {filteredGroups.map(
                            ({ category, tags: categoryTags }) => (
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
                                        checked={field.value?.includes(tag.id)}
                                        onCheckedChange={(checked) => {
                                          const newValue = checked
                                            ? [...(field.value || []), tag.id]
                                            : field.value?.filter(
                                                (id) => id !== tag.id
                                              ) || [];
                                          field.onChange(newValue);
                                        }}
                                      />
                                      <Label
                                        htmlFor={tag.id}
                                        className="cursor-pointer font-normal text-sm"
                                        style={{ color: tag.color }}
                                      >
                                        {tag.name}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </ScrollArea>
                      {field.value && field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((tagId) => {
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
                  );
                }}
              />
            )}
            {errors.tagIds && (
              <p className="text-sm text-destructive">
                {errors.tagIds.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Giới thiệu (HTML)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="<p>Giới thiệu truyện...</p>&#10;<p>Có thể dùng HTML để format</p>"
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Hỗ trợ HTML: &lt;p&gt;, &lt;br&gt;, &lt;strong&gt;, &lt;em&gt;,
              v.v.
            </p>
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
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
