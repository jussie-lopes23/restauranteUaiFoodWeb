import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

export default function AdminHeader() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Você saiu com segurança.');
  };

  // Estilos para os links de navegação do admin
  const activeClass = 'font-bold text-blue-600';
  const inactiveClass = 'text-gray-600 hover:text-blue-600';

  return (
    <header className="w-full bg-white shadow-md z-10 relative">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        
        {/* 1. Logo (Link para o painel admin) */}
        <Link to="/admin/pedidos" className="text-2xl font-bold text-yellow-900">
          UaiFood <span className="text-sm font-normal text-yellow-700">(Admin)</span>
        </Link>

        {/* 2. Links de Navegação Admin */}
        <div className="flex items-center space-x-6">

        {/* 3. Informações do Usuário e Logout */}
          <span className="text-gray-700">
            Olá, <span className="font-semibold">{user?.name} (Admin)</span>
          </span>

          <NavLink
            to="/admin/pedidos"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            

            Gestão de Pedidos
          </NavLink>

          <NavLink
            to="/admin/itens"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            Gestão de Itens
          </NavLink>

          <NavLink
            to="/admin/categorias"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            Gestão de Categorias
          </NavLink>

          <NavLink
            to="/admin/usuarios"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            Gestão de Usuários
          </NavLink>
          
          {/* (Links futuros)
          <NavLink
            to="/admin/itens"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            Gestão de Itens
          </NavLink>
          <NavLink
            to="/admin/usuarios"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            Gestão de Usuários
          </NavLink>
          */}

          
          
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      </nav>
    </header>
  );
}