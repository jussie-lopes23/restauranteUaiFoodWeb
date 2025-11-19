import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Trash, Edit } from 'lucide-react';
import axios from 'axios';

interface Category {
  id: string;
  description: string;
}
interface Item {
  id: string;
  description: string;
  unitPrice: string; 
  categoryId: string;
  category?: Category; 
}

const formatCurrency = (value: number | string) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
};

const initialFormState = {
  description: '',
  unitPrice: '',
  categoryId: '',
};

export default function AdminItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formState, setFormState] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  const [categoryFilter, setCategoryFilter] = useState<string>('all'); 

  const formRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsResponse, categoriesResponse] = await Promise.all([
        api.get('/items'),
        api.get('/categories'),
      ]);
      setItems(itemsResponse.data);
      setCategories(categoriesResponse.data);

      if (categoriesResponse.data.length > 0 && !editingItemId) {
        setFormState((prev) => ({
          ...prev,
          categoryId: categoriesResponse.data[0].id,
        }));
      }
    } catch (err) {
      toast.error('Não foi possível carregar os dados do cardápio.');
    } finally {
      setLoading(false);
    }
  };

 -
  useEffect(() => {
    fetchData();
  }, []); 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditClick = (item: Item) => {
    setFormState({
      description: item.description,
      unitPrice: item.unitPrice,
      categoryId: item.categoryId,
    });
    setEditingItemId(item.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleCancelEdit = () => {
    const defaultCatId = categories.length > 0 ? categories[0].id : '';
    setFormState({ ...initialFormState, categoryId: defaultCatId });
    setEditingItemId(null);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem a certeza que quer apagar este item?')) {
      try {
        await api.delete(`/items/${id}`);
        toast.success('Item apagado com sucesso.');
        fetchData(); 
      } catch (err) {
        toast.error('Não foi possível apagar o item.');
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const dataToSend = {
      ...formState,
      unitPrice: parseFloat(formState.unitPrice),
    };
    try {
      if (editingItemId) {
        await api.put(`/items/${editingItemId}`, dataToSend);
        toast.success('Item atualizado com sucesso!');
      } else {
        await api.post('/items', dataToSend);
        toast.success('Item criado com sucesso!');
      }
      handleCancelEdit();
      fetchData(); 
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const firstError = err.response.data.errors?.[0]?.message;
        toast.error(firstError || 'Erro ao guardar o item.');
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  
  const filteredItems = items.filter(item => {
    if (categoryFilter === 'all') {
      return true;
    }
    return item.categoryId === categoryFilter;
  });


  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Gestão de Cardápio (Itens)</h1>

      <div ref={formRef} className="mb-10 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          {editingItemId ? 'Editar Item' : 'Adicionar Novo Item'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição do Item</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formState.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border p-2"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">Preço (ex: 45.50)</label>
              <input
                type="number"
                id="unitPrice"
                name="unitPrice"
                value={formState.unitPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="mt-1 block w-full rounded-md border p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Categoria</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formState.categoryId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border p-2"
                required
              >
                {categories.length === 0 && <option>A carregar...</option>}
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.description}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={formLoading}
              className="rounded-md bg-green-600 p-2 px-4 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {formLoading ? 'A guardar...' : (editingItemId ? 'Guardar Alterações' : 'Adicionar Item')}
            </button>
            {editingItemId && (
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
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Itens Cadastrados</h2>
          
          <div className="flex items-center gap-2">
            <label htmlFor="categoryFilter" className="text-sm font-medium text-gray-700">
              Filtrar por:
            </label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.description}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <p>A carregar itens...</p>
          ) : (
            <>
              {filteredItems.length === 0 ? (
                <p>Nenhum item encontrado {categoryFilter !== 'all' ? 'nesta categoria' : ''}.</p>
              ) : (
                filteredItems.map((item) => ( 
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{item.description}</p>
                      <p className="text-sm text-gray-600">
                        Preço: {formatCurrency(item.unitPrice)} | Categoria: {item.category?.description || categories.find(c => c.id === item.categoryId)?.description || 'N/A'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                        title="Editar item"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                        title="Apagar item"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}