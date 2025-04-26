import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import LoadingScreen from '@/components/common/LoadingScreen';
import ZaptBadge from '@/components/common/ZaptBadge';
import { useAuth } from '@/modules/auth/useAuth';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AdminRoute from '@/components/common/AdminRoute';

// Lazy-loaded pages for better performance
const Home = lazy(() => import('@/pages/Home'));
const Catalogue = lazy(() => import('@/pages/Catalogue'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderSuccess = lazy(() => import('@/pages/OrderSuccess'));
const Orders = lazy(() => import('@/pages/Orders'));
const OrderDetail = lazy(() => import('@/pages/OrderDetail'));
const Profile = lazy(() => import('@/pages/Profile'));
const Prescriptions = lazy(() => import('@/pages/Prescriptions'));
const Auth = lazy(() => import('@/pages/Auth'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/Products'));
const AdminOrders = lazy(() => import('@/pages/admin/Orders'));
const AdminPrescriptions = lazy(() => import('@/pages/admin/Prescriptions'));
const AdminCustomers = lazy(() => import('@/pages/admin/Customers'));

export default function App() {
  const { isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-full flex flex-col">
      <MainLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/catalogue/:categoryId" element={<Catalogue />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
            </Route>
            
            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/prescriptions" element={<AdminPrescriptions />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
            </Route>
            
            {/* Fallback routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
      <ZaptBadge />
    </div>
  );
}