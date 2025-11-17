import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  // 1. Espera o AuthContext terminar de verificar o localStorage
  if (loading) {
    // Você pode substituir isso por um componente <Spinner /> elegante
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-medium">Carregando...</p>
      </div>
    );
  }

  // 2. Se não estiver carregando e NÃO houver usuário, redireciona
  if (!user) {
    // 'replace' impede o usuário de usar o botão "voltar" do navegador
    // para acessar a página protegida.
    return <Navigate to="/login" replace />;
  }

  // 3. Se estiver logado, renderiza a rota filha (ex: <HomePage />)
  // O <Outlet /> é um placeholder para a rota aninhada.
  return <Outlet />;
}