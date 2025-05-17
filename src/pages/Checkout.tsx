
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'react-router-dom';

const Checkout = () => {
  const { user } = useAuth();
  const { id } = useParams();
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-serif mb-6">Checkout</h1>
        
        <p className="text-muted-foreground">Checkout page for product ID: {id} will be implemented here.</p>
      </div>
    </Layout>
  );
};

export default Checkout;
