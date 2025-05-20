
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProductName, getProductFeatured } from '@/lib/adapters';

export const TopProductsCard = () => {
  const navigate = useNavigate();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => fetchProducts({}),
  });
  
  // Simulate top products (in a real app you would have actual sales data)
  const topProducts = products
    ?.filter(product => getProductFeatured(product))
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
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="font-medium">${product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No top products data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
