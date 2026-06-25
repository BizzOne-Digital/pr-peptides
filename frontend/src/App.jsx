import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';

import HomePage          from './pages/shop/HomePage';
import ShopPage          from './pages/shop/ShopPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import CheckoutPage      from './pages/shop/CheckoutPage';
import AboutPage         from './pages/shop/AboutPage';
import QualityPage       from './pages/shop/QualityPage';
import ContactPage       from './pages/shop/ContactPage';

import AdminLogin         from './pages/admin/AdminLogin';
import AdminLayout        from './pages/admin/AdminLayout';
import AdminDashboard     from './pages/admin/AdminDashboard';
import AdminProducts      from './pages/admin/AdminProducts';
import AdminOrders        from './pages/admin/AdminOrders';
import AdminSubscribers   from './pages/admin/AdminSubscribers';
import AdminNotifications from './pages/admin/AdminNotifications';

/* Scroll page to top on route change */
const RouteScrollReset = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ShopLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
    <ScrollToTop />
  </>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#020817', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', color:'#475569' }}>
        <div style={{ width:40, height:40, border:'2px solid #1e3a5f', borderTop:'2px solid #3b82f6', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 16px' }} />
        Loading...
      </div>
    </div>
  );
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <RouteScrollReset />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background:'#0d1526', color:'#fff', border:'1px solid rgba(30,58,95,0.6)', borderRadius:12, fontSize:14 },
              duration: 4000,
            }}
          />
          <Routes>
            <Route path="/"           element={<ShopLayout><HomePage          /></ShopLayout>} />
            <Route path="/shop"       element={<ShopLayout><ShopPage          /></ShopLayout>} />
            <Route path="/product/:slug" element={<ShopLayout><ProductDetailPage /></ShopLayout>} />
            <Route path="/checkout"   element={<ShopLayout><CheckoutPage      /></ShopLayout>} />
            <Route path="/about"      element={<ShopLayout><AboutPage         /></ShopLayout>} />
            <Route path="/quality"    element={<ShopLayout><QualityPage       /></ShopLayout>} />
            <Route path="/contact"    element={<ShopLayout><ContactPage       /></ShopLayout>} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index                element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard"     element={<AdminDashboard />} />
              <Route path="products"      element={<AdminProducts />} />
              <Route path="orders"        element={<AdminOrders />} />
              <Route path="subscribers"   element={<AdminSubscribers />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
