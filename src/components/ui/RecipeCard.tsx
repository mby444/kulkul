import React from 'react';
import Image from 'next/image';
import { Clock, ChefHat, Tag } from 'lucide-react';
import { Button } from './Button';

type RecipeCardProps = {
  id: string;
  title: string;
  description: string;
  prepTime: number;
  difficulty: string;
  ingredientCount: number;
  tags: string[];
  imageUrl?: string;
  onCookClick: (id: string) => void;
};

export const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  description,
  prepTime,
  difficulty,
  ingredientCount,
  tags,
  imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
  onCookClick
}) => {
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Image Area */}
      <div className="relative w-full h-48 bg-primary/5">
        <Image 
          src={imageUrl} 
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Clock size={12} className="text-secondary" />
          <span className="text-[10px] font-bold text-text-main">{prepTime} Menit</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg text-text-main leading-tight">{title}</h3>
          <div className="bg-accent/20 text-[#D97706] text-[10px] font-bold px-2 py-1 rounded-full flex shrink-0 items-center gap-1">
            <ChefHat size={12} />
            {difficulty}
          </div>
        </div>

        <p className="text-text-muted text-xs leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="text-[10px] font-medium bg-black/5 text-text-muted px-2 py-1 rounded-md flex items-center gap-1">
            <Tag size={10} />
            {ingredientCount} Bahan
          </div>
          {tags.slice(0, 3).map((tag, idx) => (
            <div key={idx} className="text-[10px] font-medium bg-secondary/10 text-secondary px-2 py-1 rounded-md">
              {tag}
            </div>
          ))}
        </div>

        <div className="mt-auto pt-2 border-t border-border">
          <Button fullWidth onClick={() => onCookClick(id)}>
            Mulai Masak Ini
          </Button>
        </div>
      </div>
    </div>
  );
};
