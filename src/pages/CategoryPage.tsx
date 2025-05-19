
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import { fetchProducts } from '@/lib/api';
import { Product } from '@/types/database';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categoryHeaders = {
  women: {
    title: "Women's Collection",
    description: "Discover quality pre-loved women's fashion at affordable prices",
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  },
  'women/tops': {
    title: "Women's Tops",
    description: "Stylish pre-loved tops, blouses, and shirts",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  },
  'women/dresses': {
    title: "Women's Dresses",
    description: "Beautiful pre-loved dresses for every occasion",
    image: "https://images.unsplash.com/photo-1623118171847-401789d5062d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  },
  'women/outerwear': {
    title: "Women's Outerwear",
    description: "Quality pre-loved jackets, coats and more",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  },
  'women/accessories': {
    title: "Women's Accessories",
    description: "Complete your look with pre-loved accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  },
  watches: {
    title: "Vintage Watches",
    description: "Timeless elegance with our curated watch collection",
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  },
  'watches/women': {
    title: "Women's Watches",
    description: "Elegant and sophisticated timepieces for women",
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  },
  'watches/men': {
    title: "Men's Watches",
    description: "Classic and sophisticated timepieces for men",
    image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  },
  'watches/luxury': {
    title: "Luxury Watch Collection",
    description: "Premium and collector's vintage watches",
    image: "https://images.unsplash.com/photo-1568141579578-9c6c0bc5bc60?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  },
};

const CategoryPage = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory: string }>();
  const [sortBy, setSortBy] = useState<string>('newest');
  
  const fullCategory = subcategory ? `${category}/${subcategory}` : category;
  
  const categoryInfo = fullCategory && (categoryHeaders[fullCategory as keyof typeof categoryHeaders] || 
                      (category && categoryHeaders[category as keyof typeof categoryHeaders])) || {
    title: "Products",
    description: "Browse our collection of quality pre-loved items",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  };
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', category, subcategory, sortBy],
    queryFn: async () => {
      try {
        // Determine the API filter based on the category and subcategory
        let filters: any = {};
        
        if (category === 'women' && !subcategory) {
          // All women's clothing
          filters.category = 'women';
        } else if (category === 'women' && subcategory) {
          // Specific women's subcategory (tops, dresses, etc.)
          filters.category = 'women';
          filters.subcategory = subcategory;
        } else if (category === 'watches' && !subcategory) {
          // All watches
          filters.category = 'watches';
        } else if (category === 'watches' && subcategory) {
          // Specific watch subcategory (women, men, luxury)
          filters.category = 'watches';
          filters.subcategory = subcategory;
        }
        
        return await fetchProducts(filters);
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
    }
  });
  
  // Sort products based on the selected option
  const sortedProducts = products ? [...products].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    } else if (sortBy === 'price-high') {
      return b.price - a.price;
    } else {
      // Default to newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  }) : [];
  
  useEffect(() => {
    // Scroll to top on page load or category change
    window.scrollTo(0, 0);
  }, [category, subcategory]);
  
  return (
    <Layout>
      {/* Category Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={categoryInfo?.image} 
          alt={categoryInfo?.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <h1 className="text-3xl md:text-4xl font-serif mb-4">{categoryInfo?.title}</h1>
            <p className="text-white/80">{categoryInfo?.description}</p>
          </div>
        </div>
      </div>
      
      <div className="container py-12">
        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-serif">
            {products && products.length > 0 ? `${products.length} items` : 'Products'}
          </h2>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
          </div>
        ) : (
          <>
            {sortedProducts.length > 0 ? (
              <ProductGrid products={sortedProducts} />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-serif mb-4">No products found</h2>
                <p className="text-muted-foreground">
                  We don't have any products in this category at the moment.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
