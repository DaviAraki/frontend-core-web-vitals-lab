import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

/**
 * App shell: header, routed page (Outlet), and footer.
 */
export function App() {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-main">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
