import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InteractiveCursor } from './components/InteractiveCursor';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { FishCareBlogPage } from './pages/FishCareBlogPage';
import { FarmLocationPage } from './pages/FarmLocationPage';
import { OrderInquiryPage } from './pages/OrderInquiryPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminResetPasswordPage } from './pages/admin/AdminResetPasswordPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // Check browser path or hash
    const path = window.location.pathname;
    if (path.startsWith('/connect/admin')) {
      return path;
    }
    const hash = window.location.hash.replace('#', '');
    return hash ? (hash.startsWith('/') ? hash : `/${hash}`) : path || '/';
  });

  // Listen to popstate (browser back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/connect/admin')) {
        setCurrentPath(path);
        return;
      }
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash ? (hash.startsWith('/') ? hash : `/${hash}`) : path || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newPath: string) => {
    setCurrentPath(newPath);
    if (newPath.startsWith('/connect/admin')) {
      window.history.pushState(null, '', newPath);
    } else {
      window.history.pushState(null, '', newPath === '/' ? '/' : `#${newPath}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentPath.startsWith('/connect/admin');

  const renderPage = () => {
    switch (currentPath) {
      case '/connect/admin/reset-password':
        return <AdminResetPasswordPage navigate={navigate} />;
      case '/connect/admin/dashboard':
        return <AdminDashboardPage navigate={navigate} />;
      case '/connect/admin':
        return <AdminLoginPage navigate={navigate} />;
      case '/catalog':
        return <CatalogPage navigate={navigate} />;
      case '/guides':
        return <FishCareBlogPage />;
      case '/location':
        return <FarmLocationPage navigate={navigate} />;
      case '/inquiry':
        return <OrderInquiryPage navigate={navigate} />;
      case '/':
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <AppProvider>
      {/* Interactive fish swimming custom desktop cursor */}
      {!isAdminRoute && <InteractiveCursor />}

      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Public Navigation Bar */}
        {!isAdminRoute && <Navbar currentPath={currentPath} navigate={navigate} />}

        {/* Dynamic Route Content */}
        <main className="flex-1">
          {renderPage()}
        </main>

        {/* Public Footer (STRICTLY NO ADMIN LINK EVER DISPLAYED) */}
        {!isAdminRoute && <Footer navigate={navigate} />}
      </div>
    </AppProvider>
  );
}
