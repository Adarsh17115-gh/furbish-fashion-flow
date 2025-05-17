
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { getProductById, Product } from '@/data/products';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    if (id) {
      const foundProduct = getProductById(id);
      setProduct(foundProduct || null);
      setSelectedSize(null);
    }
  }, [id]);
  
  const handlePrevImage = () => {
    if (product) {
      setSelectedImage((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };
  
  const handleNextImage = () => {
    if (product) {
      setSelectedImage((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You must select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    // Add to cart logic would go here
    toast({
      title: "Added to cart",
      description: `${product?.name} (${selectedSize}) has been added to your cart`,
    });
  };
  
  if (!product) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl mb-4">Product Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm mb-6 hover:text-terracotta transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg border">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              
              {product.images.length > 1 && (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80"
                    onClick={handlePrevImage}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80"
                    onClick={handleNextImage}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {product.originalPrice && (
                <div className="absolute top-4 right-4 bg-terracotta text-white px-3 py-1 rounded-full text-sm">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    className={`w-20 h-20 rounded border-2 flex-shrink-0 overflow-hidden ${
                      selectedImage === idx ? 'border-terracotta' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(idx)}
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
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-xl font-medium text-terracotta">${product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <p className="text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{product.brand}</span>
                <span>•</span>
                <span>Condition: {product.condition}</span>
              </div>
            </div>
            
            {/* Sizes */}
            <div>
              <h3 className="text-sm font-medium mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
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
            
            {/* Add to Cart */}
            <Button 
              className="w-full bg-terracotta hover:bg-terracotta-dark"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            
            {/* Description */}
            <div>
              <h3 className="text-lg font-medium mb-3">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            
            {/* Seller Info */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Seller Information</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.seller.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Rating: {product.seller.rating.toFixed(1)}/5.0</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Profile</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
