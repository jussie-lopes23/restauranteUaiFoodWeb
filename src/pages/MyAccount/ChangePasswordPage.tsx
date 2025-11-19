import { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import axios from 'axios'; 

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error('As novas senhas não coincidem.');
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter no mínimo 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      await api.put('/users/me/password', {
        oldPassword,
        newPassword,
      });

      toast.success('Senha alterada com sucesso!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      console.error('Erro ao alterar senha:', err);
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          toast.error('A sua senha antiga está incorreta.');
        } else {
          toast.error(
            err.response.data.message || 'Não foi possível alterar a senha.'
          );
        }
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Mudar Senha</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Senha Antiga
          </label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Nova Senha
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirmar Nova Senha
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'A guardar...' : 'Alterar Senha'}
        </button>
      </form>
    </div>
  );
}