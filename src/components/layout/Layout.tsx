
import { ReactNode, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PromotionalBanner from '@/components/PromotionalBanner';
import FlashSalePopup from '@/components/marketing/FlashSalePopup';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [showFlashSale, setShowFlashSale] = useState(false);
  
  useEffect(() => {
    // Check if the user has dismissed the popup recently
    const lastDismissed = localStorage.getItem('flashSaleDismissed');
    const shouldShow = !lastDismissed || 
      (Date.now() - Number(lastDismissed)) > 24 * 60 * 60 * 1000; // 24 hours
    
    if (shouldShow) {
      // Delay the popup for a better UX
      const timer = setTimeout(() => {
        setShowFlashSale(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleCloseFlashSale = () => {
    setShowFlashSale(false);
    localStorage.setItem('flashSaleDismissed', Date.now().toString());
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <PromotionalBanner />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {showFlashSale && <FlashSalePopup onClose={handleCloseFlashSale} />}
    </div>
  );
};

export default Layout;
