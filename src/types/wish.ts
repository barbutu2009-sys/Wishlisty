export interface WishItem {
  id: string;
  name: string;
  price: number;
  url?: string;
  imageUrl?: string;
  category: WishCategory;
  priority: 1 | 2 | 3;
  createdAt: number;
}

export type WishCategory = "All" | "Jewelry" | "Clothes" | "Home" | "Experiences" | "Random";

export const CATEGORIES: WishCategory[] = ["All", "Jewelry", "Clothes", "Home", "Experiences", "Random"];
