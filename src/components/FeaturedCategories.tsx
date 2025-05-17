
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  className?: string;
}

const CategoryCard = ({ title, description, image, link, className }: CategoryCardProps) => {
  return (
    <Link 
      to={link}
      className={cn(
        "group relative overflow-hidden rounded-lg aspect-square", 
        className
      )}
    >
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-white text-xl font-serif mb-2">{title}</h3>
        <p className="text-white/80 text-sm mb-4">{description}</p>
        <span className="text-white text-sm font-medium group-hover:underline">
          Shop Now
        </span>
      </div>
    </Link>
  );
};

const FeaturedCategories = () => {
  return (
    <section className="container py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl font-serif mb-8 text-center">Shop by Category</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CategoryCard
          title="Women's Collection"
          description="Curated pieces from minimalist basics to statement designs"
          image="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
          link="/category/women"
        />
        <CategoryCard
          title="Men's Collection"
          description="Classic and contemporary styles for every occasion"
          image="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
          link="/category/men"
        />
        <CategoryCard
          title="Accessories"
          description="Elevate your outfit with our handpicked accessories"
          image="https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
          link="/category/accessories"
        />
      </div>
    </section>
  );
};

export default FeaturedCategories;
