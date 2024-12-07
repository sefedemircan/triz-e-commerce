import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/Layout/Layout';
import Home from '../pages/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Profile from '../pages/Profile';
import ProtectedRoute from './ProtectedRoute';
import Products from '../pages/Products/index';
import Favorites from '../pages/Favorites/index';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import CategoryPage from '../pages/CategoryPage';
import AdminRoutes from './AdminRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/kategori/:slug" element={<CategoryPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Route>
      
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
} 