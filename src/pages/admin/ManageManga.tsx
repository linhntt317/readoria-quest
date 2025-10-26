import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus } from "lucide-react";

interface Manga {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  tags: string[];
  description: string;
  chapters: any[];
}

const ManageManga = () => {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("manga_list");
    if (stored) {
      setMangaList(JSON.parse(stored));
    }
  }, []);

  const handleAddChapter = (mangaId: string) => {
    navigate(`/admin/add-chapter/${mangaId}`);
  };

  if (mangaList.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có truyện nào</h3>
            <p className="text-muted-foreground mb-4">Hãy thêm truyện mới để bắt đầu quản lý</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Danh sách Truyện</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {mangaList.map((manga) => (
          <Card key={manga.id}>
            <CardHeader>
              <div className="flex gap-4">
                <img 
                  src={manga.imageUrl} 
                  alt={manga.title}
                  className="w-20 h-28 object-cover rounded"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{manga.title}</CardTitle>
                  <CardDescription>{manga.author}</CardDescription>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {manga.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {manga.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {manga.chapters.length} chương
                </span>
                <Button size="sm" onClick={() => handleAddChapter(manga.id)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm chương
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageManga;
