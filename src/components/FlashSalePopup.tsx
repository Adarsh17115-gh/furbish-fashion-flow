
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlashSalePopupProps {
  onClose: () => void;
}

const FlashSalePopup = ({ onClose }: FlashSalePopupProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <div className="mb-4 text-terracotta font-serif text-xl">Limited Time Offer!</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Flash Sale – Up to 50% Off!</h2>
          <p className="text-muted-foreground mb-6">Shop our curated collection of pre-loved fashion and vintage watches at incredible prices. Limited stock available!</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={onClose} 
              className="bg-terracotta hover:bg-terracotta-dark"
            >
              Shop Now
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Remind Me Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSalePopup;
