
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const ProductManager = () => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif">Product Manager</h1>
          <Button>Add New Product</Button>
        </div>
        
        <p className="text-muted-foreground">Product management interface will be implemented here.</p>
      </div>
    </Layout>
  );
};

export default ProductManager;
