
import { supabase } from '@/integrations/supabase/client';
import { Product as DatabaseProduct, Order } from '@/types/database';
import { adaptDatabaseProductsToUI, adaptDatabaseProductToUI } from '@/lib/adapters';
import { Product as UIProduct } from '@/data/products';

// Define simplified types for storage responses to avoid excessive type recursion
type StorageResponse = {
  data: { name: string }[] | null;
  error: Error | null;
};

// Re-export functions from individual API files
export * from './api/productApi';
export * from './api/orderApi';

// Note: This file will be deprecated in favor of modular API files
