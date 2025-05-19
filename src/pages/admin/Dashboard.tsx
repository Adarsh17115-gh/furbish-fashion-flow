import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, BarChart3, Tag, Image } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllOrders } from '@/lib/api';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const { data: orders } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: fetchAllOrders,
    enabled: !!isAdmin,
  });
  
  if (!isAdmin) {
    return null;
  }
  
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-serif mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Manage your products</p>
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate('/admin/products')}>
                View Products
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Orders awaiting confirmation</p>
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate('/admin/orders')}>
                View Orders
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Manage product categories</p>
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate('/admin/categories')}>
                Manage Categories
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Banners</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Manage promotional banners</p>
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate('/admin/banners')}>
                Manage Banners
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{order.buyer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.product.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total_amount}</p>
                        <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No recent orders</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">Analytics coming soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;