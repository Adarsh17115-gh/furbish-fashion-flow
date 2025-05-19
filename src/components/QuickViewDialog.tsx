
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import WishlistButton from './WishlistButton';

interface QuickViewDialogProps {
  product: Product;
}

const QuickViewDialog = ({ product }: QuickViewDialogProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="aspect-square rounded-md overflow-hidden">
          <img 
            src={product.images[selectedImage]} 
            alt={product.name} 
            className="object-cover w-full h-full"
          />
        </div>
        
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 ${
                  selectedImage === idx ? 'border-terracotta' : 'border-transparent'
                }`}
              >
                <img 
                  src={img} 
                  alt={`${product.name} view ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-medium mb-1">{product.name}</h2>
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium text-terracotta">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="bg-terracotta/10 text-terracotta text-xs px-2 py-0.5 rounded-full">{discount}% OFF</span>
              </>
            )}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Brand: <span className="text-foreground">{product.brand}</span></p>
          <p>Condition: <span className="text-foreground">{product.condition}</span></p>
        </div>
        
        <p className="text-sm line-clamp-3">{product.description}</p>
        
        {product.sizes.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Available Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 text-xs rounded-md border ${
                    selectedSize === size 
                      ? 'bg-terracotta text-white border-terracotta' 
                      : 'bg-white border-gray-200 hover:border-terracotta'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <Button 
            className="flex-1 bg-terracotta hover:bg-terracotta-dark"
          >
            Add to Cart
          </Button>
          <WishlistButton 
            productId={product.id} 
            productName={product.name}
            className="bg-white border"
          />
        </div>
        
        <Link 
          to={`/product/${product.id}`} 
          className="flex items-center text-sm text-terracotta hover:underline"
        >
          View Full Details <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

export default QuickViewDialog;
