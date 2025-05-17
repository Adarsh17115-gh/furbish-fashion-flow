
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAllOrders, updateOrderStatus } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Eye, Info, Download, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Map order status to badge variants
const statusBadgeVariants: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  confirmed: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  shipped: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  delivered: 'bg-green-100 text-green-800 hover:bg-green-100',
  cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const OrderManager = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [viewingPaymentProof, setViewingPaymentProof] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchAllOrders,
    enabled: !!isAdmin
  });
  
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });
      
      // Refresh orders data
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };
  
  const filteredOrders = orders && statusFilter
    ? orders.filter(order => order.status === statusFilter)
    : orders;
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif">Order Manager</h1>
          
          <div className="flex gap-4">
            <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
          </div>
        ) : filteredOrders && filteredOrders.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                          {order.product.images && order.product.images[0] ? (
                            <img 
                              src={order.product.images[0]} 
                              alt={order.product.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm truncate max-w-[180px]">
                          {order.product.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{order.buyer_name}</TableCell>
                    <TableCell>
                      {order.created_at && format(new Date(order.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>${order.total_amount}</TableCell>
                    <TableCell>
                      <Badge className={statusBadgeVariants[order.status] || 'bg-gray-100'}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setViewingPaymentProof(false);
                          }}
                        >
                          <Info className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                        
                        {order.payment_proof_url && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setViewingPaymentProof(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Payment</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-12 text-center border rounded-lg bg-gray-50">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {statusFilter 
                ? `There are no orders with status "${statusFilter}"`
                : "There are no orders in the system yet"}
            </p>
          </div>
        )}
        
        {/* Order Detail Dialog */}
        {selectedOrder && !viewingPaymentProof && (
          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>
                  Order ID: {selectedOrder.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        {selectedOrder.product.images && selectedOrder.product.images[0] ? (
                          <img 
                            src={selectedOrder.product.images[0]} 
                            alt={selectedOrder.product.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedOrder.product.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedOrder.product.brand && `${selectedOrder.product.brand} · `}
                          {selectedOrder.product.condition}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Size</span>
                        <p>{selectedOrder.size}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Quantity</span>
                        <p>{selectedOrder.quantity}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Total Amount</span>
                      <p className="text-lg font-medium">${selectedOrder.total_amount}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Name</span>
                      <p>{selectedOrder.buyer_name}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <p>{selectedOrder.buyer_phone}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Shipping Address</span>
                      <p>{selectedOrder.buyer_address}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Update Order Status</h3>
                <div className="flex gap-4">
                  <Select 
                    defaultValue={selectedOrder.status}
                    onValueChange={(value) => handleStatusChange(selectedOrder.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
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
                  
                  {selectedOrder.payment_proof_url && (
                    <Button 
                      variant="outline"
                      onClick={() => setViewingPaymentProof(true)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Payment Proof
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Payment Proof Dialog */}
        {selectedOrder && viewingPaymentProof && (
          <Dialog open={viewingPaymentProof} onOpenChange={() => setViewingPaymentProof(false)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Payment Proof</DialogTitle>
                <DialogDescription>
                  Uploaded by {selectedOrder.buyer_name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-2">
                {selectedOrder.payment_proof_url ? (
                  <div className="flex flex-col items-center">
                    <div className="border rounded-lg overflow-hidden max-h-[400px]">
                      <img 
                        src={`${supabase.supabaseUrl}/storage/v1/object/public/payment-proofs/${selectedOrder.payment_proof_url}`} 
                        alt="Payment proof" 
                        className="max-w-full h-auto"
                      />
                    </div>
                    <Button 
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        window.open(
                          `${supabase.supabaseUrl}/storage/v1/object/public/payment-proofs/${selectedOrder.payment_proof_url}`, 
                          '_blank'
                        );
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Image
                    </Button>
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">No payment proof uploaded</p>
                )}
              </div>
              
              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={() => setViewingPaymentProof(false)}>
                  Back to Details
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, 'confirmed');
                      setViewingPaymentProof(false);
                    }}
                  >
                    Confirm Payment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default OrderManager;
