
import { supabase } from '@/integrations/supabase/client';
import { Product as DatabaseProduct } from '@/types/database';
import { adaptDatabaseProductsToUI, adaptDatabaseProductToUI } from '@/lib/adapters';
import { Product as UIProduct } from '@/data/products';

// Define simplified types for storage responses to avoid excessive type recursion
type StorageResponse = {
  data: { name: string }[] | null;
  error: Error | null;
};

export const fetchProducts = async (filters: {
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
} = {}): Promise<UIProduct[]> => {
  let query = supabase.from('products')
    .select('*');
    
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.featured) {
    query = query.eq('is_featured', true);
  }

  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }
  
  if (filters.inStock !== undefined) {
    query = query.eq('is_visible', filters.inStock);
  }
  
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  
  // Apply sorting
  if (filters.sortBy) {
    const direction = filters.sortDirection || 'asc';
    query = query.order(filters.sortBy, { ascending: direction === 'asc' });
  } else {
    // Default sort by created_at (newest first)
    query = query.order('created_at', { ascending: false });
  }
  
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;

  // Fetch images for each product
  const productsWithImages = await Promise.all((data || []).map(async (product) => {
    const storageResponse: StorageResponse = await supabase.storage
      .from('product-images')
      .list(product.id.toString());

    const images = storageResponse.data
      ? storageResponse.data.map(file => 
          `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${product.id}/${file.name}`
        )
      : [];

    return {
      ...product,
      images: images.length > 0 ? images : ['/placeholder.svg']
    };
  }));
  
  // Cast products with defined type to avoid TypeScript recursion
  const dbProducts: DatabaseProduct[] = productsWithImages as DatabaseProduct[];
  return adaptDatabaseProductsToUI(dbProducts);
};

export const fetchProductById = async (id: string): Promise<UIProduct> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  const storageResponse: StorageResponse = await supabase.storage
    .from('product-images')
    .list(id);

  const images = storageResponse.data
    ? storageResponse.data.map(file => 
        `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${id}/${file.name}`
      )
    : ['/placeholder.svg'];
  
  const productWithImages = { ...data, images } as DatabaseProduct;
  return adaptDatabaseProductToUI(productWithImages);
};

export const addProduct = async (productData: Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();
  
  if (error) throw error;
  return data as DatabaseProduct;
};

export const updateProduct = async (id: string, updates: Partial<DatabaseProduct>) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as DatabaseProduct;
};

export const deleteProduct = async (id: string) => {
  // First, delete all images from storage
  const { data: imageList } = await supabase.storage
    .from('product-images')
    .list(id);
  
  if (imageList && imageList.length > 0) {
    const imagePaths = imageList.map(file => `${id}/${file.name}`);
    await supabase.storage
      .from('product-images')
      .remove(imagePaths);
  }
  
  // Then delete the product
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

export const uploadProductImage = async (productId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${productId}/${fileName}`;
  
  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);
  
  if (error) throw error;
  
  return `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${filePath}`;
};

export const deleteProductImage = async (productId: string, imageUrl: string) => {
  // Extract the file name from the URL
  const fileName = imageUrl.split('/').pop();
  if (!fileName) throw new Error("Invalid image URL");
  
  const filePath = `${productId}/${fileName}`;
  
  const { error } = await supabase.storage
    .from('product-images')
    .remove([filePath]);
  
  if (error) throw error;
  return true;
};
