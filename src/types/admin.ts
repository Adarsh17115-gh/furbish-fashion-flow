
import { Product as DatabaseProduct } from '@/types/database';
import { Product as UIProduct } from '@/data/products';

// Union type for products that can be displayed in admin interfaces
export type AdminProduct = DatabaseProduct | UIProduct;

export interface ProductFilter {
  category?: string;
  subcategory?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductStock {
  id: string;
  name: string;
  inStock: boolean;
  lowStock?: boolean;
  stockLevel?: number;
}

export interface SalesData {
  date: string;
  amount: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}
