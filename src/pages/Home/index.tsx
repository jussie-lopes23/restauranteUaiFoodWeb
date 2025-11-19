import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext';
import api from '../../services/api';
import { Search, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Imports do Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Tipos
interface Item {
  id: string;
  description: string;
  unitPrice: string;
  categoryId: string;
}

// Função auxiliar de moeda
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function HomePage() {
  const { user } = useAuth();
  const { addItem } = useCart();

  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Buscar todos os itens ao carregar (para a busca funcionar)
  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await api.get('/items');
        setAllItems(response.data);
      } catch (error) {
        console.error('Erro ao carregar itens para busca', error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  // 2. Lógica de Filtro (Busca)
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredItems([]);
    } else {
      const results = allItems.filter((item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(results);
    }
  }, [searchTerm, allItems]);

  // 3. Adicionar ao Carrinho
  const handleAddToCart = (item: Item) => {
    addItem({
      id: item.id,
      description: item.description,
      unitPrice: parseFloat(item.unitPrice),
      quantity: 1,
    });
  };

  return (
    <div className="pb-10">
      
      {/* --- SEÇÃO DE BOAS-VINDAS E BUSCA --- */}
      <div className="bg-blue-600 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold">
            Olá, {user?.name}! <span className="text-2xl font-normal"></span>
          </h1>
          <p className="mt-4 text-blue-100 text-lg">
            O que você vai pedir hoje? Temos ótimas opções esperando por você.
          </p>

          {/* Barra de Pesquisa */}
          <div className="mx-auto mt-8 max-w-2xl relative">
            <input
              type="text"
              placeholder="Busque por hambúrguer, pizza, bebida..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border-none py-4 pl-12 pr-4 text-gray-900 shadow-lg focus:ring-4 focus:ring-blue-300 outline-none"
            />
            <Search className="absolute left-4 top-4 text-gray-400" size={24} />
          </div>
        </div>
      </div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="mx-auto max-w-7xl px-4 mt-8">
        
        {/* SE ESTIVER BUSCANDO: Mostra Resultados */}
        {searchTerm.length > 0 ? (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Resultados para "{searchTerm}"
            </h2>
            
            {filteredItems.length === 0 ? (
              <p className="text-gray-500 text-center py-10">Nenhum produto encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <div key={item.id} className="flex flex-col justify-between rounded-xl bg-white p-4 shadow-md hover:shadow-lg transition-shadow">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.description}</h3>
                      <p className="mt-2 text-2xl font-bold text-blue-600">
                        {formatCurrency(parseFloat(item.unitPrice))}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="mt-4 flex items-center justify-center gap-2 w-full rounded-lg bg-green-600 py-2 text-white hover:bg-green-700"
                    >
                      <ShoppingBag size={18} /> Adicionar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          
          /* SE NÃO ESTIVER BUSCANDO: Mostra Promoções e Destaques */
          <div className="space-y-12">
            
            {/* Carrossel de Promoções */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">Promoções do Dia 🔥</h2>
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                className="rounded-xl shadow-lg"
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 }, // Tablet mostra 2 banners
                }}
              >
                {/* Banner 1 - Pizza */}
                <SwiperSlide>
                  <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gray-900">
                    <img 
                      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop" 
                      alt="Promoção Pizza" 
                      className="h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
                      <h3 className="text-3xl font-bold">Terça da Pizza!</h3>
                      <p className="mt-2 text-lg">Peça uma Grande e ganhe o refri.</p>
                    </div>
                  </div>
                </SwiperSlide>

                {/* Banner 2 - Burguer */}
                <SwiperSlide>
                  <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gray-900">
                    <img 
                      src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" 
                      alt="Promoção Burguer" 
                      className="h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
                      <h3 className="text-3xl font-bold">Combo Smash</h3>
                      <p className="mt-2 text-lg">O melhor sabor da cidade por apenas R$ 25,90.</p>
                    </div>
                  </div>
                </SwiperSlide>

                {/* Banner 3 - Sobremesa */}
                <SwiperSlide>
                  <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gray-900">
                    <img 
                      src="https://images.unsplash.com/photo-1563729768-397d697804de?q=80&w=1000&auto=format&fit=crop" 
                      alt="Promoção Doce" 
                      className="h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
                      <h3 className="text-3xl font-bold">Adoce seu dia</h3>
                      <p className="mt-2 text-lg">Sobremesas com 15% de desconto.</p>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </section>

            {/* Atalhos Rápidos */}
            <section className="text-center">
              <h2 className="mb-6 text-2xl font-bold text-gray-800">O que deseja fazer?</h2>
              <div className="flex justify-center gap-4 flex-wrap">
                <a href="/cardapio" className="flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all">
                  <span className="text-4xl mb-2">🍔</span>
                  <span className="font-semibold text-gray-700">Cardápio Completo</span>
                </a>
                <a href="/meus-pedidos" className="flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all">
                  <span className="text-4xl mb-2">🧾</span>
                  <span className="font-semibold text-gray-700">Meus Pedidos</span>
                </a>
                <a href="/perfil" className="flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all">
                  <span className="text-4xl mb-2">👤</span>
                  <span className="font-semibold text-gray-700">Minha Conta</span>
                </a>
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}