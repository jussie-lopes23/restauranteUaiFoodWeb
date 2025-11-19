import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function ProfilePage() {
  const { user, login, logout } = useAuth(); 
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.put('/users/me', { name, phone });
      
      const token = localStorage.getItem('@UaiFood:token');
      if (token) {
        await login(token); 
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
      logout(); 
    } catch (err: unknown) {
      console.error('Erro ao apagar conta:', err);
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