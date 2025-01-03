import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import PropTypes from 'prop-types';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return null; // veya bir loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
}; 