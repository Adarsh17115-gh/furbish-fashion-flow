
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAllOrders, updateOrderStatus } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, EyeIcon, FileCheck } from 'lucide-react';
import { formatDistance, format } from 'date-fns';
import { Order } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Map order status to badge variants
const statusVariants: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  confirmed: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  shipped: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  delivered: 'bg-green-100 text-green-800 hover:bg-green-100',
  cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const OrderManager = () => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order & { product: any } | null>(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch all orders
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: fetchAllOrders,
    enabled: !!isAdmin,
  });
  
  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: Order['status'] }) => {
      return updateOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast({
        title: "Order Updated",
        description: "The order status has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating the order status.",
        variant: "destructive",
      });
    },
  });
  
  // Filter orders based on search term and status filter
  const filteredOrders = orders ? orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }) : [];
  
  // Handle order detail view
  const handleViewOrder = async (order: Order & { product: any }) => {
    setSelectedOrder(order);
    
    // Reset the payment proof URL
    setPaymentProofUrl(null);
    
    // If there's a payment proof URL, generate a viewable URL
    if (order.payment_proof_url) {
      try {
        const { data } = await supabase.storage
          .from('payment-proofs')
          .createSignedUrl(order.payment_proof_url, 60); // URL valid for 60 seconds
        
        setPaymentProofUrl(data?.signedUrl || null);
      } catch (error) {
        console.error('Error generating payment proof URL:', error);
      }
    }
  };
  
  // Handle status update
  const handleStatusChange = (status: string, orderId: string) => {
    // Cast the status to the appropriate type
    updateOrderMutation.mutate({ 
      id: orderId, 
      status: status as Order['status'] 
    });
  };
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-serif mb-6">Order Management</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer name, or product"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Orders Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-red-500">Error loading orders. Please try again.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden bg-white">
            <Table>
              <TableCaption>Total {filteredOrders.length} orders found</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>{order.product.title}</TableCell>
                      <TableCell>{order.buyer_name}</TableCell>
                      <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>${order.total_amount}</TableCell>
                      <TableCell>
                        <Badge className={statusVariants[order.status] || 'bg-gray-100'}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewOrder(order)}
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No orders found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Order ID: {selectedOrder.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Product Information</h3>
                <div className="border rounded-md p-4 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="aspect-square w-20 h-20 relative overflow-hidden rounded-md border">
                      <img 
                        src={
                          selectedOrder.product.images && selectedOrder.product.images.length > 0 
                            ? selectedOrder.product.images[0] 
                            : '/placeholder.svg'
                        }
                        alt={selectedOrder.product.title}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{selectedOrder.product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {selectedOrder.size} · Qty: {selectedOrder.quantity}
                      </p>
                      <p className="font-medium text-terracotta mt-1">
                        ${selectedOrder.total_amount}
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Customer Information</h3>
                <div className="border rounded-md p-4 space-y-3">
                  <div>
                    <Label>Name</Label>
                    <p>{selectedOrder.buyer_name}</p>
                  </div>
                  
                  <div>
                    <Label>Phone</Label>
                    <p>{selectedOrder.buyer_phone}</p>
                  </div>
                  
                  <div>
                    <Label>Shipping Address</Label>
                    <p className="whitespace-pre-wrap">{selectedOrder.buyer_address}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Order Status</h3>
                <div className="border rounded-md p-4 space-y-4">
                  <div>
                    <Label htmlFor="status">Current Status</Label>
                    <Select 
                      defaultValue={selectedOrder.status} 
                      onValueChange={(value) => handleStatusChange(value, selectedOrder.id)}
                    >
                      <SelectTrigger id="status" className="mt-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Order Date</Label>
                    <p>{format(new Date(selectedOrder.created_at), 'PPP p')}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistance(new Date(selectedOrder.created_at), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Payment Proof</h3>
                <div className="border rounded-md p-4">
                  {selectedOrder.payment_proof_url ? (
                    paymentProofUrl ? (
                      <div className="space-y-3">
                        <a 
                          href={paymentProofUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block w-full aspect-square border rounded-md overflow-hidden"
                        >
                          <img 
                            src={paymentProofUrl} 
                            alt="Payment proof" 
                            className="w-full h-full object-cover"
                          />
                        </a>
                        <Button variant="outline" className="w-full" asChild>
                          <a href={paymentProofUrl} target="_blank" rel="noopener noreferrer">
                            <FileCheck className="w-4 h-4 mr-2" />
                            View Full Image
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
                      </div>
                    )
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No payment proof uploaded yet
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default OrderManager;
