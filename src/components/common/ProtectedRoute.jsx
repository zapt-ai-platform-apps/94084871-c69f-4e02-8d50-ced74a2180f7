import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/useAuth';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();
  
  if (isInitializing) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    // Redirect to the login page with a return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Render the protected component
  return <Outlet />;
};

export default ProtectedRoute;