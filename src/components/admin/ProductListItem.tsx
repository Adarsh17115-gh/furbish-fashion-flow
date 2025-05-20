
import { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AdminProduct } from '@/types/admin';
import { getProductName, getProductOriginalPrice, getProductVisibility } from '@/lib/adapters';

interface ProductListItemProps {
  product: AdminProduct;
  onEdit: (product: AdminProduct) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isVisible: boolean) => void;
}

const ProductListItem = ({ 
  product, 
  onEdit, 
  onDelete, 
  onToggleVisibility 
}: ProductListItemProps) => {
  const [imageError, setImageError] = useState(false);
  const productName = getProductName(product);
  const isVisible = getProductVisibility(product);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-md border overflow-hidden bg-gray-50">
            {!imageError && product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={productName}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <ImageOff className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium line-clamp-1">{productName}</p>
            <p className="text-sm text-muted-foreground">{product.brand || 'No brand'}</p>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div>
          <p className="font-medium">${product.price}</p>
          {getProductOriginalPrice(product) && (
            <p className="text-sm text-muted-foreground line-through">
              ${getProductOriginalPrice(product)}
            </p>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        {product.category}
      </TableCell>
      
      <TableCell>
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {product.sizes && product.sizes.length > 0 ? (
            product.sizes.map((size, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {size}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No sizes</span>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        {isVisible ? (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            In Stock
          </Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Hidden
          </Badge>
        )}
      </TableCell>
      
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(product)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit product</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete product</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleVisibility(product.id, isVisible)}
                >
                  {isVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {isVisible ? 'Hide product' : 'Show product'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isVisible ? 'Hide product' : 'Show product'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductListItem;
