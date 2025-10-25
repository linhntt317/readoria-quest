import { TrendingUp, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

interface TrendingItem {
  rank: number;
  titleKey: string;
  views: string;
  isHot?: boolean;
}

const trendingData: TrendingItem[] = [
  { rank: 1, titleKey: "item1", views: "1.2M", isHot: true },
  { rank: 2, titleKey: "item2", views: "980K", isHot: true },
  { rank: 3, titleKey: "item3", views: "856K", isHot: true },
  { rank: 4, titleKey: "item4", views: "745K" },
  { rank: 5, titleKey: "item5", views: "692K" },
];

export const TrendingSection = () => {
  const { t } = useTranslation();
  
  return (
    <aside className="lg:col-span-1 space-y-6">
      <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">{t.sections.trending}</h2>
        </div>

        <div className="space-y-3">
          {trendingData.map((item) => (
            <div 
              key={item.rank}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              <div 
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  item.rank <= 3 
                    ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30' 
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {item.rank}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {t.manga.trending[item.titleKey as keyof typeof t.manga.trending]}
                </h3>
                <p className="text-xs text-muted-foreground">{item.views} {t.common.views}</p>
              </div>

              {item.isHot && (
                <Flame className="h-4 w-4 text-orange-500 flex-shrink-0 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
        <h3 className="font-bold mb-3">{t.sections.notifications}</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>{t.trending.notification1}</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>{t.trending.notification2}</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>{t.trending.notification3}</span>
          </p>
        </div>
      </Card>
    </aside>
  );
};
