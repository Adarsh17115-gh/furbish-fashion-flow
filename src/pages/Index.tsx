
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import CustomFeaturedCategories from '@/components/CustomFeaturedCategories';
import ProductGrid from '@/components/ProductGrid';
import { fetchProducts } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { data: womenFeaturedProducts, isLoading: womenLoading } = useQuery({
    queryKey: ['products', 'women', 'featured'],
    queryFn: () => fetchProducts({ category: 'women', featured: true, limit: 4 })
  });
  
  const { data: watchesFeaturedProducts, isLoading: watchesLoading } = useQuery({
    queryKey: ['products', 'watches', 'featured'],
    queryFn: () => fetchProducts({ category: 'watches', featured: true, limit: 4 })
  });

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Hero />
      
      <div className="container">
        <CustomFeaturedCategories />
        
        {womenLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
          </div>
        ) : (
          <ProductGrid 
            products={womenFeaturedProducts || []} 
            title="Featured Women's Fashion" 
            className="py-12 md:py-16"
          />
        )}
        
        {watchesLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
          </div>
        ) : (
          <ProductGrid 
            products={watchesFeaturedProducts || []} 
            title="Featured Vintage Watches" 
            className="py-12 md:py-16"
          />
        )}
        
        <section className="py-12 md:py-16 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl font-serif">Why FurbishStudios?</h2>
            <p className="text-muted-foreground">
              At FurbishStudios, we're passionate about giving pre-loved clothing and vintage watches a second life. 
              Our platform connects fashion lovers with unique, high-quality pieces at a fraction 
              of their original price, helping reduce fashion waste while keeping you stylish.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 border rounded-lg bg-cream">
              <h3 className="font-serif text-xl mb-3">Sustainable Fashion</h3>
              <p className="text-muted-foreground">Each pre-loved item purchased reduces fashion waste and extends the lifecycle of quality pieces.</p>
            </div>
            <div className="p-6 border rounded-lg bg-cream">
              <h3 className="font-serif text-xl mb-3">Curated Selection</h3>
              <p className="text-muted-foreground">We carefully verify each item to ensure quality, authenticity, and style that stands the test of time.</p>
            </div>
            <div className="p-6 border rounded-lg bg-cream">
              <h3 className="font-serif text-xl mb-3">Simple Process</h3>
              <p className="text-muted-foreground">From browsing to checkout, we've made the entire experience seamless, secure and hassle-free.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
