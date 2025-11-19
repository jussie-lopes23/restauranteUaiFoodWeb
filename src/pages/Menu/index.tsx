import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast'; 
import { useCart, type CartItem } from '../../contexts/CartContext';

interface Category {
  id: string;
  description: string;
}

interface Item {
  id: string;
  description: string;
  unitPrice: string; 
  categoryId: string; 
  
}

export default function MenuPage() {
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [categoryResponse, itemResponse] = await Promise.all([
          api.get('/categories'), 
          api.get('/items'),      
        ]);

        setCategories(categoryResponse.data);
        setItems(itemResponse.data);
      } catch (err) {
        console.error('Erro ao buscar cardápio:', err);
        toast.error('Não foi possível carregar o cardápio.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []); 

  const handleAddItem = (item: Item) => {
    const itemToAdd: CartItem = {
      id: item.id,
      description: item.description,
      unitPrice: parseFloat(item.unitPrice), 
      quantity: 1, 
    };
    addItem(itemToAdd);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-xl font-medium text-gray-700">A carregar cardápio...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Nosso Cardápio</h1>

      {categories.length > 0 ? (
        categories.map((category) => {
          const itemsInCategory = items.filter(
            (item) => item.categoryId === category.id
          );

          return (
            <section key={category.id} className="mb-12">
              <h2 className="mb-4 border-b-2 border-blue-600 pb-2 text-2xl font-semibold text-gray-800">
                {category.description}
              </h2>

              {itemsInCategory.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {itemsInCategory.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between overflow-hidden rounded-lg bg-white shadow-md"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.description}
                        </h3>
                        <p className="mt-2 text-xl font-bold text-blue-600">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(parseFloat(item.unitPrice))}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddItem(item)} 
                        className="w-full bg-green-600 p-3 text-white transition-colors hover:bg-green-700"
                      >
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  Nenhum item encontrado nesta categoria.
                </p>
              )}
            </section>
          );
        })
      ) : (
        <p className="text-lg text-gray-600">
          Nenhuma categoria encontrada.
        </p>
      )}
    </div>
  );
}