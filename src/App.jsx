import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import LoadingScreen from '@/components/common/LoadingScreen';
import ZaptBadge from '@/components/common/ZaptBadge';

// Lazy-loaded pages for better performance
const Home = lazy(() => import('@/pages/Home'));
const Editor = lazy(() => import('@/pages/Editor'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export default function App() {
  return (
    <div className="h-full flex flex-col">
      <MainLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
      <ZaptBadge />
    </div>
  );
}