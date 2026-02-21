import { WishItem } from "@/types/wish";
import { X, Heart, ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SurpriseModalProps {
    item: WishItem | null;
    onClose: () => void;
}

const SurpriseModal = ({ item, onClose }: SurpriseModalProps) => {
    if (!item) return null;

    const hearts = Array.from({ length: 3 }, (_, i) => i < item.priority);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-card border shadow-modal overflow-hidden animate-scale-in">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 rounded-full p-2 bg-card/80 backdrop-blur-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Sparkle header */}
                <div className="bg-primary/10 px-6 py-4 text-center">
                    <Sparkles className="h-6 w-6 text-primary mx-auto mb-1" />
                    <p className="text-sm font-medium text-primary">How about this one? ✨</p>
                </div>

                {/* Image */}
                {item.imageUrl && (
                    <div className="aspect-[4/3] overflow-hidden">
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-5">
                    <h3 className="font-display text-lg font-medium text-card-foreground mb-1">
                        {item.name}
                    </h3>

                    <p className="text-sm text-muted-foreground capitalize mb-2">{item.category}</p>

                    {item.notes && (
                        <p className="text-xs text-muted-foreground italic mb-3">"{item.notes}"</p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-semibold text-foreground font-body">
                                ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                            <div className="flex gap-0.5">
                                {hearts.map((filled, i) => (
                                    <Heart
                                        key={i}
                                        className={cn("h-3.5 w-3.5", filled ? "text-primary" : "text-muted-foreground/30")}
                                        fill={filled ? "hsl(var(--primary))" : "none"}
                                    />
                                ))}
                            </div>
                        </div>

                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                <ExternalLink className="h-3 w-3" />
                                Buy
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurpriseModal;
