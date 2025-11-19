import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext';
import api from '../../services/api';
import { Search, ShoppingBag, PlusCircle, Utensils } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


interface Item {
  id: string;
  description: string;
  unitPrice: string;
  categoryId: string;
}


const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function HomePage() {
  const { user } = useAuth();
  const { addItem } = useCart();

 
  const [searchTerm, setSearchTerm] = useState('');
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await api.get('/items');
        setAllItems(response.data);
      } catch (error) {
        console.error('Erro ao carregar itens', error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  //Lógica de Filtro de busca
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

  
  const handleAddToCart = (item: Item) => {
    addItem({
      id: item.id,
      description: item.description,
      unitPrice: parseFloat(item.unitPrice),
      quantity: 1,
    });
  };

  
  const featuredItems = allItems.slice(0, 5);

  return (
    <div className="pb-10">
      
      <div className="bg-blue-600 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold">
            Olá, {user?.name}! <span className="text-2xl font-normal"></span>
          </h1>
          <p className="mt-4 text-blue-100 text-lg">
            O que você vai pedir hoje?
          </p>

          <div className="mx-auto mt-8 max-w-2xl relative">
            <input
              type="text"
              placeholder="Busque por nome do produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border-none py-4 pl-12 pr-4 text-gray-900 shadow-lg focus:ring-4 focus:ring-blue-300 outline-none"
            />
            <Search className="absolute left-4 top-4 text-gray-400" size={24} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 mt-8">
        
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
                  <div key={item.id} className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                    <div>
                      <div className="flex items-start justify-between">
                         <h3 className="text-lg font-bold text-gray-900">{item.description}</h3>
                         <Utensils className="text-gray-300" size={20} />
                      </div>
                      <p className="mt-2 text-2xl font-bold text-blue-600">
                        {formatCurrency(parseFloat(item.unitPrice))}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="mt-4 flex items-center justify-center gap-2 w-full rounded-lg bg-green-600 py-2 text-white hover:bg-green-700 transition-colors"
                    >
                      <ShoppingBag size={18} /> Adicionar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          
          <div className="space-y-12">
            
            {featuredItems.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Destaques do Cardápio 🔥</h2>
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  spaceBetween={20}
                  slidesPerView={1}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  navigation
                  className="rounded-xl shadow-lg"
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                  }}
                >
                  {featuredItems.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col justify-center items-center text-center p-8 text-white shadow-inner">
                        
                        <div className="z-10">
                          <h3 className="text-3xl font-bold mb-2">{item.description}</h3>
                          <p className="text-2xl font-medium text-blue-100 mb-6">
                            {formatCurrency(parseFloat(item.unitPrice))}
                          </p>
                          
                          <button 
                            onClick={() => handleAddToCart(item)}
                            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-md"
                          >
                            <PlusCircle size={20} /> Peça Agora
                          </button>
                        </div>

                        <Utensils className="absolute -bottom-4 -right-4 text-white opacity-10" size={150} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </section>
            )}

            <section className="text-center">
              <h2 className="mb-6 text-2xl font-bold text-gray-800">Navegação Rápida</h2>
              <div className="flex justify-center gap-4 flex-wrap">
                <a href="/cardapio" className="flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1 border border-gray-100">
                  <span className="text-4xl mb-2">🍔</span>
                  <span className="font-semibold text-gray-700">Cardápio</span>
                </a>
                <a href="/meus-pedidos" className="flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1 border border-gray-100">
                  <span className="text-4xl mb-2">🧾</span>
                  <span className="font-semibold text-gray-700">Pedidos</span>
                </a>
                <a href="/perfil" className="flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1 border border-gray-100">
                  <span className="text-4xl mb-2">👤</span>
                  <span className="font-semibold text-gray-700">Conta</span>
                </a>
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}