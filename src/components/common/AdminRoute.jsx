import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/modules/auth/useAuth';
import LoadingScreen from './LoadingScreen';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, isInitializing } = useAuth();
  
  if (isInitializing) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Render the admin component
  return <Outlet />;
};

export default AdminRoute;