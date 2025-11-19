import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';


type UserType = 'CLIENT' | 'ADMIN';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
}

export default function AdminUsersPage() {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: adminUser } = useAuth();

  
  const [roleFilter, setRoleFilter] = useState<UserType | 'all'>('all');

 
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      toast.error('Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserType) => {
    //Bloqueia auto-edição
    if (userId === adminUser?.id) {
      toast.error('Você não pode alterar seu próprio tipo.');
      return;
    }

    try {
      await api.put(`/users/${userId}`, { type: newRole });
      toast.success(`Tipo do usuário ${newRole} atualizado com sucesso!`);
      
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, type: newRole } : u
        )
      );

    } catch (err: unknown) {
      console.error('Erro ao mudar tipo:', err);
      toast.error('Não foi possível atualizar o tipo.');
      
      fetchUsers(); 
    }
  };

  const handleDelete = async (userId: string) => {
    if (userId === adminUser?.id) {
      toast.error('Você não pode deletar a si mesmo.');
      return;
    }
    
    if (window.confirm('Tem certeza que quer deletar este usuário? Esta ação é irreversível.')) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success('Usuário deletado com sucesso.');
        await fetchUsers();
        
      } catch (err: any) {
        if (err.response?.status === 409) {
          toast.error('Não é possível deletar: este usuário possui pedidos cadastrados.');
        } else {
          toast.error('Não foi possível deletar o usuário.');
        }
      }
    }
  };

  const filteredUsers = users.filter(user => {
    if (roleFilter === 'all') {
      return true; 
    }
    return user.type === roleFilter; 
  });

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
      
        <div className="flex items-center gap-2">
          <label htmlFor="roleFilter" className="text-sm font-medium text-gray-700">
            Mostrar:
          </label>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserType | 'all')}
            className="rounded-md border border-gray-300 p-2 text-sm"
          >
            <option value="all">Todos Usuários</option>
            <option value="CLIENT">Apenas Clientes</option>
            <option value="ADMIN">Apenas Admins</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white p-6 shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email / Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tipo (Role)</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
              </tr>
            </thead>
          
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Nenhum usuário encontrado {roleFilter !== 'all' ? 'para este filtro' : ''}.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <p className="text-sm text-gray-800">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <select
                        value={user.type}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserType)}
                        disabled={user.id === adminUser?.id}
                        className="rounded-md border-gray-300 p-2 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <option value="CLIENT">CLIENTE</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={user.id === adminUser?.id}
                        className="p-2 text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Deletar usuário"
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}