
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, Menu, Package, LogOut, Heart, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import VintageWatchesMenu from '@/components/VintageWatchesMenu';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-30">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-serif text-xl font-bold text-terracotta">
            FurbishStudios
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="text-sm font-medium transition-colors hover:text-terracotta px-3 py-2">
                  Home
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Women</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/category/women"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-terracotta/20 to-terracotta/30 p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Women's Collection
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Discover our curated selection of pre-loved women's fashion pieces
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link to="/category/women/tops" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Tops</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Blouses, t-shirts, and more
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/category/women/dresses" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Dresses</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Casual, formal, and special occasion dresses
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/category/women/outerwear" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Outerwear</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Jackets, coats, and seasonal layers
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/category/women/accessories" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Accessories</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Bags, scarves, and other accessories
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <VintageWatchesMenu />
              
              <NavigationMenuItem>
                <Link to="/blog" className="text-sm font-medium transition-colors hover:text-terracotta px-3 py-2">
                  Style Guide
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <Link to="/wishlist">
              <Heart className="h-4 w-4" />
            </Link>
          </Button>
          
          {!user ? (
            <Button variant="outline" asChild>
              <Link to="/auth">
                <User className="h-4 w-4 mr-2" />
                Login / Register
              </Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/wishlist" className="flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    My Wishlist
                  </Link>
                </DropdownMenuItem>
                
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {searchOpen && (
        <div className="border-t py-3 px-4 bg-white animate-fade-in">
          <div className="container">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
