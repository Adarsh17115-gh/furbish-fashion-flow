
import { Product } from '@/data/products';
import ProductCard from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  title?: string;
  className?: string;
}

const ProductGrid = ({ products, title, className }: ProductGridProps) => {
  return (
    <section className={cn("py-8", className)}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif">{title}</h2>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
