
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const OrderManager = () => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-serif mb-6">Order Manager</h1>
        
        <p className="text-muted-foreground">Order management interface will be implemented here.</p>
      </div>
    </Layout>
  );
};

export default OrderManager;
