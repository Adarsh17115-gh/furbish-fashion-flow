
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-serif mb-6">404</h1>
        <p className="text-2xl md:text-3xl font-serif mb-6">Page Not Found</p>
        <p className="text-muted-foreground max-w-md mb-8">
          We couldn't find the page you were looking for. It might have been removed, 
          renamed, or didn't exist in the first place.
        </p>
        <Button asChild className="bg-terracotta hover:bg-terracotta-dark">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
