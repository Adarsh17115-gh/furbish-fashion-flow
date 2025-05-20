
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import ProductManager from "./pages/admin/ProductManager";
import OrderManager from "./pages/admin/OrderManager";
import CustomerManager from "./pages/admin/CustomerManager";
import DiscountManager from "./pages/admin/DiscountManager";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Shipping from "./pages/Shipping";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Wishlist from "./pages/Wishlist";
import Blog from "./pages/Blog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/blog" element={<Blog />} />
            
            {/* Footer pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Auth routes (only for non-authenticated users) */}
            <Route element={<ProtectedRoute requireAuth={false} redirectTo="/" />}>
              <Route path="/auth" element={<Auth />} />
            </Route>
            
            {/* Protected routes (requires authentication) */}
            <Route element={<ProtectedRoute requireAuth={true} />}>
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
            </Route>
            
            {/* Admin routes */}
            <Route element={<ProtectedRoute requireAuth={true} requireAdmin={true} />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductManager />} />
              <Route path="/admin/orders" element={<OrderManager />} />
              <Route path="/admin/customers" element={<CustomerManager />} />
              <Route path="/admin/discounts" element={<DiscountManager />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
