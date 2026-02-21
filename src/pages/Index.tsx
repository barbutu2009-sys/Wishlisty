import { useState, useEffect, useCallback } from "react";
import { WishItem, WishCategory, SortOption } from "@/types/wish";
import WishlistHeader from "@/components/WishlistHeader";
import CategoryFilter from "@/components/CategoryFilter";
import WishlistCard from "@/components/WishlistCard";
import AddWishModal from "@/components/AddWishModal";
import SortDropdown from "@/components/SortDropdown";
import SurpriseMeButton from "@/components/SurpriseMeButton";
import SurpriseModal from "@/components/SurpriseModal";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [items, setItems] = useState<WishItem[]>([]);
  const [category, setCategory] = useState<WishCategory>("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [isBoyfriendMode, setIsBoyfriendMode] = useState(false);
  const [surpriseItem, setSurpriseItem] = useState<WishItem | null>(null);
  const [name] = useState("My Love");
  const { toast } = useToast();

  // Fetch wishes from database
  useEffect(() => {
    const fetchWishes = async () => {
      const { data, error } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setItems(
          data.map((w) => ({
            id: w.id,
            name: w.name,
            price: Number(w.price),
            url: w.url ?? undefined,
            imageUrl: w.image_url ?? undefined,
            category: w.category as WishCategory,
            priority: w.priority as 1 | 2 | 3,
            notes: w.notes ?? undefined,
            isBought: w.is_bought ?? false,
            createdAt: new Date(w.created_at).getTime(),
          }))
        );
      }
    };

    fetchWishes();

    // Realtime subscription
    const channel = supabase
      .channel("wishes-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wishes" },
        () => {
          fetchWishes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addItem = useCallback(
    async (data: Omit<WishItem, "id" | "createdAt">) => {
      const { error } = await supabase.from("wishes").insert({
        name: data.name,
        price: data.price,
        url: data.url || null,
        image_url: data.imageUrl || null,
        category: data.category,
        priority: data.priority,
        notes: data.notes || null,
        is_bought: false,
      });

      if (error) {
        toast({ title: "Error", description: "Failed to add wish.", variant: "destructive" });
      } else {
        toast({ title: "Wish added! ✨", description: `"${data.name}" has been added to your wishlist.` });
      }
    },
    [toast]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      const { error } = await supabase.from("wishes").delete().eq("id", id);

      if (!error && item) {
        toast({ title: "Wish removed", description: `"${item.name}" has been removed.` });
      }
    },
    [toast, items]
  );

  const toggleBought = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      const newBought = !item.isBought;
      const { error } = await supabase
        .from("wishes")
        .update({ is_bought: newBought })
        .eq("id", id);

      if (!error) {
        toast({
          title: newBought ? "Marked as bought! 🎁" : "Unmarked",
          description: newBought
            ? `"${item.name}" — she'll see a surprise!`
            : `"${item.name}" is no longer marked as bought.`,
        });
      }
    },
    [toast, items]
  );

  // Filter
  const filtered = category === "All" ? items : items.filter((i) => i.category === category);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "priority-desc":
        return b.priority - a.priority;
      case "newest":
      default:
        return b.createdAt - a.createdAt;
    }
  });

  // Surprise me
  const handleSurprise = () => {
    if (sorted.length === 0) return;
    const random = sorted[Math.floor(Math.random() * sorted.length)];
    setSurpriseItem(random);
  };

  return (
    <div className="min-h-screen bg-background">
      <WishlistHeader
        name={name}
        itemCount={items.length}
        onAddClick={() => setModalOpen(true)}
        isBoyfriendMode={isBoyfriendMode}
        onToggleMode={() => setIsBoyfriendMode((v) => !v)}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CategoryFilter active={category} onChange={setCategory} />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((item, i) => (
              <WishlistCard
                key={item.id}
                item={item}
                onDelete={deleteItem}
                onToggleBought={toggleBought}
                isBoyfriendMode={isBoyfriendMode}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <Heart className="h-12 w-12 text-primary/30 mb-4 animate-float" />
            <h2 className="text-xl font-display text-foreground mb-2">No wishes yet</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Tap the "Add New Wish" button to start building your dream list 💫
            </p>
          </div>
        )}
      </main>

      <AddWishModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addItem} />
      <SurpriseMeButton onClick={handleSurprise} disabled={sorted.length === 0} />
      <SurpriseModal item={surpriseItem} onClose={() => setSurpriseItem(null)} />
    </div>
  );
};

export default Index;
