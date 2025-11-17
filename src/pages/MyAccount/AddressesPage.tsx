import { useState, useEffect, useRef } from 'react'; // NOVO: useRef
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Trash, MapPin, Edit } from 'lucide-react'; // NOVO: Edit
import axios from 'axios';

// 1. Tipo de Endereço
interface Address {
  id: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

// 2. Estado inicial do formulário (para limpar)
const initialFormState = {
  street: '',
  number: '',
  district: '',
  city: '',
  state: '',
  zipCode: '',
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);

  // NOVO: Estado para saber qual endereço estamos a editar
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  // NOVO: Referência ao topo do formulário para "scrollar"
  const formRef = useRef<HTMLDivElement>(null);

  // 3. Função para buscar os endereços (igual)
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/addresses');
      setAddresses(response.data);
    } catch (err) {
      console.error('Erro ao buscar endereços:', err);
      toast.error('Não foi possível carregar os seus endereços.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Buscar endereços (igual)
  useEffect(() => {
    fetchAddresses();
  }, []);

  // 5. Handler para o formulário (igual)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // 6. NOVO: Handler de Submit (Adicionar OU Editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingAddressId) {
        // --- LÓGICA DE EDIÇÃO ---
        await api.put(`/addresses/${editingAddressId}`, formState);
        toast.success('Endereço atualizado com sucesso!');
      } else {
        // --- LÓGICA DE ADIÇÃO ---
        await api.post('/addresses', formState);
        toast.success('Endereço adicionado com sucesso!');
      }
      
      setFormState(initialFormState); // Limpa o formulário
      setEditingAddressId(null); // Sai do modo de edição
      await fetchAddresses(); // Atualiza a lista
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const firstError = err.response.data.errors?.[0]?.message;
        toast.error(firstError || 'Erro ao guardar endereço.');
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  // 7. NOVO: Handler para clicar em "Editar"
  const handleEditClick = (address: Address) => {
    // Preenche o formulário com os dados do endereço
    setFormState({
      street: address.street,
      number: address.number,
      district: address.district,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });
    // Define o ID que estamos a editar
    setEditingAddressId(address.id);
    // Rola a página para o topo (para o formulário)
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // 8. NOVO: Handler para "Cancelar Edição"
  const handleCancelEdit = () => {
    setFormState(initialFormState);
    setEditingAddressId(null);
  };

  // 7. Handler para Deletar Endereço (igual)
  const handleDeleteAddress = async (id: string) => {
    // ... (código do handleDeleteAddress - sem alterações)
  };

  // --- 9. JSX da Página (Atualizado) ---
  return (
    <div>
      {/* Formulário (agora com ref) */}
      <div ref={formRef}>
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          {/* NOVO: Título dinâmico */}
          {editingAddressId ? 'Editar Endereço' : 'Adicionar Novo Endereço'}
        </h2>
        <form onSubmit={handleSubmit} className="mb-10 space-y-4 border-b pb-10">
          {/* ... (todos os inputs do formulário - sem alterações) ... */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              name="street"
              value={formState.street}
              onChange={handleChange}
              placeholder="Rua / Avenida"
              className="rounded-md border p-2"
              required
            />
            <input
              name="number"
              value={formState.number}
              onChange={handleChange}
              placeholder="Número"
              className="rounded-md border p-2 sm:col-span-1"
              required
            />
            <input
              name="district"
              value={formState.district}
              onChange={handleChange}
              placeholder="Bairro"
              className="rounded-md border p-2 sm:col-span-1"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              name="city"
              value={formState.city}
              onChange={handleChange}
              placeholder="Cidade"
              className="rounded-md border p-2"
              required
            />
            <input
              name="state"
              value={formState.state}
              onChange={handleChange}
              placeholder="Estado (ex: MG)"
              maxLength={2}
              className="rounded-md border p-2"
              required
            />
            <input
              name="zipCode"
              value={formState.zipCode}
              onChange={handleChange}
              placeholder="CEP (só números)"
              maxLength={8}
              className="rounded-md border p-2"
              required
            />
          </div>
          
          {/* NOVO: Botões dinâmicos */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={formLoading}
              className="rounded-md bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {formLoading 
                ? (editingAddressId ? 'A guardar...' : 'A adicionar...')
                : (editingAddressId ? 'Guardar Alterações' : 'Adicionar Endereço')
              }
            </button>
            {/* NOVO: Botão de Cancelar */}
            {editingAddressId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-md bg-gray-500 p-2 text-white hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Endereços Salvos */}
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Meus Endereços Salvos</h2>
      {loading ? (
        <p>A carregar endereços...</p>
      ) : (
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <p className="text-gray-500">Nenhum endereço salvo.</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                {/* ... (info do endereço) ... */}
                <div className="flex items-center">
                  <MapPin size={24} className="mr-4 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {addr.street}, {addr.number}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.district}, {addr.city} - {addr.state}
                    </p>
                    <p className="text-sm text-gray-600">CEP: {addr.zipCode}</p>
                  </div>
                </div>
                
                {/* NOVO: Botões de Ação */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(addr)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                    title="Editar endereço"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                    title="Remover endereço"
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
  );
}