export interface Product {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  buyLink: string;
  isActive: number | boolean;
  createdAt?: string;
  updatedAt?: string;
}
