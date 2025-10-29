import { TrendingUp, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { useManga } from "@/hooks/useManga";
import { Link } from "react-router-dom";

export const TrendingSection = () => {
  const { t } = useTranslation();
  const { data: mangaList } = useManga();
  
  const trending = mangaList?.slice().sort((a, b) => b.views - a.views).slice(0, 5) || [];
  
  return (
    <aside className="lg:col-span-1 space-y-6">
      <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">{t.sections.trending}</h2>
        </div>

        <div className="space-y-3">
          {trending.map((manga, index) => {
            const rank = index + 1;
            return (
              <Link 
                key={manga.id}
                to={`/truyen/${manga.id}`}
              >
                <div 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
                >
                <div 
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    rank <= 3 
                      ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30' 
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {rank}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {manga.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{manga.views.toLocaleString()} {t.common.views}</p>
                </div>

                {rank <= 3 && (
                  <Flame className="h-4 w-4 text-orange-500 flex-shrink-0 animate-pulse" />
                )}
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
        <h3 className="font-bold mb-3">{t.sections.notifications}</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>{mangaList?.length || 0} truyện đang có trên hệ thống</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Cập nhật liên tục mỗi ngày</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Đọc truyện miễn phí 100%</span>
          </p>
        </div>
      </Card>
    </aside>
  );
};
