import { NavLink, Outlet } from 'react-router-dom';
import { User, MapPin, KeyRound } from 'lucide-react'; 

export default function MyAccountPage() {
  
  const activeClass = 'bg-blue-100 text-blue-700 border-l-4 border-blue-600';
  const inactiveClass = 'border-l-4 border-transparent hover:bg-gray-100';

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Minha Conta</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        
        <aside className="md:col-span-1">
          <nav className="flex flex-col space-y-2 rounded-lg bg-white p-4 shadow-md">
            <NavLink
              to="/perfil"
              end 
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 font-medium ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              <User size={20} />
              <span>Meu Perfil</span>
            </NavLink>

            <NavLink
              to="/perfil/enderecos"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 font-medium ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              <MapPin size={20} />
              <span>Meus Endereços</span>
            </NavLink>

            <NavLink
              to="/perfil/senha"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 font-medium ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              <KeyRound size={20} />
              <span>Mudar Senha</span>
            </NavLink>
            
          </nav>
        </aside>

        
        <div className="md:col-span-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <Outlet />
          </div>
        </div>
        
      </div>
    </div>
  );
}