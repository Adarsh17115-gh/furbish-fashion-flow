
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Product } from '@/data/products';
import WishlistButton from '@/components/WishlistButton';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import QuickViewDialog from '@/components/QuickViewDialog';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
  
  const handleMouseEnter = () => {
    if (product.images.length > 1) {
      setCurrentImage(1);
    }
  };
  
  const handleMouseLeave = () => {
    setCurrentImage(0);
  };
  
  return (
    <div 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md",
        className
      )}
    >
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <WishlistButton 
          productId={product.id} 
          productName={product.name}
        />
        
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <QuickViewDialog product={product} />
          </DialogContent>
        </Dialog>
      </div>
      
      <Link to={`/product/${product.id}`}>
        <div 
          className="aspect-square overflow-hidden relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={product.images[currentImage]} 
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {product.originalPrice && (
            <div className="absolute top-2 left-2 bg-terracotta text-white text-xs px-2 py-1 rounded">
              {discount}% OFF
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base line-clamp-1">{product.name}</h3>
            <p className="text-sm font-medium text-terracotta">${product.price.toFixed(2)}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">{product.brand} · {product.condition}</p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</p>
            )}
          </div>
          
          <div className="mt-2 text-xs">
            {product.sizes.length > 0 && (
              <p className="text-muted-foreground">
                Available: {product.sizes.join(', ')}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
