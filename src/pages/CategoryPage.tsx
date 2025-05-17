
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import { getProductsByCategory, Product } from '@/data/products';
import { cn } from '@/lib/utils';

const categoryHeaders = {
  women: {
    title: "Women's Collection",
    description: "Discover quality pre-loved women's fashion at affordable prices",
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  },
  men: {
    title: "Men's Collection",
    description: "Quality second-hand menswear for every style and occasion",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  },
  accessories: {
    title: "Accessories",
    description: "Complete your look with our curated accessories collection",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  }
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const categoryInfo = category && (categoryHeaders[category as keyof typeof categoryHeaders] || {
    title: "Products",
    description: "Browse our collection of quality pre-loved items",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  });
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    setIsLoading(true);
    
    if (category) {
      const items = getProductsByCategory(category);
      setProducts(items);
    } else {
      setProducts([]);
    }
    
    setIsLoading(false);
  }, [category]);
  
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
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <ProductGrid products={products} />
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
