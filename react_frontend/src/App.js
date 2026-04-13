import React, { Suspense, lazy } from 'react';
import './App.css';
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";
import { Routes, Route, useLocation } from 'react-router-dom';

// Lazy load user-facing pages
const Home = lazy(() => import('./components/home'));
const Shop = lazy(() => import('./components/shop'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const Register = lazy(() => import('./components/register'));
const Login = lazy(() => import('./components/login'));
const Profile = lazy(() => import('./components/Profile'));
const Wishlist = lazy(() => import('./components/Wishlist'));
const Cart = lazy(() => import('./components/Cart'));
const VerifyEmail = lazy(() => import('./components/VerifyEmail'));
const Checkout = lazy(() => import('./components/checkout'));
const ErrorPage = lazy(() => import('./components/error'));
const GetUsers = lazy(() => import('./components/getusers'));
const ChatbotWidget = lazy(() => import('./components/ChatbotWidget'));

// Lazy load admin pages
const AdminLayout = lazy(() => import('./admin/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'));
const AdminProducts = lazy(() => import('./admin/pages/Products'));
const AdminOrders    = lazy(() => import('./admin/pages/Orders'));
const AdminLogin     = lazy(() => import('./admin/pages/Login'));
const AdminCustomers = lazy(() => import('./admin/pages/Customers'));
const AdminSettings  = lazy(() => import('./admin/pages/Settings'));
const AdminReviews   = lazy(() => import('./admin/pages/Reviews'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/smartphones" element={<div style={{ padding: 20 }}>Smartphones Category</div>} />
            <Route path="/fashion" element={<div style={{ padding: 20 }}>Fashion Category</div>} />
            <Route path="/home-living" element={<div style={{ padding: 20 }}>Home & Living Category</div>} />
            <Route path="/beauty" element={<div style={{ padding: 20 }}>Beauty Category</div>} />
            <Route path="/accessories" element={<div style={{ padding: 20 }}>Accessories Category</div>} />
            <Route path="/toys" element={<div style={{ padding: 20 }}>Toys Category</div>} />
            <Route path="/laptops" element={<div style={{ padding: 20 }}>Laptops Category</div>} />
            <Route path="/audio" element={<div style={{ padding: 20 }}>Audio Category</div>} />
            
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Protected User Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Test Routes */}
            <Route path="/getusers" element={<GetUsers />} />

            {/* Fallback Route */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ChatbotWidget />}
    </div>
  );
}

export default App;
