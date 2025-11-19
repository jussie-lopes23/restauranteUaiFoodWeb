import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';


interface Client {
  name: string;
  email: string;
}

interface Item {
  description: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  item: Item;
}

type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERING' | 'DONE' | 'CANCELLED';

interface AdminOrder {
  id: string;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  client: Client; 
  orderItems: OrderItem[];
}

const possibleStatuses: OrderStatus[] = [
  'PENDING',
  'PREPARING',
  'DELIVERING',
  'DONE',
  'CANCELLED',
];

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

export default function AdminOrdersPage() {

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      toast.error('Não foi possível carregar os pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success('Status do pedido atualizado!');
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      toast.error('Não foi possível atualizar o status.');
    }
  };


  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-xl font-medium text-gray-700">A carregar pedidos...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Gestão de Pedidos</h1>

      {orders.length === 0 ? (
        <p className="text-lg text-gray-600">Nenhum pedido encontrado.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderTotal = order.orderItems.reduce((total, item) => {
              return total + parseFloat(item.unitPrice) * item.quantity;
            }, 0);

            return (
              <div
                key={order.id}
                className="rounded-lg bg-white p-6 shadow-md"
              >
                <div className="mb-4 flex flex-col justify-between border-b pb-4 sm:flex-row">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Pedido #{order.id.substring(0, 8)}...
                    </h2>
                    <p className="text-sm text-gray-500">
                      Cliente: {order.client.name} ({order.client.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      Feito em: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Mudar Status:
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className="rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {possibleStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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

                <div className="border-t pt-4">
                  <p className="text-right text-lg font-bold text-gray-900">
                    Total: {formatCurrency(orderTotal)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}