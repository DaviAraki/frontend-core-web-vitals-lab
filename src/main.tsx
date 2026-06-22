import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRoutes } from './app/routes';
import './styles/global.css';
import './styles/layout.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root was not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
);
