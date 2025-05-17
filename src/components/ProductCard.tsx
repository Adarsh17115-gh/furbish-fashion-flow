
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
  
  return (
    <Link 
      to={`/product/${product.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md",
        className
      )}
    >
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        {product.originalPrice && (
          <div className="absolute top-2 right-2 bg-terracotta text-white text-xs px-2 py-1 rounded">
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
  );
};

export default ProductCard;
