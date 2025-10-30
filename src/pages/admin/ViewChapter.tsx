import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Chapter } from "@/hooks/useManga";

const ViewChapter = () => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
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

  if (!chapter) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Không tìm thấy chương</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="outline" onClick={() => navigate(`/admin/manga-detail/${chapter.manga_id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Chương {chapter.chapter_number}: {chapter.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ngày tạo: {new Date(chapter.created_at).toLocaleDateString('vi-VN')}
            </p>
          </CardHeader>
          <CardContent>
              <div 
                className="prose prose-sm md:prose-base max-w-none dark:prose-invert whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: chapter.content || '' }}
              />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewChapter;
