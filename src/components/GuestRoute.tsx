import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function GuestRoute() {
  const { user, loading } = useAuth();

  // Espera o AuthContext terminar
  if (loading) {
    return null; 
  }

  //Se houver um usuário (está logado), redireciona para a Home
  if (user) {
    return <Navigate to="/" replace />;
  }

  //Se não estiver logado, renderiza a rota
  return <Outlet />;
}