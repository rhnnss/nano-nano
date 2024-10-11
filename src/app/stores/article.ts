import { create } from "zustand";
import { Article } from "../types/article";

interface ArticleState {
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
  clearSelectedArticle: () => void;
}

export const useArticleStore = create<ArticleState>((set) => ({
  selectedArticle: null,
  setSelectedArticle: (article: Article | null) =>
    set({ selectedArticle: article }),
  clearSelectedArticle: () => set({ selectedArticle: null }),
}));
