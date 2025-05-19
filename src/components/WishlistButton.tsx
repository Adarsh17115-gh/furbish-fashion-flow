
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WishlistButtonProps {
  productId: string;
  productName: string;
  className?: string;
}

const WishlistButton = ({ productId, productName, className }: WishlistButtonProps) => {
  const [isInWishlist, setIsInWishlist] = useState(() => {
    // Check if the product is already in the wishlist (stored in localStorage)
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.includes(productId);
  });
  
  const { toast } = useToast();
  
  const toggleWishlist = () => {
    // Get current wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter((id: string) => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
      
      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist`,
      });
    } else {
      // Add to wishlist
      const updatedWishlist = [...wishlist, productId];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(true);
      
      toast({
        title: "Added to wishlist",
        description: `${productName} has been added to your wishlist`,
      });
    }
  };
  
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleWishlist}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} 
      />
    </Button>
  );
};

export default WishlistButton;
