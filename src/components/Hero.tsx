
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Watch } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-cream overflow-hidden">
      <div className="container py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-serif leading-tight">
              Pre-loved Style, <span className="text-terracotta">Future-focused</span> Fashion
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover unique women's fashion pieces and vintage watches at a fraction of their original price. 
              Sustainable, affordable, stylish.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-terracotta hover:bg-terracotta-dark">
                <Link to="/category/women">Shop Women</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/category/watches">
                  <Watch className="h-4 w-4 mr-2" />
                  Shop Watches
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Vintage clothing collection" 
              className="absolute inset-0 object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
