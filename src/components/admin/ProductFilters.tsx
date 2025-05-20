
import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface FilterState {
  search: string;
  category: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  inStock: string;
  priceRange: [number, number];
}

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void;
  maxPrice: number;
}

const ProductFilters = ({ onFilterChange, maxPrice = 1000 }: ProductFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    sortBy: 'created_at',
    sortDirection: 'desc',
    inStock: 'all',
    priceRange: [0, maxPrice],
  });
  
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters.search]);
  
  // Apply filters when they change
  useEffect(() => {
    const appliedFilters = {
      search: debouncedSearch,
      category: filters.category !== 'all' ? filters.category : undefined,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection,
      inStock: filters.inStock === 'all' ? undefined : filters.inStock === 'true',
      minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
      maxPrice: filters.priceRange[1] < maxPrice ? filters.priceRange[1] : undefined,
    };
    
    onFilterChange(appliedFilters);
  }, [debouncedSearch, filters.category, filters.sortBy, filters.sortDirection, filters.inStock, filters.priceRange, onFilterChange, maxPrice]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };
  
  const handleCategoryChange = (value: string) => {
    setFilters({ ...filters, category: value });
  };
  
  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sortBy: value });
  };
  
  const handleSortDirectionChange = (value: string) => {
    setFilters({ ...filters, sortDirection: value as 'asc' | 'desc' });
  };
  
  const handleStockChange = (value: string) => {
    setFilters({ ...filters, inStock: value });
  };
  
  const handlePriceChange = (value: number[]) => {
    setFilters({ ...filters, priceRange: [value[0], value[1]] });
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      sortBy: 'created_at',
      sortDirection: 'desc',
      inStock: 'all',
      priceRange: [0, maxPrice],
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-grow relative min-w-[240px] md:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        
        {/* Category Filter */}
        <Select
          value={filters.category}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="women">Women's Clothing</SelectItem>
            <SelectItem value="men">Men's Clothing</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="watches">Watches</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Stock Status */}
        <Select
          value={filters.inStock}
          onValueChange={handleStockChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">In Stock</SelectItem>
            <SelectItem value="false">Hidden</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Sort By */}
        <div className="flex items-center gap-2">
          <Select
            value={filters.sortBy}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="title">Name</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.sortDirection}
            onValueChange={handleSortDirectionChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Advanced Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Price Range</h4>
              <div className="px-1">
                <Slider
                  defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
                  max={maxPrice}
                  step={1}
                  onValueChange={handlePriceChange}
                  className="my-6"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">${filters.priceRange[0]}</span>
                  <span className="text-sm text-muted-foreground">${filters.priceRange[1]}</span>
                </div>
              </div>
              
              <Button onClick={clearFilters} variant="outline" size="sm" className="w-full mt-2">
                Reset Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ProductFilters;
