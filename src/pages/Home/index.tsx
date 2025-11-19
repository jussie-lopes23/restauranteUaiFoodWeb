import { useAuth } from '../../hooks/useAuth'; 
import { toast } from 'react-hot-toast'; 

export default function HomePage() {
  
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Você saiu com segurança.');
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Bem-vindo ao UaiFood!
        </h1>
        
        {user ? (
          <p className="mt-4 text-center text-lg text-gray-600">
            Olá, <span className="font-semibold">{user.name}</span>!
          </p>
        ) : (
          <p className="mt-4 text-center text-lg text-gray-600">
            Carregando seus dados...
          </p>
        )}

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