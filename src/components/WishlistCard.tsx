import { WishItem } from "@/types/wish";
import { Heart, ExternalLink, Trash2, Gift, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistCardProps {
  item: WishItem;
  onDelete: (id: string) => void;
  onToggleBought: (id: string) => void;
  isBoyfriendMode: boolean;
  index: number;
}

const WishlistCard = ({ item, onDelete, onToggleBought, isBoyfriendMode, index }: WishlistCardProps) => {
  const hearts = Array.from({ length: 3 }, (_, i) => i < item.priority);

  // Girlfriend view: if bought, show wrapped gift
  if (!isBoyfriendMode && item.isBought) {
    return (
      <div
        className="group rounded-2xl border bg-card overflow-hidden shadow-card hover-lift animate-fade-in-up"
        style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
      >
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="rounded-full bg-primary/10 p-4 mb-3">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <p className="font-display text-base font-medium text-card-foreground mb-1">
            Surprise coming! 🎁
          </p>
          <p className="text-xs text-muted-foreground">
            Someone special got this for you
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group rounded-2xl border bg-card overflow-hidden shadow-card hover-lift animate-fade-in-up",
        isBoyfriendMode && item.isBought && "ring-2 ring-green-400/50 bg-green-50/30"
      )}
      style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
    >
      {/* Image (only if provided) */}
      {item.imageUrl ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Priority hearts overlay */}
          <div className="absolute top-3 right-3 flex gap-0.5 rounded-full bg-card/80 backdrop-blur-sm px-2 py-1">
            {hearts.map((filled, i) => (
              <Heart
                key={i}
                className={cn("h-3.5 w-3.5 transition-colors", filled ? "text-primary" : "text-muted-foreground/30")}
                fill={filled ? "hsl(var(--primary))" : "none"}
              />
            ))}
          </div>
          {/* Delete button */}
          <button
            onClick={() => onDelete(item.id)}
            className="absolute top-3 left-3 rounded-full bg-card/80 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        /* No image — show priority hearts and delete inline */
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex gap-0.5">
            {hearts.map((filled, i) => (
              <Heart
                key={i}
                className={cn("h-3.5 w-3.5 transition-colors", filled ? "text-primary" : "text-muted-foreground/30")}
                fill={filled ? "hsl(var(--primary))" : "none"}
              />
            ))}
          </div>
          <button
            onClick={() => onDelete(item.id)}
            className="rounded-full p-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-medium leading-snug text-card-foreground line-clamp-2">
            {item.name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground mb-1 capitalize">{item.category}</p>

        {/* Notes */}
        {item.notes && (
          <p className="text-xs text-muted-foreground/80 italic mb-2 line-clamp-2">
            "{item.notes}"
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-semibold text-foreground font-body">
            ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>

          <div className="flex items-center gap-2">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <ExternalLink className="h-3 w-3" />
                Buy
              </a>
            )}

            {/* Boyfriend mode: mark as bought */}
            {isBoyfriendMode && (
              <button
                onClick={() => onToggleBought(item.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  item.isBought
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-muted text-muted-foreground hover:bg-green-100 hover:text-green-700"
                )}
              >
                <ShoppingBag className="h-3 w-3" />
                {item.isBought ? "Bought ✓" : "Mark Bought"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
