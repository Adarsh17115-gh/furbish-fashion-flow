
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
} from "@/components/ui/dialog";
import { Loader2, Search, Eye, Mail } from 'lucide-react';
import { format } from 'date-fns';

// Sample customer data - in a real app, this would come from your database
const mockCustomers = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma@example.com',
    orders: 5,
    totalSpent: 450,
    lastOrder: new Date(2023, 4, 15),
  },
  {
    id: '2',
    name: 'Michael Smith',
    email: 'michael@example.com',
    orders: 3,
    totalSpent: 320,
    lastOrder: new Date(2023, 5, 22),
  },
  {
    id: '3',
    name: 'Sophia Williams',
    email: 'sophia@example.com',
    orders: 8,
    totalSpent: 780,
    lastOrder: new Date(2023, 6, 10),
  },
  {
    id: '4',
    name: 'James Brown',
    email: 'james@example.com',
    orders: 2,
    totalSpent: 190,
    lastOrder: new Date(2023, 7, 5),
  },
  {
    id: '5',
    name: 'Olivia Davis',
    email: 'olivia@example.com',
    orders: 6,
    totalSpent: 550,
    lastOrder: new Date(2023, 8, 18),
  },
];

const CustomerManager = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);
  const [isLoading] = useState(false); // Simulated loading state
  
  // Filter customers based on search term
  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // View customer details
  const handleViewCustomer = (customer: typeof mockCustomers[0]) => {
    setSelectedCustomer(customer);
  };
  
  // Send email to customer
  const handleSendEmail = (email: string) => {
    // This would integrate with your email service in a real application
    toast({
      title: "Email Action",
      description: `Email would be sent to: ${email}`,
    });
  };
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-serif mb-6">Customer Management</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name or email"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Customers Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden bg-white">
            <Table>
              <TableCaption>List of all customers</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>${customer.totalSpent}</TableCell>
                      <TableCell>{format(customer.lastOrder, 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendEmail(customer.email)}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No customers found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                View detailed information for this customer.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Basic Information</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p>{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p>{selectedCustomer.email}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Order History</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Orders</label>
                    <p>{selectedCustomer.orders}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Spent</label>
                    <p>${selectedCustomer.totalSpent}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Order Date</label>
                    <p>{format(selectedCustomer.lastOrder, 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
              <Button onClick={() => handleSendEmail(selectedCustomer.email)}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default CustomerManager;
