
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const OrderHistory = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-serif mb-6">My Orders</h1>
        
        <p className="text-muted-foreground">Order history will be implemented here.</p>
      </div>
    </Layout>
  );
};

export default OrderHistory;
