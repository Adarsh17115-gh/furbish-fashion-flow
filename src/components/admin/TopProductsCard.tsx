
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/database';
import { Product as UIProduct } from '@/data/products';

// Define a type that represents any product (DB or UI)
type AnyProduct = Product | UIProduct;

export const TopProductsCard = () => {
  const navigate = useNavigate();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => fetchProducts({}),
  });
  
  // In a real application, this would be based on order data to find actual top-selling products
  // For now, we'll just display featured products as a placeholder
  const topProducts = products
    ?.filter(product => {
      // Handle both UI and DB product types
      return 'featured' in product ? product.featured : 'is_featured' in product ? product.is_featured : false;
    })
    ?.slice(0, 5) || [];
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
          </div>
        ) : topProducts.length > 0 ? (
          <div className="space-y-4">
            {topProducts.map(product => (
              <div 
                key={product.id} 
                className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                onClick={() => navigate(`/admin/products?edit=${product.id}`)}
              >
                <div className="w-12 h-12 rounded-md overflow-hidden border">
                  <img 
                    src={product.images?.[0] || '/placeholder.svg'} 
                    alt={getProductName(product)} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{getProductName(product)}</h4>
                  <p className="text-xs text-muted-foreground">${product.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{product.category}</p>
                  <p className="text-xs text-muted-foreground capitalize">{getProductCondition(product)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No featured products found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper functions for handling different product types
function getProductName(product: AnyProduct): string {
  if ('name' in product) return product.name;
  if ('title' in product) return product.title;
  return 'Untitled Product';
}

function getProductCondition(product: AnyProduct): string {
  return product.condition || 'New';
}
