import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  // 1. Espera o AuthContext terminar de verificar o localStorage
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-medium">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}