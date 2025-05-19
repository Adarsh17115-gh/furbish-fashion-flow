
import { supabase } from '@/integrations/supabase/client';
import { Order, Product as DatabaseProduct } from '@/types/database';

export const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
  // Ensure the status is properly typed
  const orderWithTypedStatus = {
    ...order,
    status: order.status as Order['status'] // Cast to the proper union type
  };

  const { data, error } = await supabase
    .from('orders')
    .insert(orderWithTypedStatus)
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
  return data as (Order & { product: DatabaseProduct })[];
};

export const fetchAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      product:product_id (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as (Order & { product: DatabaseProduct })[];
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

export const uploadPaymentProof = async (orderId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${orderId}_${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('payment-proofs')
    .upload(fileName, file);
  
  if (error) throw error;
  
  return fileName;
};
