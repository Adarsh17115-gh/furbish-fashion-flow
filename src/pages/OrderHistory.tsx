
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserOrders } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Package, Calendar, Tag } from 'lucide-react';
import { formatDistance } from 'date-fns';

// Map order status to badge variants
const statusVariants: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  confirmed: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  shipped: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  delivered: 'bg-green-100 text-green-800 hover:bg-green-100',
  cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const OrderHistory = () => {
  const { user } = useAuth();
  
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => user ? fetchUserOrders(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  if (!user) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <h1 className="text-3xl font-serif mb-6">Please Login</h1>
          <p>You need to be logged in to view your order history.</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-serif mb-6">My Orders</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-red-500">Error loading your orders. Please try again.</p>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="border rounded-lg overflow-hidden bg-white">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="font-serif text-lg">{order.product.title}</h2>
                      <div className="flex gap-2 items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Ordered {formatDistance(new Date(order.created_at), new Date(), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <Badge className={statusVariants[order.status] || 'bg-gray-100'}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="aspect-square w-full max-w-[200px] relative overflow-hidden rounded-md border">
                        <img 
                          src={
                            order.product.images && order.product.images.length > 0 
                              ? order.product.images[0] 
                              : '/placeholder.svg'
                          }
                          alt={order.product.title}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Order ID</span>
                        <p className="font-mono text-xs">{order.id}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Size</span>
                          <p>{order.size}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Quantity</span>
                          <p>{order.quantity}</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Shipping Address</span>
                        <p className="text-sm">{order.buyer_address}</p>
                      </div>
                      
                      <div className="pt-2">
                        <span className="text-sm font-medium">Total Amount</span>
                        <p className="text-terracotta text-lg font-bold">${order.total_amount}</p>
                      </div>
                    </div>
                  </div>
                  
                  {order.status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-md text-sm">
                      Your payment is being verified. We'll update your order status soon.
                    </div>
                  )}
                  
                  {order.status === 'shipped' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
                      Your order has been shipped! You should receive it in 3-5 business days.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border rounded-lg bg-gray-50">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderHistory;
