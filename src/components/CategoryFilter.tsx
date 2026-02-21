import { WishCategory, CATEGORIES } from "@/types/wish";
import { cn } from "@/lib/utils";
import { Gem, Shirt, Home, Sparkles, Shuffle, LayoutGrid } from "lucide-react";

const categoryIcons: Record<WishCategory, React.ReactNode> = {
  All: <LayoutGrid className="h-3.5 w-3.5" />,
  Jewelry: <Gem className="h-3.5 w-3.5" />,
  Clothes: <Shirt className="h-3.5 w-3.5" />,
  Home: <Home className="h-3.5 w-3.5" />,
  Experiences: <Sparkles className="h-3.5 w-3.5" />,
  Random: <Shuffle className="h-3.5 w-3.5" />,
};

interface CategoryFilterProps {
  active: WishCategory;
  onChange: (cat: WishCategory) => void;
}

const CategoryFilter = ({ active, onChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none px-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            active === cat
              ? "bg-primary text-primary-foreground shadow-card scale-105"
              : "bg-card text-muted-foreground border hover:text-foreground hover:border-primary/30 hover:bg-primary/5"
          )}
        >
          {categoryIcons[cat]}
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
