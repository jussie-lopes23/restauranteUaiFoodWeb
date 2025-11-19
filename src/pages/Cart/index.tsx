import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../hooks/useAuth'; 
import api from '../../services/api'; 
import { toast } from 'react-hot-toast';
import { Trash, Plus, Minus, Home, CreditCard } from 'lucide-react';

interface Address {
  id: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

const paymentMethods = [
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'DEBIT', label: 'Cartão de Débito' },
  { value: 'CREDIT', label: 'Cartão de Crédito' },
  { value: 'PIX', label: 'PIX' },
];

export default function CartPage() {
  const { state, removeItem, updateQuantity, totalPrice, totalItems, clearCart } =
    useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  
  useEffect(() => {
    // Só busca se o usuário estiver logado
    if (user) {
      async function fetchAddresses() {
        try {
          const response = await api.get('/addresses');
          setAddresses(response.data);
          if (response.data.length > 0) {
            setSelectedAddress(response.data[0].id);
          }
        } catch (error) {
          console.error('Erro ao buscar endereços:', error);
          toast.error('Não foi possível carregar seus endereços.');
        }
      }
      fetchAddresses();
    }
  }, [user]);

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error('Por favor, selecione um endereço de entrega.');
      return;
    }
    if (!selectedPayment) {
      toast.error('Por favor, selecione uma forma de pagamento.');
      return;
    }

    const orderData = {
      addressId: selectedAddress,
      paymentMethod: selectedPayment,
      items: state.items.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
      })),
    };

    try {

      await api.post('/orders', orderData);

      toast.success('Pedido realizado com sucesso!');
      clearCart(); 
      navigate('/meus-pedidos'); 
    } catch (error: any) {
      console.error('Erro ao finalizar pedido:', error);
      const errorMsg =
        error.response?.data?.message ||
        'Não foi possível finalizar o pedido.';
      toast.error(errorMsg);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };


//  if (state.items.length === 0) {
//     return (
//       <div className="mx-auto max-w-7xl p-8 text-center">
//         <h1 className="text-3xl font-bold text-gray-800">Seu carrinho está vazio</h1>
//         <p className="mt-4 text-lg text-gray-600">
//           Que tal adicionar alguns itens do nosso cardápio?
//         </p>
//         <Link
//           to="/cardapio"
//           className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
//         >
//           Ver Cardápio
//         </Link>
//       </div>
//     );
//   }

 
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Seu Carrinho ({totalItems()})
      </h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ul className="space-y-4">
            {state.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col rounded-lg bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.description}
                  </h2>
                  <p className="text-md text-gray-600">
                    {formatCurrency(item.unitPrice)} / un.
                  </p>
                  <p className="mt-2 text-xl font-bold text-blue-600">
                    Subtotal: {formatCurrency(item.unitPrice * item.quantity)}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between sm:mt-0 sm:justify-normal sm:space-x-4">
                  <div className="flex items-center space-x-2 rounded-md border border-gray-300">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="p-2 text-gray-600 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-2 text-gray-600 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                    title="Remover item"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-1">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Resumo do Pedido</h2>
            
            <div className="mb-4">
              <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
                <Home size={16} className="mr-2" />
                Endereço de Entrega
              </label>
              {addresses.length > 0 ? (
                <select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.street}, {addr.number} - {addr.district}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-500">
                  Nenhum endereço cadastrado. 
                  <Link to="/perfil/enderecos" className="text-blue-600 hover:underline">
                    Adicionar
                  </Link>
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
                <CreditCard size={16} className="mr-2" />
                Forma de Pagamento
              </label>
              <select
                value={selectedPayment}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="" disabled>Selecione...</option>
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 flex justify-between text-lg">
              <span>Total de Itens:</span>
              <span className="font-medium">{totalItems()}</span>
            </div>
            <div className="mb-6 flex justify-between text-2xl font-bold">
              <span>Valor Total:</span>
              <span>{formatCurrency(totalPrice())}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={!selectedAddress || !selectedPayment}
              className="w-full rounded-md bg-green-600 p-3 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}