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

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products" element={<Products />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
} 