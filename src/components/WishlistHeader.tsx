import { Heart, Plus } from "lucide-react";

interface WishlistHeaderProps {
  name: string;
  itemCount: number;
  onAddClick: () => void;
}

const WishlistHeader = ({ name, itemCount, onAddClick }: WishlistHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-primary animate-float" fill="hsl(var(--primary))" />
          <div>
            <h1 className="text-xl sm:text-2xl tracking-tight text-foreground">{name}'s Wishlist</h1>
            <p className="text-xs text-muted-foreground font-body">
              {itemCount} {itemCount === 1 ? "wish" : "wishes"} ✨
            </p>
          </div>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-200 hover:shadow-card-hover hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add New Wish</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
};

export default WishlistHeader;
