import { create } from "zustand";
import { Category } from "../types/article";

interface CategoryState {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
  clearSelectedCategory: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category: Category | null) =>
    set({ selectedCategory: category }),
  clearSelectedCategory: () => set({ selectedCategory: null }),
}));
