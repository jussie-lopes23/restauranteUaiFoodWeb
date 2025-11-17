import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function GuestRoute() {
  const { user, loading } = useAuth();

  // 1. Espera o AuthContext terminar
  if (loading) {
    return null; // Não mostra nada enquanto carrega
  }

  // 2. Se houver um usuário (está logado), redireciona para a Home
  if (user) {
    return <Navigate to="/" replace />;
  }

  // 3. Se não estiver logado, renderiza a rota (ex: <LoginPage />)
  return <Outlet />;
}