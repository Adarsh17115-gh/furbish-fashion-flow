
export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  sizes: string[];
  category: string;
  brand: string | null;
  condition: string;
  is_visible: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  seller_id: string | null;
  seller_info: {
    name: string;
    rating: number;
  };
  images?: string[]; // For frontend use, not stored in DB
}

export interface Order {
  id: string;
  user_id: string | null;
  product_id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  quantity: number;
  size: string;
  total_amount: number;
  payment_proof_url: string | null;
  buyer_name: string;
  buyer_address: string;
  buyer_phone: string;
  created_at: string;
  updated_at: string;
  product?: Product; // For joined queries
}

export interface AppUser {
  id: string;
  email: string;
  role: 'admin' | 'buyer';
}
