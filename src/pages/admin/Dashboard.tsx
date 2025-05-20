
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, Users, Percent, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllOrders, fetchProducts } from '@/lib/api';
import { InventoryAlertCard } from '@/components/admin/InventoryAlertCard';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { TopProductsCard } from '@/components/admin/TopProductsCard';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  // Fetch orders and products data
  const { data: orders } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: fetchAllOrders,
    enabled: !!isAdmin,
  });
  
  const { data: products } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => fetchProducts({}),
    enabled: !!isAdmin,
  });
  
  if (!isAdmin) {
    return null;
  }
  
  // Calculate some metrics for the dashboard
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const totalProducts = products?.length || 0;
  const lowStockProducts = products?.filter(product => 
    // Assuming we consider low stock as less than 5 items
    // Note: This is a placeholder - we'll need to add inventory tracking
    product.featured === false
  ).length || 0;
  
  const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
  
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
              <div className="text-2xl font-bold">{totalProducts}</div>
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
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Manage your customers</p>
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate('/admin/customers')}>
                View Customers
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Discounts</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Manage promotional offers</p>
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate('/admin/discounts')}>
                View Discounts
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Revenue Overview</CardTitle>
                <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
                  <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <RevenueChart timeframe={timeframe} />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TopProductsCard />
          <InventoryAlertCard />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
