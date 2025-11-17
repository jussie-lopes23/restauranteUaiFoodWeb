import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminRoute() {
  const { user } = useAuth();
  
  // O <PrivateRoute> (onde este componente será usado) já garante
  // que 'user' não é nulo, mas fazemos a verificação por segurança.

  // Se o utilizador não for ADMIN, redireciona para a home (página do cliente)
  if (user?.type !== 'ADMIN') {
    // Pode redirecionar para '/' ou para uma página "Não Autorizado"
    return <Navigate to="/" replace />; 
  }

  // Se for ADMIN, renderiza a página de admin solicitada
  return <Outlet />;
}