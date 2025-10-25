import { Eye, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MangaCardProps {
  image: string;
  title: string;
  chapter?: string;
  views?: string;
  rating?: number;
  isNew?: boolean;
}

export const MangaCard = ({ 
  image, 
  title, 
  chapter, 
  views, 
  rating,
  isNew 
}: MangaCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 cursor-pointer animate-fade-in">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {isNew && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground border-0 shadow-lg">
            MỚI
          </Badge>
        )}

        {rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-white">{rating}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {chapter && (
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-sm font-medium text-white">{chapter}</p>
            {views && (
              <div className="flex items-center gap-1 text-xs text-white/80 mt-1">
                <Eye className="h-3 w-3" />
                <span>{views}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
      </div>
    </Card>
  );
};
