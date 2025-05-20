
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TopProductsCard = () => {
  const navigate = useNavigate();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => fetchProducts({}),
  });
  
  // In a real application, this would be based on order data to find actual top-selling products
  // For now, we'll just display featured products as a placeholder
  const topProducts = products
    ?.filter(product => product.featured || product.is_featured)
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
                    alt={product.name || product.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{product.name || product.title}</h4>
                  <p className="text-xs text-muted-foreground">${product.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{product.category}</p>
                  <p className="text-xs text-muted-foreground capitalize">{product.condition}</p>
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
