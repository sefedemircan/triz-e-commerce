import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/Admin/Layout';
import Dashboard from '../pages/Admin/Dashboard';
import Products from '../pages/Admin/Products';
import Categories from '../pages/Admin/Categories';
import Orders from '../pages/Admin/Orders';
import Users from '../pages/Admin/Users';
import Settings from '../pages/Admin/Settings';
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
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products/*" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
} 