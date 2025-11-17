import { useAuth } from '../../hooks/useAuth'; // Nosso hook de autenticação
import { toast } from 'react-hot-toast'; // Para o pop-up

export default function HomePage() {
  // 1. Pega os dados do usuário e a função de logout do contexto
  const { user, logout } = useAuth();

  // 2. Função para lidar com o clique no botão de sair
  const handleLogout = () => {
    logout();
    toast.success('Você saiu com segurança.');
    // O redirecionamento para /login será automático
    // (vamos configurar isso no próximo passo, no Router)
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Bem-vindo ao UaiFood!
        </h1>
        
        {/* Mostra o nome do usuário se ele estiver logado */}
        {user ? (
          <p className="mt-4 text-center text-lg text-gray-600">
            Olá, <span className="font-semibold">{user.name}</span>!
          </p>
        ) : (
          <p className="mt-4 text-center text-lg text-gray-600">
            Carregando seus dados...
          </p>
        )}

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full rounded-md bg-red-600 p-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sair (Logout)
        </button>
      </div>
    </div>
  );
}