import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna 1: Sobre */}
          <div>
            <h3 className="text-xl font-bold text-blue-500 mb-4">UaiFood</h3>
            <p className="text-gray-400 text-sm">
              O melhor sabor da região, entregue diretamente na sua porta.
              Qualidade e rapidez é o nosso compromisso.
            </p>
          </div>

          {/* Coluna 2: Links Úteis */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white">Início</a></li>
              <li><a href="/cardapio" className="hover:text-white">Cardápio</a></li>
              <li><a href="/perfil" className="hover:text-white">Minha Conta</a></li>
            </ul>
          </div>

          {/* Coluna 3: Contato e Redes */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Siga-nos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500"><Facebook size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-pink-500"><Instagram size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400"><Twitter size={24} /></a>
            </div>
            <p className="mt-4 text-sm text-gray-400">Contato: (34) 99999-9999</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} UaiFood. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}