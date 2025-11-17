import { Outlet } from 'react-router-dom';
import Header from './Header'; // Importa o Header que acabamos de criar

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* O Header fica fixo no topo */}
      <Header />

      {/* O <Outlet /> renderiza o conteúdo da página atual (ex: HomePage) */}
      <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
      
      {/* (Opcional) Podemos adicionar um <Footer /> aqui no futuro */}
    </div>
  );
}