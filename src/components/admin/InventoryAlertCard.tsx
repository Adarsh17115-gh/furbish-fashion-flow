
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InventoryAlertCard = () => {
  const navigate = useNavigate();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => fetchProducts({}),
  });
  
  // Simulate low stock products for now
  // In a real application, you would track inventory levels
  const lowStockProducts = products
    ?.filter((_, index) => index % 3 === 0) // Just a placeholder logic
    ?.slice(0, 5) || [];
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
          </div>
        ) : lowStockProducts.length > 0 ? (
          <div className="space-y-4">
            {lowStockProducts.map(product => (
              <div 
                key={product.id} 
                className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                onClick={() => navigate(`/admin/products?edit=${product.id}`)}
              >
                <div className="w-12 h-12 rounded-md overflow-hidden border">
                  <img 
                    src={product.images?.[0] || '/placeholder.svg'} 
                    alt={product.name || product.title || 'Product'}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{product.name || product.title || 'Untitled Product'}</h4>
                  <div className="flex gap-1 mt-1">
                    {product.sizes && product.sizes.map(size => (
                      <Badge key={size} variant="outline" className="text-xs py-0 h-5">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge variant="destructive" className="bg-red-100 hover:bg-red-100 text-red-800">
                  Low Stock
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No low stock alerts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
