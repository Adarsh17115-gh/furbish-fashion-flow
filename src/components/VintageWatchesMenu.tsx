
import { Link } from 'react-router-dom';
import { Watch } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const VintageWatchesMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium">
            <Watch className="h-4 w-4 mr-1" />
            Vintage Watches
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 gap-3 p-6 md:w-[500px] lg:w-[600px]">
              <div className="col-span-2">
                <NavigationMenuLink asChild>
                  <Link
                    to="/category/watches"
                    className="flex select-none items-center justify-between rounded-md bg-gradient-to-b from-purple-500/20 to-purple-500/30 p-6 no-underline outline-none focus:shadow-md"
                  >
                    <div>
                      <div className="text-lg font-medium">
                        Discover Timepiece Treasures
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground mt-1">
                        Explore our curated collection of vintage watches for all styles
                      </p>
                    </div>
                    <Watch className="h-6 w-6 text-purple-500" />
                  </Link>
                </NavigationMenuLink>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2 px-2">Shop by Gender</div>
                <ul className="space-y-1">
                  <li>
                    <Link to="/category/watches/women" className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      Women's Watches
                    </Link>
                  </li>
                  <li>
                    <Link to="/category/watches/men" className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      Men's Watches
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2 px-2">Collections</div>
                <ul className="space-y-1">
                  <li>
                    <Link to="/category/watches/luxury" className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      Luxury Collection
                    </Link>
                  </li>
                  <li>
                    <Link to="/category/watches/bestsellers" className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      Bestsellers
                    </Link>
                  </li>
                  <li>
                    <Link to="/category/watches/limited" className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      Limited Editions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default VintageWatchesMenu;
