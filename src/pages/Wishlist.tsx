
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { fetchProductById } from '@/lib/api';
import { Product } from '@/data/products';
import { Loader2, Heart } from 'lucide-react';

const Wishlist = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setIsLoading(true);
      
      try {
        // Get product IDs from localStorage
        const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        if (wishlistIds.length === 0) {
          setWishlistProducts([]);
          setIsLoading(false);
          return;
        }
        
        // Fetch details for each product
        const productsPromises = wishlistIds.map((id: string) => fetchProductById(id));
        const products = await Promise.all(productsPromises);
        
        setWishlistProducts(products);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
        setWishlistProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWishlistProducts();
  }, []);
  
  const clearWishlist = () => {
    localStorage.setItem('wishlist', '[]');
    setWishlistProducts([]);
  };
  
  return (
    <Layout>
      <div className="container py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistProducts.length} items saved for later
            </p>
          </div>
          
          {wishlistProducts.length > 0 && (
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0"
              onClick={clearWishlist}
            >
              Clear Wishlist
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
          </div>
        ) : wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-cream-dark rounded-lg">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-serif mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start exploring our collection and save your favorite items for later.
            </p>
            <Button asChild className="bg-terracotta hover:bg-terracotta-dark">
              <Link to="/">Shop Now</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
