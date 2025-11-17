import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader'; // Importa o Header de Admin

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* O Header de Admin fica fixo no topo */}
      <AdminHeader />

      {/* O <Outlet /> renderiza o conteúdo da página admin (ex: AdminOrdersPage) */}
      <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}