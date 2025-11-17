import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

// --- 1. Definição de Tipos (Importante) ---
// Estes tipos devem corresponder ao que a sua API retorna
// (especialmente a API GET /api/orders)

interface Item {
  id: string;
  description: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  item: Item;
}

interface Order {
  id: string;
  status: string;
  paymentMethod: 'CASH' | 'DEBIT' | 'CREDIT' | 'PIX';
  createdAt: string; // O Prisma envia datas como strings ISO (ex: "2023-11-17T...")
  orderItems: OrderItem[];
}

// Função para formatar moeda
const formatCurrency = (value: number | string) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
};

// Função para formatar data
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

export default function MyOrdersPage() {
  // --- 2. Hooks de Estado ---
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 3. Busca de Dados ---
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        // Graças ao nosso AuthContext, esta chamada já inclui o token
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        toast.error('Não foi possível carregar seus pedidos.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []); // O array vazio [] garante que rode só uma vez

  // --- 4. Renderização ---

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-xl font-medium text-gray-700">A carregar pedidos...</p>
      </div>
    );
  }

  // Se não houver pedidos
  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Sem pedidos por aqui</h1>
        <p className="mt-4 text-lg text-gray-600">
          Você ainda não fez nenhum pedido.
        </p>
        <Link
          to="/cardapio"
          className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
        >
          Ver Cardápio
        </Link>
      </div>
    );
  }

  // Se houver pedidos
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Meus Pedidos</h1>

      <div className="space-y-6">
        {/* Loop pelos Pedidos */}
        {orders.map((order) => {
          // Calcula o total do pedido
          const orderTotal = order.orderItems.reduce((total, item) => {
            return total + parseFloat(item.unitPrice) * item.quantity;
          }, 0);

          return (
            <Link
            key={order.id} // <-- A ÚNICA key, no elemento <Link>
            to={`/pedidos/${order.id}`} // Link para a página de detalhes
            className="block rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            {/* O conteúdo do pedido vem direto aqui, 
                REMOVA o <div key={order.id}...> que estava aqui */}

            {/* Cabeçalho do Pedido */}
            <div className="mb-4 flex flex-col justify-between border-b pb-4 sm:flex-row">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Pedido #{order.id.substring(0, 8)}...
                </h2>
                <p className="text-sm text-gray-500">
                  Feito em: {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="mt-2 sm:mt-0 sm:text-right">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold
                    ${
                      order.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="mb-4">
              <h3 className="mb-2 text-md font-semibold text-gray-700">Itens:</h3>
              <ul className="list-inside list-disc space-y-1 pl-2">
                {order.orderItems.map((item) => (
                  <li key={item.id} className="text-gray-600">
                    {item.quantity}x {item.item.description} (
                    {formatCurrency(item.unitPrice)})
                  </li>
                ))}
              </ul>
            </div>

            {/* Rodapé do Pedido */}
            <div className="border-t pt-4">
              <p className="text-right text-lg font-bold text-gray-900">
                Total: {formatCurrency(orderTotal)}
              </p>
            </div>
          </Link>    
          );
        })}
      </div>
    </div>
  );
}