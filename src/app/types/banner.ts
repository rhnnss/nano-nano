export interface Banner {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaUrl: string;
  isActive: number | boolean;
  createdAt?: string;
  updatedAt?: string;
}
