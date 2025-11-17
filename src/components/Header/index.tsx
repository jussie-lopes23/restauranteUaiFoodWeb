import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Nosso hook de autenticação
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

export default function Header() {
  // Pega o status de autenticação e as funções do nosso contexto
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const handleLogout = () => {
    logout();
    toast.success('Você saiu com segurança.');
    // O PrivateRoute vai cuidar do redirecionamento
  };

  return (
    <header className="w-full bg-white shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        
        {/* 1. Logo (Link para a Home) */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          UaiFood
        </Link>

        {/* 2. Links de Navegação */}
        <div className="flex items-center space-x-6">
          {user ? (
            // --- Se estiver LOGADO ---
            
            <>
              {/* Mostra o nome do usuário */}

              <span className="text-gray-700">
                Olá, <span className="font-semibold">{user.name}</span>
              </span>

              {/* --- NOVO LINK DE ADMIN --- */}
              {/* Só aparece se o utilizador for ADMIN */}
              {user.type === 'ADMIN' && (
                <Link
                  to="/admin/pedidos" // Link para a futura pág. de gestão
                  className="rounded-md bg-yellow-400 px-3 py-1 font-bold text-yellow-900 hover:bg-yellow-300"
                >
                  Painel Admin
                </Link>
              )}

              <Link
                to="/cardapio"
                className="font-medium text-gray-600 hover:text-blue-600"
              >
                Cardápio
              </Link>

              <Link
                to="/meus-pedidos" // (Ainda não criamos essa rota)
                className="text-gray-600 hover:text-blue-600"
              >
                Meus Pedidos
              </Link>

              <Link
                to="/perfil"
                className="text-gray-600 hover:text-blue-600"
              >
                Minha Conta
              </Link>

              <Link
                to="/carrinho"
                className="relative flex items-center text-gray-600 hover:text-blue-600"
              >
                <ShoppingCart size={20} />
                {totalItems() > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {totalItems()}
                  </span>
                )}
              </Link>
              
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              >
                Sair
              </button>
            </>
          ) : (
            // --- Se estiver DESLOGADO ---
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700"
              >
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}