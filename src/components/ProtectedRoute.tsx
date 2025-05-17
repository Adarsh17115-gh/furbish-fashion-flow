
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({
  requireAuth = true,
  requireAdmin = false,
  redirectTo = '/auth'
}: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();
  
  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  // If user needs to be authenticated and isn't, redirect to login
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If admin access is required but user isn't an admin, redirect
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If user is logged in but accessing a guest-only route
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
