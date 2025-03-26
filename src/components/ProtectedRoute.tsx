
import React from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  
  // Check if the user is an admin (you'd need to set up this claim/metadata in Clerk)
  const isAdmin = user?.publicMetadata?.role === 'admin';

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
