
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  uploadProductImage,
  deleteProductImage 
} from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Loader2 } from 'lucide-react';
import { Product as DatabaseProduct } from '@/types/database';
import { AdminProduct } from '@/types/admin';
import ProductFilters from '@/components/admin/ProductFilters';
import ProductListItem from '@/components/admin/ProductListItem';
import ProductForm from '@/components/admin/ProductForm';

const ProductManager = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [filters, setFilters] = useState({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Queries
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: () => fetchProducts(filters),
  });
  
  // Mutations
  const addProductMutation = useMutation({
    mutationFn: async (productData: {
      data: Omit<DatabaseProduct, "id" | "created_at" | "updated_at">,
      images: File[]
    }) => {
      // First add the product
      const product = await addProduct(productData.data);
      
      // Then upload all images
      if (productData.images.length > 0) {
        setIsUploading(true);
        await Promise.all(
          productData.images.map(file => uploadProductImage(product.id, file))
        );
        setIsUploading(false);
      }
      
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setShowAddDialog(false);
      toast({
        title: "Product Added",
        description: "The product has been successfully added.",
      });
    },
    onError: (error) => {
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ 
      id, 
      updates, 
      newImages 
    }: { 
      id: string; 
      updates: Partial<DatabaseProduct>; 
      newImages: File[] 
    }) => {
      // First update the product data
      const product = await updateProduct(id, updates);
      
      // Then upload any new images
      if (newImages.length > 0) {
        setIsUploading(true);
        await Promise.all(
          newImages.map(file => uploadProductImage(id, file))
        );
        setIsUploading(false);
      }
      
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setEditingProduct(null);
      setShowAddDialog(false);
      toast({
        title: "Product Updated",
        description: "The product has been successfully updated.",
      });
    },
    onError: (error) => {
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: ({ productId, imageUrl }: { productId: string, imageUrl: string }) => {
      return deleteProductImage(productId, imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast({
        title: "Image Deleted",
        description: "The image has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  // Handle form submit
  const handleProductFormSubmit = (formData: any, newImages: File[]) => {
    // Convert form data to match database structure
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      seller_info: { name: "FurbishStudios", rating: 5.0 },
      seller_id: null
    };
    
    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct.id,
        updates: productData,
        newImages
      });
    } else {
      addProductMutation.mutate({ 
        data: productData as Omit<DatabaseProduct, "id" | "created_at" | "updated_at">,
        images: newImages
      });
    }
  };
  
  // Handle image delete
  const handleDeleteImage = (imageUrl: string) => {
    if (editingProduct) {
      deleteImageMutation.mutate({
        productId: editingProduct.id,
        imageUrl: imageUrl
      });
    }
  };
  
  // Handle delete product
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };
  
  // Handle toggle visibility
  const handleToggleVisibility = (id: string, isVisible: boolean) => {
    updateProductMutation.mutate({
      id,
      updates: { is_visible: !isVisible },
      newImages: []
    });
  };
  
  // Calculate max price for filter range
  const maxPrice = products?.reduce(
    (max, product) => Math.max(max, product.price || 0), 
    0
  ) || 1000;
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-serif">Product Manager</h1>
            <p className="text-muted-foreground">
              Manage your products inventory
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <ProductFilters onFilterChange={handleFilterChange} maxPrice={maxPrice} />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Sizes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <ProductListItem 
                      key={product.id}
                      product={product}
                      onEdit={(product) => {
                        setEditingProduct(product);
                        setShowAddDialog(true);
                      }}
                      onDelete={handleDeleteProduct}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowAddDialog(true)}
              >
                Add your first product
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={handleProductFormSubmit}
            onCancel={() => {
              setShowAddDialog(false);
              setEditingProduct(null);
            }}
            onDeleteImage={handleDeleteImage}
            isSubmitting={addProductMutation.isPending || updateProductMutation.isPending || isUploading}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ProductManager;
