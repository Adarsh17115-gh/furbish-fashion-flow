
export type Product = {
  id: string;
  name: string;
  category: 'women' | 'men' | 'accessories';
  subcategory: string;
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  description: string;
  brand: string;
  condition: 'new' | 'like new' | 'good' | 'fair';
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  featured?: boolean;
  inStock: boolean;
  createdAt: string;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Vintage Denim Jacket',
    category: 'women',
    subcategory: 'outerwear',
    price: 45.99,
    originalPrice: 120.00,
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    ],
    sizes: ['XS', 'S', 'M'],
    colors: ['Blue'],
    description: 'Classic vintage denim jacket in excellent condition. Slightly oversized fit, perfect for layering.',
    brand: 'Levi\'s',
    condition: 'good',
    seller: {
      id: 'seller1',
      name: 'Vintage Finds',
      rating: 4.8
    },
    featured: true,
    inStock: true,
    createdAt: '2025-04-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Cashmere Sweater',
    category: 'women',
    subcategory: 'knitwear',
    price: 65.00,
    originalPrice: 180.00,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842256?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1595431135493-c32c0167f9cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    ],
    sizes: ['M', 'L'],
    colors: ['Cream'],
    description: 'Soft and luxurious cashmere sweater in cream. Only worn a handful of times, still in excellent condition.',
    brand: 'COS',
    condition: 'like new',
    seller: {
      id: 'seller2',
      name: 'LuxuryResale',
      rating: 4.9
    },
    featured: true,
    inStock: true,
    createdAt: '2025-04-20T14:15:00Z'
  },
  {
    id: '3',
    name: 'Leather Oxford Shoes',
    category: 'men',
    subcategory: 'shoes',
    price: 89.00,
    originalPrice: 250.00,
    images: [
      'https://images.unsplash.com/photo-1533681018184-68bd1d883b97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1608571423539-e951a50f8d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    ],
    sizes: ['42', '43', '44'],
    colors: ['Brown'],
    description: 'Classic brown leather Oxford shoes. Resoled once, plenty of life left in them.',
    brand: 'Allen Edmonds',
    condition: 'good',
    seller: {
      id: 'seller3',
      name: 'ClassicMensWear',
      rating: 4.7
    },
    featured: false,
    inStock: true,
    createdAt: '2025-04-05T09:20:00Z'
  },
  {
    id: '4',
    name: 'Silk Blouse',
    category: 'women',
    subcategory: 'tops',
    price: 38.50,
    originalPrice: 90.00,
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    ],
    sizes: ['S', 'M'],
    colors: ['White'],
    description: 'Elegant silk blouse in white. Versatile piece that can be dressed up or down.',
    brand: 'Everlane',
    condition: 'like new',
    seller: {
      id: 'seller4',
      name: 'MinimalistCloset',
      rating: 4.6
    },
    featured: true,
    inStock: true,
    createdAt: '2025-04-18T11:45:00Z'
  },
  {
    id: '5',
    name: 'Canvas Tote Bag',
    category: 'accessories',
    subcategory: 'bags',
    price: 28.00,
    originalPrice: 60.00,
    images: [
      'https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1544816565-aa8c1166648f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    ],
    sizes: ['One Size'],
    colors: ['Natural'],
    description: 'Sturdy canvas tote bag with internal pockets. Perfect for everyday use.',
    brand: 'Baggu',
    condition: 'good',
    seller: {
      id: 'seller5',
      name: 'EcoChic',
      rating: 4.5
    },
    featured: false,
    inStock: true,
    createdAt: '2025-04-10T16:30:00Z'
  },
  {
    id: '6',
    name: 'Wool Blend Coat',
    category: 'women',
    subcategory: 'outerwear',
    price: 110.00,
    originalPrice: 320.00,
    images: [
      'https://images.unsplash.com/photo-1548624313-0fb9b570ab21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    ],
    sizes: ['S', 'M'],
    colors: ['Camel'],
    description: 'Classic camel coat in a wool blend. Timeless style that goes with everything.',
    brand: 'Arket',
    condition: 'like new',
    seller: {
      id: 'seller6',
      name: 'SeasonalEdits',
      rating: 4.9
    },
    featured: true,
    inStock: true,
    createdAt: '2025-04-02T13:15:00Z'
  },
  {
    id: '7',
    name: 'Striped Cotton Shirt',
    category: 'men',
    subcategory: 'shirts',
    price: 29.99,
    originalPrice: 70.00,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Blue/White'],
    description: 'Classic striped cotton shirt. Regular fit with button-down collar.',
    brand: 'J.Crew',
    condition: 'good',
    seller: {
      id: 'seller7',
      name: 'ClassicMensWear',
      rating: 4.7
    },
    featured: false,
    inStock: true,
    createdAt: '2025-04-08T10:00:00Z'
  },
  {
    id: '8',
    name: 'Leather Crossbody Bag',
    category: 'accessories',
    subcategory: 'bags',
    price: 75.00,
    originalPrice: 220.00,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1591561954555-607968c989ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    ],
    sizes: ['One Size'],
    colors: ['Black'],
    description: 'Simple black leather crossbody bag with adjustable strap. Minimal signs of wear.',
    brand: 'Madewell',
    condition: 'like new',
    seller: {
      id: 'seller8',
      name: 'LuxuryResale',
      rating: 4.9
    },
    featured: true,
    inStock: true,
    createdAt: '2025-04-12T15:30:00Z'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
