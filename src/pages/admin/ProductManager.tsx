
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, addProduct, updateProduct, deleteProduct, uploadProductImage } from '@/lib/api';
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Search, Edit, Trash2, Eye, EyeOff, UploadCloud } from 'lucide-react';
import { Product as DatabaseProduct } from '@/types/database';
import { Product as UIProduct } from '@/data/products';

// Define a type that represents any product (DB or UI)
type AnyProduct = DatabaseProduct | UIProduct;

// Define the form data interface based on the Product type
interface ProductFormData {
  title: string;
  description: string;
  price: string;
  original_price: string;
  category: string;
  brand: string;
  condition: string;
  sizes: string[];
  is_visible: boolean;
  is_featured: boolean;
  images?: string[];
}

const ProductManager = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AnyProduct | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    brand: '',
    condition: 'new',
    sizes: [] as string[],
    is_visible: true,
    is_featured: false,
    images: []
  });
  
  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => fetchProducts({}),
  });
  
  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (productData: Omit<DatabaseProduct, "id" | "created_at" | "updated_at">) => {
      const product = await addProduct(productData);
      
      // If there's a selected file, upload it
      if (selectedFile && product.id) {
        await uploadProductImage(product.id, selectedFile);
      }
      
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setShowAddDialog(false);
      resetForm();
      setSelectedFile(null);
      toast({
        title: "Product Added",
        description: "The product has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DatabaseProduct> }) => {
      const product = await updateProduct(id, updates);
      
      // If there's a selected file, upload it
      if (selectedFile) {
        await uploadProductImage(id, selectedFile);
      }
      
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setEditingProduct(null);
      resetForm();
      setSelectedFile(null);
      toast({
        title: "Product Updated",
        description: "The product has been successfully updated.",
      });
    },
    onError: (error) => {
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
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      original_price: '',
      category: '',
      brand: '',
      condition: 'new',
      sizes: [],
      is_visible: true,
      is_featured: false,
      images: []
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      seller_info: { name: "FurbishStudios", rating: 5.0 },
      seller_id: null // Add seller_id as null since it's required by the type but optional in the database
    };
    
    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct.id,
        updates: productData,
      });
    } else {
      addProductMutation.mutate(productData as Omit<DatabaseProduct, "id" | "created_at" | "updated_at">);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Convert product to form data format
  const mapProductToForm = (product: AnyProduct): ProductFormData => {
    return {
      title: getProductName(product),
      description: product.description || '',
      price: product.price.toString(),
      original_price: getProductOriginalPrice(product),
      category: product.category || '',
      brand: product.brand || '',
      condition: product.condition || 'new',
      sizes: product.sizes || [],
      is_visible: getProductVisibility(product),
      is_featured: getProductFeatured(product),
      images: product.images || []
    };
  };
  
  // Helper functions for handling different product types
  function getProductName(product: AnyProduct): string {
    if ('name' in product) return product.name;
    if ('title' in product) return product.title;
    return 'Untitled Product';
  }
  
  function getProductOriginalPrice(product: AnyProduct): string {
    if ('originalPrice' in product && product.originalPrice) return product.originalPrice.toString();
    if ('original_price' in product && product.original_price) return product.original_price.toString();
    return '';
  }
  
  function getProductVisibility(product: AnyProduct): boolean {
    if ('inStock' in product) return product.inStock;
    if ('is_visible' in product) return product.is_visible;
    return true;
  }
  
  function getProductFeatured(product: AnyProduct): boolean {
    if ('featured' in product) return product.featured;
    if ('is_featured' in product) return product.is_featured;
    return false;
  }
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif">Product Manager</h1>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogDescription>
                  Fill in the product details below. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product form fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Name *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="original_price">Original Price</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="women">Women's Clothing</SelectItem>
                        <SelectItem value="watches">Watches</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({ ...formData, condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Product Image {!editingProduct && '*'}</Label>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center gap-4">
                      {selectedFile ? (
                        <div className="w-20 h-20 border rounded-md overflow-hidden">
                          <img 
                            src={URL.createObjectURL(selectedFile)} 
                            alt="Product preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : formData.images && formData.images.length > 0 ? (
                        <div className="w-20 h-20 border rounded-md overflow-hidden">
                          <img 
                            src={formData.images[0]} 
                            alt="Current product" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 border rounded-md flex items-center justify-center bg-muted">
                          <UploadCloud className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          required={!editingProduct && (!formData.images || formData.images.length === 0)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Upload a product image. Maximum size: 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddDialog(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={addProductMutation.isPending || updateProductMutation.isPending || isUploading}
                  >
                    {(addProductMutation.isPending || updateProductMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="women">Women's Clothing</SelectItem>
                  <SelectItem value="watches">Watches</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
            </div>
          ) : products && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md border overflow-hidden">
                          <img
                            src={product.images?.[0] || '/placeholder.svg'}
                            alt={getProductName(product)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{getProductName(product)}</p>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">${product.price}</p>
                        {(('originalPrice' in product && product.originalPrice) || 
                          ('original_price' in product && product.original_price)) && (
                          <p className="text-sm text-muted-foreground line-through">
                            ${('originalPrice' in product) ? product.originalPrice : product.original_price}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(('inStock' in product && product.inStock) || 
                         ('is_visible' in product && product.is_visible)) ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Hidden
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const formData = mapProductToForm(product);
                            setFormData(formData);
                            setEditingProduct(product);
                            setShowAddDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const isVisible = ('is_visible' in product) ? product.is_visible : 
                                           ('inStock' in product) ? product.inStock : true;
                            
                            updateProductMutation.mutate({
                              id: product.id,
                              updates: { 
                                is_visible: !isVisible 
                              },
                            });
                          }}
                        >
                          {(('inStock' in product && product.inStock) || 
                             ('is_visible' in product && product.is_visible)) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductManager;
