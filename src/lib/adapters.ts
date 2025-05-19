
import { Product as DatabaseProduct } from '@/types/database';
import { Product as UIProduct } from '@/data/products';

/**
 * Converts a database product to the UI product format
 */
export const adaptDatabaseProductToUI = (product: DatabaseProduct): UIProduct => {
  return {
    id: product.id,
    name: product.title,
    category: product.category.includes('women') ? 'women' : 
              product.category.includes('watches') ? 'accessories' : 'accessories',
    subcategory: product.category.split('/')[1] || '',
    price: product.price,
    originalPrice: product.original_price || undefined,
    images: product.images || ['/placeholder.svg'],
    sizes: product.sizes || [],
    colors: [], // Default empty as DB doesn't store colors
    description: product.description || '',
    brand: product.brand || 'Unknown',
    condition: (product.condition as 'new' | 'like new' | 'good' | 'fair') || 'good',
    seller: {
      id: product.seller_id || 'seller1',
      name: product.seller_info?.name as string || 'FurbishStudios',
      rating: (product.seller_info?.rating as number) || 5.0
    },
    featured: product.is_featured || false,
    inStock: product.is_visible || false,
    createdAt: product.created_at || new Date().toISOString()
  };
};

/**
 * Converts an array of database products to UI product format
 */
export const adaptDatabaseProductsToUI = (products: DatabaseProduct[]): UIProduct[] => {
  return products.map(adaptDatabaseProductToUI);
};
