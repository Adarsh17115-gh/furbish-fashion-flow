
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { fetchProductById, createOrder, uploadPaymentProof } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShoppingCart, Upload, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Order } from '@/types/database';

const Checkout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? fetchProductById(id) : Promise.reject('No product ID provided'),
    enabled: !!id,
  });
  
  // Set the first available size as default when product loads
  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);
  
  if (!user) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <h1 className="text-3xl font-serif mb-6">Please Login</h1>
          <p className="mb-6">You need to be logged in to complete checkout.</p>
          <Button onClick={() => navigate('/auth')}>Login / Register</Button>
        </div>
      </Layout>
    );
  }
  
  const totalPrice = product ? quantity * product.price : 0;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !selectedSize || !paymentProof) {
      toast({
        title: "Missing Information",
        description: `Please complete all required fields${!paymentProof ? ', including payment proof' : ''}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // 1. Upload payment proof
      const paymentProofUrl = await uploadPaymentProof(
        `order_${Date.now()}`, // Temporary ID until we have the real order ID
        paymentProof
      );
      
      // 2. Create order
      const orderData = {
        user_id: user.id,
        product_id: product.id,
        quantity,
        size: selectedSize,
        total_amount: totalPrice,
        buyer_name: name,
        buyer_address: address,
        buyer_phone: phone,
        payment_proof_url: paymentProofUrl,
        status: 'pending' as Order['status'], // Type cast to ensure type safety
      };
      
      const order = await createOrder(orderData);
      
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been placed and is pending confirmation. You will be notified once it's confirmed.",
      });
      
      // Redirect to orders page
      navigate('/orders');
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Only allow image files
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file for payment proof",
          variant: "destructive",
        });
        return;
      }
      
      setPaymentProof(file);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
        </div>
      </Layout>
    );
  }
  
  if (error || !product) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <h1 className="text-3xl font-serif mb-6">Product Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-serif mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden bg-white shadow-sm mb-6">
              <div className="p-6">
                <h2 className="text-xl font-serif mb-4">Order Summary</h2>
                
                <div className="flex gap-4 items-start">
                  <div className="aspect-square w-24 h-24 relative overflow-hidden rounded-md border">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'} 
                      alt={product.title} 
                      className="object-cover h-full w-full"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">{product.brand || 'Unbranded'} · Condition: {product.condition}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Label className="text-xs text-muted-foreground">Size:</Label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                              selectedSize === size 
                                ? 'bg-terracotta text-white border-terracotta' 
                                : 'bg-white border-gray-200 hover:border-terracotta'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-4">
                      <Label className="text-xs text-muted-foreground">Quantity:</Label>
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <button 
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        >
                          -
                        </button>
                        <span className="px-4 py-1">{quantity}</span>
                        <button 
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                          onClick={() => setQuantity(prev => prev + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-terracotta font-bold">${product.price.toFixed(2)}</p>
                    {product.original_price && (
                      <p className="text-sm text-muted-foreground line-through">
                        ${product.original_price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                
                <hr className="my-6" />
                
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Instructions */}
            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-serif mb-4">Payment Instructions</h2>
                
                <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-6 flex gap-3">
                  <AlertTriangle className="text-yellow-500 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Payment Required Before Confirmation</p>
                    <p className="text-sm text-yellow-700">Please complete the payment and upload the proof below. Your order will be processed once the payment is verified.</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Payment Method</Label>
                    <p className="text-sm mt-1">UPI Transfer</p>
                  </div>
                  
                  <div>
                    <Label>UPI ID</Label>
                    <div className="flex mt-1">
                      <Input value="furbishstudios@upi" readOnly className="bg-gray-50" />
                      <Button
                        variant="outline"
                        className="ml-2"
                        onClick={() => {
                          navigator.clipboard.writeText("furbishstudios@upi");
                          toast({
                            title: "UPI ID Copied",
                            description: "The UPI ID has been copied to your clipboard.",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Amount to Pay</Label>
                    <p className="text-lg font-bold text-terracotta mt-1">${totalPrice.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="payment_proof" className="block mb-1">Upload Payment Proof</Label>
                    <Input
                      id="payment_proof"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="border-dashed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Please upload a screenshot of your payment confirmation
                    </p>
                  </div>
                  
                  {paymentProof && (
                    <div className="border rounded p-3 bg-gray-50 flex items-center gap-2">
                      <Upload className="h-4 w-4 text-terracotta" />
                      <p className="text-sm truncate">{paymentProof.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Shipping Information */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit}>
              <div className="border rounded-lg overflow-hidden bg-white shadow-sm mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-serif mb-4">Shipping Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Shipping Address</Label>
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                className="w-full bg-terracotta hover:bg-terracotta-dark"
                size="lg"
                disabled={isSubmitting || !selectedSize || !paymentProof}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Place Order
                  </>
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
