import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { App } from './App';
import { HomePage } from '../pages/HomePage';
import { BadPage } from '../pages/BadPage';
import { OptimizedPage } from '../pages/OptimizedPage';
import { NotesPage } from '../pages/NotesPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="bad" element={<BadPage />} />
          <Route path="optimized" element={<OptimizedPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
