import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Protege rotas que são EXCLUSIVAS para Clientes.
 * Se um Admin tentar aceder, é redirecionado para o seu painel.
 */
export default function ClientOnlyRoute() {
  const { user } = useAuth(); // PrivateRoute (que está antes) já garante que user existe

  // Se for ADMIN, redireciona para o painel de admin
  if (user?.type === 'ADMIN') {
    return <Navigate to="/admin/pedidos" replace />; 
  }

  // Se for CLIENT, renderiza a página de cliente
  return <Outlet />;
}