import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Loader from '../common/Loader.jsx';

export default function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullscreen />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
