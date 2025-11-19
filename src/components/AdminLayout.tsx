import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />

      {/* O <Outlet /> renderiza o conteúdo da página admin (ex: AdminOrdersPage) */}
      <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}