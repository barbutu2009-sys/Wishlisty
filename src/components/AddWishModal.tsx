import { useState, useRef } from "react";
import { WishItem, WishCategory, CATEGORIES } from "@/types/wish";
import { X, Sparkles, Camera, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface AddWishModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: Omit<WishItem, "id" | "createdAt">) => void;
}

const AddWishModal = ({ open, onClose, onAdd }: AddWishModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<WishCategory>("Random");
  const [priority, setPriority] = useState<1 | 2 | 3>(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImageUrl("");
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("wish-images")
      .upload(filePath, file);
    if (error) return null;
    const { data } = supabase.storage
      .from("wish-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    setUploading(true);
    let finalImageUrl = imageUrl.trim() || undefined;

    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (uploaded) finalImageUrl = uploaded;
    }

    onAdd({
      name: name.trim(),
      price: parseFloat(price),
      url: url.trim() || undefined,
      imageUrl: finalImageUrl,
      category,
      priority,
    });

    setName("");
    setPrice("");
    setUrl("");
    setImageUrl("");
    setImageFile(null);
    setImagePreview(null);
    setUploading(false);
    setCategory("Random");
    setPriority(2);
    onClose();
  };

  const categories = CATEGORIES.filter((c) => c !== "All");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-card border shadow-modal p-6 animate-slide-up sm:animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-display text-foreground">Add a New Wish</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="wish-name" className="text-sm font-medium text-foreground">
              Item Name *
            </Label>
            <Input
              id="wish-name"
              placeholder="e.g. Gold Hoop Earrings"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 rounded-xl bg-background"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="wish-price" className="text-sm font-medium text-foreground">
                Price *
              </Label>
              <Input
                id="wish-price"
                placeholder="0.00"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1.5 rounded-xl bg-background"
                required
              />
            </div>
            <div>
              <Label htmlFor="wish-category" className="text-sm font-medium text-foreground">
                Category
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v as WishCategory)}>
                <SelectTrigger id="wish-category" className="mt-1.5 rounded-xl bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <Label className="text-sm font-medium text-foreground">Photo</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="mt-1.5 relative rounded-xl overflow-hidden aspect-[4/3] bg-muted">
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 rounded-full bg-card/80 backdrop-blur-sm p-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="mt-1.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  Upload Image
                </button>
              </div>
            )}
            {!imageFile && (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <ImageIcon className="h-3 w-3" /> or paste an image URL
                </div>
                <Input
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="rounded-xl bg-background"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="wish-url" className="text-sm font-medium text-foreground">
              Link to Buy
            </Label>
            <Input
              id="wish-url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1.5 rounded-xl bg-background"
            />
          </div>

          {/* Priority */}
          <div>
            <Label className="text-sm font-medium text-foreground">Priority</Label>
            <div className="mt-2 flex gap-3">
              {([1, 2, 3] as const).map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setPriority(level)}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium border transition-all duration-200",
                    priority === level
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  )}
                >
                  {Array.from({ length: level }, (_, i) => (
                    <Heart
                      key={i}
                      className="h-3.5 w-3.5"
                      fill={priority === level ? "hsl(var(--primary))" : "none"}
                    />
                  ))}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Add to Wishlist ✨"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWishModal;
