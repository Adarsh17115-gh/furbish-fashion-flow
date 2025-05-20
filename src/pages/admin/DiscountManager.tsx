
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { format } from 'date-fns';

// Define form validation schema
const discountFormSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().min(0, "Value must be at least 0"),
  minPurchase: z.coerce.number().min(0, "Min purchase must be at least 0").optional(),
  maxUses: z.coerce.number().int().min(0, "Max uses must be at least 0").optional(),
  startDate: z.string(),
  endDate: z.string(),
  isActive: z.boolean().default(true),
});

type DiscountFormValues = z.infer<typeof discountFormSchema>;

// Sample discount data
const mockDiscounts = [
  {
    id: '1',
    code: 'SUMMER25',
    type: 'percentage',
    value: 25,
    minPurchase: 100,
    maxUses: 1000,
    usedCount: 456,
    startDate: new Date(2023, 5, 1),
    endDate: new Date(2023, 8, 31),
    isActive: true,
  },
  {
    id: '2',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minPurchase: 0,
    maxUses: null,
    usedCount: 789,
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 11, 31),
    isActive: true,
  },
  {
    id: '3',
    code: 'FREESHIP',
    type: 'fixed',
    value: 15,
    minPurchase: 75,
    maxUses: 500,
    usedCount: 320,
    startDate: new Date(2023, 3, 15),
    endDate: new Date(2023, 6, 15),
    isActive: false,
  },
];

const DiscountManager = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState(mockDiscounts);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<typeof mockDiscounts[0] | null>(null);
  
  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      code: '',
      type: 'percentage',
      value: 0,
      minPurchase: 0,
      maxUses: 100,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
    },
  });
  
  // Handle form submission
  const handleSubmit = (values: DiscountFormValues) => {
    if (editingDiscount) {
      // Update existing discount
      const updatedDiscounts = discounts.map(discount => 
        discount.id === editingDiscount.id 
          ? { 
              ...discount, 
              ...values,
              startDate: new Date(values.startDate),
              endDate: new Date(values.endDate),
            } 
          : discount
      );
      setDiscounts(updatedDiscounts);
      toast({
        title: "Discount Updated",
        description: `The discount code ${values.code} has been updated.`,
      });
    } else {
      // Add new discount
      const newDiscount = {
        id: Math.random().toString(36).substring(7),
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
        usedCount: 0,
      };
      setDiscounts([...discounts, newDiscount]);
      toast({
        title: "Discount Added",
        description: `A new discount code ${values.code} has been created.`,
      });
    }
    
    setShowAddDialog(false);
    setEditingDiscount(null);
    form.reset();
  };
  
  // Handle edit discount
  const handleEditDiscount = (discount: typeof mockDiscounts[0]) => {
    setEditingDiscount(discount);
    form.reset({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      minPurchase: discount.minPurchase,
      maxUses: discount.maxUses || undefined,
      startDate: discount.startDate.toISOString().split('T')[0],
      endDate: discount.endDate.toISOString().split('T')[0],
      isActive: discount.isActive,
    });
    setShowAddDialog(true);
  };
  
  // Handle delete discount
  const handleDeleteDiscount = (id: string) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      setDiscounts(discounts.filter(discount => discount.id !== id));
      toast({
        title: "Discount Deleted",
        description: "The discount code has been removed.",
      });
    }
  };
  
  // Toggle discount active status
  const handleToggleActive = (id: string, currentStatus: boolean) => {
    const updatedDiscounts = discounts.map(discount => 
      discount.id === id 
        ? { ...discount, isActive: !currentStatus } 
        : discount
    );
    setDiscounts(updatedDiscounts);
    toast({
      title: currentStatus ? "Discount Deactivated" : "Discount Activated",
      description: `The discount code has been ${currentStatus ? "deactivated" : "activated"}.`,
    });
  };
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif">Discount Management</h1>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Discount
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingDiscount ? 'Edit Discount' : 'Add New Discount'}</DialogTitle>
                <DialogDescription>
                  {editingDiscount 
                    ? 'Update the details for this discount code.' 
                    : 'Create a new discount code for your customers.'}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Code*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="SUMMER25" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type*</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value*</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="number" 
                                {...field} 
                                placeholder={form.watch('type') === 'percentage' ? "25" : "15.00"} 
                              />
                              <div className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                                {form.watch('type') === 'percentage' ? '%' : '$'}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="minPurchase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Purchase ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder="0.00" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date*</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date*</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="maxUses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Uses</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Leave empty for unlimited" 
                              value={field.value || ''} 
                              onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md border p-3">
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-5 w-5 rounded border-gray-300"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Active discount code</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      setShowAddDialog(false);
                      setEditingDiscount(null);
                      form.reset();
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingDiscount ? 'Update Discount' : 'Create Discount'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Discounts Table */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <Table>
            <TableCaption>List of all discount codes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Min. Purchase</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Used / Max</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.length > 0 ? (
                discounts.map((discount) => {
                  const isExpired = new Date() > discount.endDate;
                  
                  return (
                    <TableRow key={discount.id}>
                      <TableCell className="font-medium">
                        {discount.code}
                      </TableCell>
                      <TableCell className="capitalize">
                        {discount.type}
                      </TableCell>
                      <TableCell>
                        {discount.type === 'percentage' 
                          ? `${discount.value}%` 
                          : `$${discount.value.toFixed(2)}`}
                      </TableCell>
                      <TableCell>
                        {discount.minPurchase > 0 
                          ? `$${discount.minPurchase.toFixed(2)}` 
                          : 'None'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs">From {format(discount.startDate, 'MMM dd, yyyy')}</span>
                          <span className="text-xs">To {format(discount.endDate, 'MMM dd, yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {discount.usedCount} / {discount.maxUses ?? '∞'}
                      </TableCell>
                      <TableCell>
                        {isExpired ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Expired
                          </span>
                        ) : discount.isActive ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDiscount(discount)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDiscount(discount.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {!isExpired && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(discount.id, discount.isActive)}
                            >
                              {discount.isActive ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No discount codes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default DiscountManager;
