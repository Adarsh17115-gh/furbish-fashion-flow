
import { Product as DatabaseProduct } from '@/types/database';
import { Product as UIProduct } from '@/data/products';

// Combined product type for admin interfaces
export type AdminProduct = DatabaseProduct | UIProduct;

// Discount type definition
export interface Discount {
  id: string;
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number; 
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

// Form type for discount creation/editing
export interface DiscountFormData {
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  minPurchase: number;
  maxUses: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}
