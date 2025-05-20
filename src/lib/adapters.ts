
import { Product as DatabaseProduct } from '@/types/database';
import { Product as UIProduct } from '@/data/products';
import { AdminProduct } from '@/types/admin';

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

/**
 * Helper function to get a consistent product name regardless of product type
 */
export const getProductName = (product: DatabaseProduct | UIProduct | AdminProduct): string => {
  if ('name' in product) return product.name;
  if ('title' in product) return product.title;
  return 'Untitled Product';
};

/**
 * Helper function to get original price regardless of product type
 */
export const getProductOriginalPrice = (product: DatabaseProduct | UIProduct | AdminProduct): string => {
  if ('originalPrice' in product && product.originalPrice) return product.originalPrice.toString();
  if ('original_price' in product && product.original_price) return product.original_price.toString();
  return '';
};

/**
 * Helper function to get product visibility status
 */
export const getProductVisibility = (product: DatabaseProduct | UIProduct | AdminProduct): boolean => {
  if ('inStock' in product) return product.inStock;
  if ('is_visible' in product) return product.is_visible;
  return true;
};

/**
 * Helper function to check if a product is featured
 */
export const getProductFeatured = (product: DatabaseProduct | UIProduct | AdminProduct): boolean => {
  if ('featured' in product) return product.featured;
  if ('is_featured' in product) return product.is_featured;
  return false;
};
