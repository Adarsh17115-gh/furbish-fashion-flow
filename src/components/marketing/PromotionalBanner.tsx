
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const promotions = [
  "Free Shipping on Orders Above ₹999",
  "Buy 2 Get 1 Free on Selected Items",
  "Flat 30% Off on New Arrivals",
  "Limited Time: Use Code FURBISH20 for Extra 20% Off"
];

const PromotionalBanner = () => {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Rotate through promotions every 5 seconds
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="bg-terracotta text-white py-2 px-4 text-center relative animate-fade-in">
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-sm md:text-base font-medium">{promotions[currentPromoIndex]}</p>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-4 text-white hover:opacity-75 transition-opacity"
          aria-label="Close promotion banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PromotionalBanner;
