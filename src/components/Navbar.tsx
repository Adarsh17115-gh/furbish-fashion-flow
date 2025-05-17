
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { name: "Women", path: "/category/women" },
  { name: "Men", path: "/category/men" },
  { name: "Accessories", path: "/category/accessories" },
  { name: "New Arrivals", path: "/new-arrivals" },
  { name: "Sale", path: "/sale" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-semibold md:text-2xl tracking-tight">
              Furbish<span className="text-terracotta">Studios</span>
            </h1>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="text-sm font-medium transition-colors hover:text-terracotta"
            >
              {category.name}
            </Link>
          ))}
        </nav>
        
        {/* Right Side - Search & Cart */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label={isSearchOpen ? "Close search" : "Search"}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={cn(
          "fixed inset-0 top-16 z-40 w-full bg-background md:hidden",
          isMenuOpen ? "flex flex-col animate-fade-in" : "hidden"
        )}
      >
        <nav className="flex flex-col gap-4 p-6">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="text-lg font-medium py-2 transition-colors hover:text-terracotta"
              onClick={() => setIsMenuOpen(false)}
            >
              {category.name}
            </Link>
          ))}
          <div className="h-px bg-border my-4" />
          <Link 
            to="/admin/login" 
            className="text-lg font-medium py-2 text-muted-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            Admin Login
          </Link>
        </nav>
      </div>
      
      {/* Search overlay */}
      {isSearchOpen && (
        <div className="absolute top-16 left-0 w-full bg-background border-b p-4 animate-fade-in">
          <div className="container mx-auto flex items-center">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <Button 
              variant="ghost" 
              size="icon"
              className="ml-2" 
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
