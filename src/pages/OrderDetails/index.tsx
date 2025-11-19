import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';


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

interface Address {
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
}

interface Order {
  id: string;
  status: string;
  paymentMethod: 'CASH' | 'DEBIT' | 'CREDIT' | 'PIX';
  createdAt: string;
  orderItems: OrderItem[];
  address: Address; 
}


const formatCurrency = (value: number | string) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

export default function OrderDetailsPage() {
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return; 

    async function fetchOrderDetails() {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar detalhes do pedido:', err);
        const errorMsg =
          err.response?.status === 403
            ? 'Você não tem permissão para ver este pedido.'
            : 'Não foi possível carregar o pedido.';
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [id]); 


  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center">
        <p className="text-xl font-medium text-gray-700">A carregar detalhes...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Pedido não encontrado</h1>
        <Link
          to="/meus-pedidos"
          className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
        >
          Voltar para Meus Pedidos
        </Link>
      </div>
    );
  }

  const orderTotal = order.orderItems.reduce((total, item) => {
    return total + parseFloat(item.unitPrice) * item.quantity;
  }, 0);

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <Link
        to="/meus-pedidos"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        &larr; Voltar para Meus Pedidos
      </Link>
      
      <div className="rounded-lg bg-white p-6 shadow-md">
        
        <div className="mb-4 flex flex-col justify-between border-b pb-4 sm:flex-row">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalhes do Pedido #{order.id.substring(0, 8)}...
            </h1>
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-800">Endereço de Entrega</h2>
            {order.address ? (
              <div className="text-gray-700">
                <p>{order.address.street}, {order.address.number}</p>
                <p>{order.address.district}</p>
                <p>{order.address.city} - {order.address.state}</p>
              </div>
            ) : (
              <p className="text-gray-500">Endereço não disponível.</p>
            )}
            
          </div>
          
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-800">Pagamento</h2>
            <p className="text-gray-700">{order.paymentMethod}</p>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Itens Inclusos</h2>
          <ul className="space-y-2">
            {order.orderItems.map((item) => (
              <li key={item.id} className="flex justify-between text-gray-700">
                <span>
                  {item.quantity}x {item.item.description}
                </span>
                <span className="font-medium">
                  {formatCurrency(parseFloat(item.unitPrice) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 border-t pt-6 text-right">
          <p className="text-2xl font-bold text-gray-900">
            Total do Pedido: {formatCurrency(orderTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}