import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Trash, Edit } from 'lucide-react';
import axios from 'axios';

interface Category {
  id: string;
  description: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [description, setDescription] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      toast.error('Não foi possível carregar as categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (category: Category) => {
    setDescription(category.description);
    setEditingCategoryId(category.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setDescription('');
    setEditingCategoryId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem a certeza que quer apagar esta categoria? (Isto pode falhar se a categoria estiver a ser usada por um item)')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Categoria apagada com sucesso.');
        fetchCategories();
      } catch (err: any) {
        if (err.response?.status === 409) { 
          toast.error('Não é possível apagar: esta categoria está em uso por um item.');
        } else {
          toast.error('Não foi possível apagar a categoria.');
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.length < 2) {
      toast.error('A descrição deve ter pelo menos 2 caracteres.');
      return;
    }
    setFormLoading(true);

    const dataToSend = { description };

    try {
      if (editingCategoryId) {
        await api.put(`/categories/${editingCategoryId}`, dataToSend);
        toast.success('Categoria atualizada com sucesso!');
      } else {

        await api.post('/categories', dataToSend);
        toast.success('Categoria criada com sucesso!');
      }

      handleCancelEdit(); 
      fetchCategories(); 

    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 409) { 
          toast.error(err.response.data.message);
        } else {
          const firstError = err.response.data.errors?.[0]?.message;
          toast.error(firstError || 'Erro ao guardar a categoria.');
        }
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Gestão de Categorias</h1>

      <div ref={formRef} className="mb-10 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          {editingCategoryId ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição da Categoria
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border p-2"
              required
            />
          </div>
          <div className="flex items-end space-x-4">
            <button
              type="submit"
              disabled={formLoading}
              className="rounded-md bg-green-600 p-2 px-4 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {formLoading ? 'A guardar...' : (editingCategoryId ? 'Guardar' : 'Adicionar')}
            </button>
            {editingCategoryId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-md bg-gray-500 p-2 px-4 text-white hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Categorias Cadastradas</h2>
        {loading ? (
          <p>A carregar categorias...</p>
        ) : (
          <div className="space-y-4">
            {categories.length === 0 ? (
              <p>Nenhuma categoria cadastrada.</p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <p className="font-semibold text-gray-800">{cat.description}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(cat)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                      title="Editar categoria"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="Apagar categoria"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}