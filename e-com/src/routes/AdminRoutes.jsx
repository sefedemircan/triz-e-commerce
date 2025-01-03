import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/Admin/Layout';
import Dashboard from '../pages/Admin/Dashboard';
import Products from '../pages/Admin/Products';
import Orders from '../pages/Admin/Orders';
import Categories from '../pages/Admin/Categories';
import StockManagement from '../pages/Admin/Stock';
import { useAuthStore } from '../stores/authStore';

export default function AdminRoutes() {
  const { user, userProfile, loading } = useAuthStore();
  
  if (loading) {
    return null; // veya loading spinner
  }

  // Admin yetkisi kontrolü
  if (!user || userProfile?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products/*" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="stock" element={<StockManagement />} />
      </Route>
    </Routes>
  );
} 