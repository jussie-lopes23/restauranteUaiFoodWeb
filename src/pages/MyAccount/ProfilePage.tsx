import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function ProfilePage() {
  const { user, login, logout } = useAuth(); // Pegamos o 'login' para atualizar os dados do user no AuthContext
  
  // Inicializa o estado com os dados do usuário logado
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.put('/users/me', { name, phone });
      
      // 'login' é a nossa função que atualiza o AuthContext
      // Re-chamá-la com o token antigo força uma busca /me
      // e atualiza os dados do usuário (ex: "Olá, Jussi") no Header
      const token = localStorage.getItem('@UaiFood:token');
      if (token) {
        await login(token); // Revalida e atualiza o 'user' global
      }
      
      toast.success('Perfil atualizado com sucesso!');
      
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      toast.error('Não foi possível atualizar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Pede confirmação
    if (
      !window.confirm(
        'Tem a certeza? Esta ação é irreversível e irá apagar a sua conta.'
      )
    ) {
      return;
    }

    try {
      await api.delete('/users/me');
      toast.success('Conta apagada com sucesso.');
      // Desloga o utilizador
      logout(); 
      // O PrivateRoute irá automaticamente redirecionar para /login
    } catch (err: unknown) {
      console.error('Erro ao apagar conta:', err);
      // Trata o erro 409 (utilizador com pedidos)
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Não foi possível apagar a sua conta.');
      }
    }
  };

  if (!user) {
    return <p>A carregar...</p>;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Meu Perfil</h2>
      
      {/* E-mail (não editável) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">E-mail</label>
        <input
          type="email"
          disabled
          value={user.email}
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 shadow-sm"
        />
        <p className="mt-1 text-xs text-gray-500">O e-mail não pode ser alterado.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Campo de Nome */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome Completo
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Campo de Telefone */}
        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'A guardar...' : 'Guardar Alterações'}
        </button>
      </form>

      <div className="mt-10 border-t border-red-300 pt-6">
        <h3 className="text-xl font-semibold text-red-700">Zona de Perigo</h3>
        <p className="mt-2 text-sm text-gray-600">
          Esta ação não pode ser desfeita. Isto irá apagar permanentemente a
          sua conta e todos os seus dados (incluindo o seu histórico de pedidos).
        </p>
        <button
          onClick={handleDeleteAccount}
          className="mt-4 rounded-md bg-red-600 p-2 px-4 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Apagar Minha Conta
        </button>
      </div>
      
    </div>
  );
}