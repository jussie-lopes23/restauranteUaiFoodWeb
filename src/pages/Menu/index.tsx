import { useState, useEffect } from 'react';
import api from '../../services/api'; // Nosso axios
import { toast } from 'react-hot-toast'; // Para pop-ups de erro
import { useCart, type CartItem } from '../../contexts/CartContext';

// --- 1. Definição de Tipos ---
// O que esperamos receber da nossa API

interface Category {
  id: string;
  description: string;
}

interface Item {
  id: string;
  description: string;
  unitPrice: string; // O Prisma envia 'Decimal' como 'string' no JSON
  categoryId: string; // O ID da categoria a que pertence
  // (Assumindo que o back-end também envia o categoryId)
}

export default function MenuPage() {
  // --- 2. Hooks de Estado ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();

  // --- 3. Busca de Dados ---
  // Roda uma vez quando o componente é montado
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Faz as duas chamadas à API em paralelo
        const [categoryResponse, itemResponse] = await Promise.all([
          api.get('/categories'), // Rota pública
          api.get('/items'),       // Rota pública
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
  }, []); // O array vazio [] garante que rode só uma vez

  // --- 3. FUNÇÃO DE HANDLER ---
  // Esta função cria o objeto CartItem e o envia para o contexto
  const handleAddItem = (item: Item) => {
    const itemToAdd: CartItem = {
      id: item.id,
      description: item.description,
      unitPrice: parseFloat(item.unitPrice), // Converte a string para número
      quantity: 1, // Adiciona 1 unidade por defeito
    };
    addItem(itemToAdd);
  };

  // --- 4. Renderização ---

  // Estado de Carregamento
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-xl font-medium text-gray-700">A carregar cardápio...</p>
      </div>
    );
  }

  // Estado Principal (com Tailwind)
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Nosso Cardápio</h1>

      {/* Loop pelas Categorias */}
      {categories.length > 0 ? (
        categories.map((category) => {
          // Filtra os itens que pertencem a esta categoria
          const itemsInCategory = items.filter(
            (item) => item.categoryId === category.id
          );

          return (
            // Secção da Categoria
            <section key={category.id} className="mb-12">
              <h2 className="mb-4 border-b-2 border-blue-600 pb-2 text-2xl font-semibold text-gray-800">
                {category.description}
              </h2>

              {/* Grelha de Itens */}
              {itemsInCategory.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {itemsInCategory.map((item) => (
                    // Card do Item
                    <div
                      key={item.id}
                      className="flex flex-col justify-between overflow-hidden rounded-lg bg-white shadow-md"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.description}
                        </h3>
                        <p className="mt-2 text-xl font-bold text-blue-600">
                          {/* Formata o preço para R$ */}
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(parseFloat(item.unitPrice))}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddItem(item)} // Chama a função de handler
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