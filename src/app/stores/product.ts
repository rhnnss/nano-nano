import { create } from "zustand";
import { Product } from "../types/product";

interface ProductState {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  clearSelectedProduct: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product: Product | null) =>
    set({ selectedProduct: product }),
  clearSelectedProduct: () => set({ selectedProduct: null }),
}));
