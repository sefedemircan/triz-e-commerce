import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function ProtectedRoute() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return null; // veya bir loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
} 