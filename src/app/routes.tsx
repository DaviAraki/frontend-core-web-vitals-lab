import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { App } from './App';

const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const BadPage = lazy(() => import('../pages/BadPage').then((m) => ({ default: m.BadPage })));
const OptimizedPage = lazy(() => import('../pages/OptimizedPage').then((m) => ({ default: m.OptimizedPage })));
const NotesPage = lazy(() => import('../pages/NotesPage').then((m) => ({ default: m.NotesPage })));

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="page" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
        <Routes>
          <Route element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="bad" element={<BadPage />} />
            <Route path="optimized" element={<OptimizedPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
