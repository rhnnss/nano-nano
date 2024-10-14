export interface Category {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Article {
  id?: string;
  title: string;
  content: string;
  slug: string;
  thumbnailUrl: string;
  status: number;
  categoryId: string;
  category?: Category; // Related category object
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
export type ArticleInput = {
  id?: string;
  title: string;
  content: string;
  slug: string;
  thumbnailUrl: string;
  status: number;
  categoryId: string;
  publishedAt: string;
};
