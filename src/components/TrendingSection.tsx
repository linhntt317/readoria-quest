import { TrendingUp, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TrendingItem {
  rank: number;
  title: string;
  views: string;
  isHot?: boolean;
}

const trendingData: TrendingItem[] = [
  { rank: 1, title: "Chàng Là Huynh Đệ Ta", views: "1.2M", isHot: true },
  { rank: 2, title: "Chiếm Lấy Người Đẹp Mê Hồn", views: "980K", isHot: true },
  { rank: 3, title: "Khẩu Lại Vết Thương", views: "856K", isHot: true },
  { rank: 4, title: "Kiếm Soát Em Tuyệt Đối", views: "745K" },
  { rank: 5, title: "Quyền Rũ Thái Tử Bệnh Kiêu", views: "692K" },
];

export const TrendingSection = () => {
  return (
    <aside className="lg:col-span-1 space-y-6">
      <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Top Trending</h2>
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
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground">{item.views} lượt xem</p>
              </div>

              {item.isHot && (
                <Flame className="h-4 w-4 text-orange-500 flex-shrink-0 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
        <h3 className="font-bold mb-3">Thông Báo</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Cập nhật 50 truyện mới hôm nay</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Sự kiện đọc truyện tháng 10</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Hệ thống bảo trì 2h sáng mai</span>
          </p>
        </div>
      </Card>
    </aside>
  );
};
