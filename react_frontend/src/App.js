import './App.css';
import Navbar from "./components/navbar";
import Home from "./components/home";
import Shop from "./components/shop";
import Footer from "./components/Footer";
import Register from "./components/register";
import Login from "./components/login";
import Profile from "./components/Profile";
import Cart from "./components/Cart";
import Checkout from "./components/checkout";
import ErrorPage from "./components/error";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminProducts from "./admin/pages/Products";
import AdminOrders from "./admin/pages/Orders";
import AdminLogin from "./admin/pages/Login";
import AdminCustomers from "./admin/pages/Customers";
import AdminSettings from "./admin/pages/Settings";
import ProductDetail from "./components/ProductDetail";
import GetUsers from "./components/getusers";
import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Navbar />}
      <Routes>
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="/getusers" element={<GetUsers />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
