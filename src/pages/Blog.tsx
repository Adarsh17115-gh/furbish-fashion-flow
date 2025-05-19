
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: "1",
    title: "How to Style Vintage Watches with Modern Outfits",
    excerpt: "Discover stylish ways to pair vintage timepieces with contemporary clothing for a unique look that stands out.",
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "May 5, 2025",
    category: "Style Guide"
  },
  {
    id: "2",
    title: "Sustainable Fashion: Why Pre-loved Clothing Matters",
    excerpt: "Learn about the environmental impact of fast fashion and how choosing pre-loved items can make a difference.",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "May 2, 2025",
    category: "Sustainability"
  },
  {
    id: "3",
    title: "The History of Wristwatches: From Utility to Luxury",
    excerpt: "Explore the fascinating evolution of wristwatches from practical tools to coveted luxury accessories.",
    image: "https://images.unsplash.com/photo-1568141579578-9c6c0bc5bc60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "April 28, 2025",
    category: "Watch Guide"
  },
  {
    id: "4",
    title: "5 Essential Pieces for Your Sustainable Wardrobe",
    excerpt: "Build a versatile and eco-friendly clothing collection with these timeless pre-loved fashion essentials.",
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "April 25, 2025",
    category: "Fashion Tips"
  },
];

const Blog = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Style Guide & Tips</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover the latest trends, styling tips, and sustainability insights for pre-loved fashion and vintage watches.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {blogPosts.slice(0, 2).map(post => (
            <div key={post.id} className="group cursor-pointer rounded-lg overflow-hidden border bg-card">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-0 left-0 px-3 py-1 bg-terracotta text-white text-xs m-3 rounded">
                  {post.category}
                </div>
              </div>
              
              <div className="p-5">
                <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
                <h2 className="text-xl font-medium mb-2 group-hover:text-terracotta transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <Button variant="ghost" className="text-terracotta px-0 hover:bg-transparent hover:text-terracotta-dark">
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.slice(2).map(post => (
            <div key={post.id} className="group cursor-pointer rounded-lg overflow-hidden border bg-card">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{post.date} • {post.category}</p>
                <h3 className="text-lg font-medium mb-2 group-hover:text-terracotta transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                <Button variant="ghost" size="sm" className="text-terracotta px-0 hover:bg-transparent hover:text-terracotta-dark">
                  Read More <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
