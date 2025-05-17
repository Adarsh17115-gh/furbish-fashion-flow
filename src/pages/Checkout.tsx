
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Upload, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchProductById, createOrder, uploadPaymentProof } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const Checkout = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? fetchProductById(id) : Promise.reject('No product ID provided'),
    enabled: !!id
  });

  useEffect(() => {
    // If product has sizes and selectedSize isn't set, default to first size
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !product || !selectedSize) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      });
      return;
    }
    
    if (!paymentProof) {
      toast({
        title: "Payment Proof Required",
        description: "Please upload a screenshot of your payment",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create a temporary order ID for the file name
      const tempOrderId = crypto.randomUUID();
      
      // Upload payment proof
      const paymentProofPath = await uploadPaymentProof(tempOrderId, paymentProof);
      
      // Create the order
      const totalAmount = product.price * quantity;
      
      const newOrder = {
        user_id: user.id,
        product_id: product.id,
        quantity: quantity,
        size: selectedSize,
        total_amount: totalAmount,
        buyer_name: buyerName,
        buyer_address: buyerAddress,
        buyer_phone: buyerPhone,
        payment_proof_url: paymentProofPath,
        status: 'pending'
      };
      
      await createOrder(newOrder);
      
      toast({
        title: "Order Placed Successfully",
        description: "We'll update you once your order is confirmed",
      });
      
      setIsCompleted(true);
      
      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
      
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
        </div>
      </Layout>
    );
  }
  
  if (error || !product) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl mb-4">Product Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Layout>
    );
  }
  
  if (isCompleted) {
    return (
      <Layout>
        <div className="container py-12 max-w-md mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-serif mb-4">Order Completed!</h1>
          <p className="mb-6">Your order has been placed successfully. We'll update you once your payment is confirmed.</p>
          <Button onClick={() => navigate('/orders')}>View Your Orders</Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-serif mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.brand && `${product.brand} · `}
                      {product.condition}
                    </p>
                    <p className="text-terracotta font-medium mt-1">${product.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="size">Size</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-md text-sm ${
                            selectedSize === size 
                              ? 'bg-terracotta text-white' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="flex items-center mt-1">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      >
                        -
                      </Button>
                      <span className="mx-4">{quantity}</span>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setQuantity(q => q + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>${(product.price * quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span className="text-terracotta">${(product.price * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-cream rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">Payment Information</h2>
                <div className="mb-4">
                  <p>Please complete your payment using the UPI details below:</p>
                </div>
                
                <div className="bg-white p-4 rounded-md border mb-6 text-center">
                  <div className="mb-4">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png" 
                      alt="Google Pay"
                      className="h-8 mx-auto mb-2"
                    />
                    <p className="font-mono text-lg">furbishstudios@upi</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      After making payment, take a screenshot and upload it below.
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="paymentProof">Upload Payment Screenshot</Label>
                  <div className="mt-1">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <input 
                        type="file" 
                        id="paymentProof" 
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="paymentProof" className="cursor-pointer">
                        {paymentProof ? (
                          <div className="text-green-600 flex flex-col items-center">
                            <Check className="h-8 w-8 mb-2" />
                            <span>{paymentProof.name}</span>
                          </div>
                        ) : (
                          <div className="text-gray-500 flex flex-col items-center">
                            <Upload className="h-8 w-8 mb-2" />
                            <span>Click to upload payment proof</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-cream rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={buyerName} 
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={buyerPhone} 
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Shipping Address</Label>
                    <Textarea 
                      id="address" 
                      value={buyerAddress} 
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      className="mt-1"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-terracotta hover:bg-terracotta-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
