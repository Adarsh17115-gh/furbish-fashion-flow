
import { supabase } from '@/integrations/supabase/client';
import { Product, Order } from '@/types/database';

// Product APIs
export const fetchProducts = async (filters: {
  category?: string;
  featured?: boolean;
  limit?: number;
} = {}) => {
  let query = supabase.from('products')
    .select('*')
    .eq('is_visible', true);
    
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.featured) {
    query = query.eq('is_featured', true);
  }
  
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;

  // Fetch images for each product
  const productsWithImages = await Promise.all((data || []).map(async (product) => {
    const { data: imageList } = await supabase.storage
      .from('product-images')
      .list(product.id.toString());

    const images = imageList
      ? imageList.map(file => 
          `${SUPABASE_URL}/storage/v1/object/public/product-images/${product.id}/${file.name}`
        )
      : [];

    return {
      ...product,
      images: images.length > 0 ? images : ['/placeholder.svg']
    };
  }));
  
  return productsWithImages as Product[];
};

export const fetchProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Fetch images for the product
  const { data: imageList } = await supabase.storage
    .from('product-images')
    .list(id);

  const images = imageList
    ? imageList.map(file => 
        `${SUPABASE_URL}/storage/v1/object/public/product-images/${id}/${file.name}`
      )
    : ['/placeholder.svg'];
  
  return { ...data, images } as Product;
};

// Order APIs
export const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();
  
  if (error) throw error;
  return data as Order;
};

export const fetchUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      product:product_id (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as (Order & { product: Product })[];
};

// Admin only APIs
export const fetchAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      product:product_id (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as (Order & { product: Product })[];
};

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Order;
};

export const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  
  if (error) throw error;
  return data as Product;
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Product;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Helper to upload product images
export const uploadProductImage = async (productId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${productId}/${fileName}`;
  
  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);
  
  if (error) throw error;
  
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${filePath}`;
};

// Helper to upload payment proof
export const uploadPaymentProof = async (orderId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${orderId}_${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('payment-proofs')
    .upload(fileName, file);
  
  if (error) throw error;
  
  return fileName;
};
