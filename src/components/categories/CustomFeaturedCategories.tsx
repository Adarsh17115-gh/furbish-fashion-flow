
import { Link } from 'react-router-dom';

const categories = [
  {
    name: "Women's Tops",
    description: "Blouses, shirts, and t-shirts for every occasion",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    link: "/category/women/tops"
  },
  {
    name: "Women's Dresses",
    description: "From casual to formal, find your perfect dress",
    image: "https://images.unsplash.com/photo-1623118171847-401789d5062d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    link: "/category/women/dresses"
  },
  {
    name: "Women's Watches",
    description: "Elegant timepieces for the sophisticated woman",
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    link: "/category/watches/women"
  },
  {
    name: "Men's Watches",
    description: "Classic and timeless men's watch collection",
    image: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    link: "/category/watches/men"
  }
];

const CustomFeaturedCategories = () => {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-serif mb-6">Shop Our Categories</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              to={category.link}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-charcoal/0 flex flex-col justify-end p-4 text-white">
                <h3 className="text-lg font-medium mb-1">{category.name}</h3>
                <p className="text-sm text-white/80 line-clamp-2">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomFeaturedCategories;
