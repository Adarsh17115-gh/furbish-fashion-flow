
import { useState, useEffect } from 'react';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import MultipleImageUpload from './MultipleImageUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminProduct } from '@/types/admin';
import { getProductName, getProductOriginalPrice, getProductVisibility, getProductFeatured } from '@/lib/adapters';

// Define the form validation schema
const productFormSchema = z.object({
  title: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.string().refine(value => !isNaN(Number(value)) && Number(value) > 0, {
    message: 'Price must be a positive number',
  }),
  original_price: z.string().refine(value => value === '' || (!isNaN(Number(value)) && Number(value) > 0), {
    message: 'Original price must be a positive number',
  }).optional(),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  condition: z.string(),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  is_visible: z.boolean().default(true),
  is_featured: z.boolean().default(false)
});

// Define available sizes
const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: AdminProduct;
  onSubmit: (data: ProductFormValues, newImages: File[]) => void;
  onCancel: () => void;
  onDeleteImage?: (imageUrl: string) => void;
  isSubmitting?: boolean;
}

const ProductForm = ({ 
  product,
  onSubmit,
  onCancel,
  onDeleteImage,
  isSubmitting = false 
}: ProductFormProps) => {
  const [newImages, setNewImages] = useState<File[]>([]);
  
  // Initialize form with default values or existing product values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? {
      title: getProductName(product),
      description: product.description || '',
      price: product.price.toString(),
      original_price: getProductOriginalPrice(product) || '',
      category: product.category || '',
      brand: product.brand || '',
      condition: product.condition || 'new',
      sizes: product.sizes || [],
      is_visible: getProductVisibility(product),
      is_featured: getProductFeatured(product)
    } : {
      title: '',
      description: '',
      price: '',
      original_price: '',
      category: '',
      brand: '',
      condition: 'new',
      sizes: [],
      is_visible: true,
      is_featured: false
    }
  });
  
  const handleFormSubmit = (data: ProductFormValues) => {
    onSubmit(data, newImages);
  };
  
  const handleImagesChange = (files: File[]) => {
    setNewImages(prev => [...prev, ...files]);
  };
  
  const handleImageRemove = (url: string) => {
    if (onDeleteImage) {
      onDeleteImage(url);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="original_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" min="0" />
                    </FormControl>
                    <FormDescription>
                      Leave empty if no discount
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="women">Women's Clothing</SelectItem>
                        <SelectItem value="men">Men's Clothing</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="watches">Watches</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-h-32" 
                      placeholder="Describe the product, including details about fabric, fit, etc."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <MultipleImageUpload
              existingImages={product?.images || []}
              onImagesChange={handleImagesChange}
              onImageRemove={handleImageRemove}
              isUploading={isSubmitting}
            />
            
            <FormField
              control={form.control}
              name="sizes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Available Sizes *</FormLabel>
                    <FormDescription>
                      Select all available sizes for this product
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {AVAILABLE_SIZES.map((size) => (
                      <FormField
                        key={size}
                        control={form.control}
                        name="sizes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={size}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(size)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, size])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== size
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {size}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="is_visible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Visible</FormLabel>
                      <FormDescription>
                        Product is available for sale
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        Show on featured sections
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
