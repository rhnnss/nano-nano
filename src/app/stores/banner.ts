import { create } from "zustand";
import { Banner } from "../types/banner";

interface BannerState {
  selectedBanner: Banner | null;
  setSelectedBanner: (banner: Banner | null) => void;
  clearSelectedBanner: () => void;
}

export const useBannerStore = create<BannerState>((set) => ({
  selectedBanner: null,
  setSelectedBanner: (banner: Banner | null) => set({ selectedBanner: banner }),
  clearSelectedBanner: () => set({ selectedBanner: null }),
}));
