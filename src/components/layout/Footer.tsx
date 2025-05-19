
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-cream-dark border-t">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">FurbishStudios</h3>
            <p className="text-muted-foreground mb-4">
              A modern platform for buying and selling pre-loved clothing.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground hover:text-terracotta transition-colors">
                Instagram
              </a>
              <a href="#" className="text-foreground hover:text-terracotta transition-colors">
                Twitter
              </a>
              <a href="#" className="text-foreground hover:text-terracotta transition-colors">
                Facebook
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/category/women" className="text-muted-foreground hover:text-terracotta transition-colors">Women</Link></li>
              <li><Link to="/category/men" className="text-muted-foreground hover:text-terracotta transition-colors">Men</Link></li>
              <li><Link to="/category/accessories" className="text-muted-foreground hover:text-terracotta transition-colors">Accessories</Link></li>
              <li><Link to="/new-arrivals" className="text-muted-foreground hover:text-terracotta transition-colors">New Arrivals</Link></li>
              <li><Link to="/sale" className="text-muted-foreground hover:text-terracotta transition-colors">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-terracotta transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-terracotta transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-terracotta transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-terracotta transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-terracotta transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-terracotta transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-10 pt-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} FurbishStudios. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
