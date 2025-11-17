import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Nossos componentes de layout de rota
import PrivateRoute from '../src/components/PrivateRoute';
import GuestRoute from '../src/components/GuestRoute';
import Layout from '../src/components/Layout';
import AdminRoute from '../src/components/AdminRoute';
import AdminLayout from '../src/components/AdminLayout';
import ClientOnlyRoute from '../src/components/ClientOnlyRoute';


// Nossas páginas
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import MenuPage from './pages/Menu';
import CartPage from './pages/Cart';
import MyOrdersPage from './pages/MyOrders';
import MyAccountPage from './pages/MyAccount';
import ProfilePage from './pages/MyAccount/ProfilePage';
import ChangePasswordPage from './pages/MyAccount/ChangePasswordPage';
import AddressesPage from './pages/MyAccount/AddressesPage';
import OrderDetailsPage from './pages/OrderDetails';
import AdminOrdersPage from './pages/AdminOrders';
import AdminItemsPage from './pages/AdminItems';
import AdminCategoriesPage from './pages/AdminCategories';
import AdminUsersPage from './pages/AdminUsers';


export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rotas Protegidas --- */}
        <Route element={<PrivateRoute />}>
          
          {/* --- 2. ROTAS SÓ PARA CLIENTES --- */}
          {/* Envolve o Layout do cliente com o ClientOnlyRoute */}
          <Route element={<ClientOnlyRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/cardapio" element={<MenuPage />} />
              <Route path="/carrinho" element={<CartPage />} />
              <Route path="/meus-pedidos" element={<MyOrdersPage />} />
              <Route path="/pedidos/:id" element={<OrderDetailsPage />} />
              <Route path="/perfil" element={<MyAccountPage />}>
                <Route index element={<ProfilePage />} />
                <Route path="senha" element={<ChangePasswordPage />} />
                <Route path="enderecos" element={<AddressesPage />} />
              </Route>
            </Route>
          </Route>

          {/* --- 3. ROTAS SÓ PARA ADMIN --- */}
          <Route element={<AdminRoute />}> 
            <Route element={<AdminLayout />}>
              <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
              <Route path="/admin/itens" element={<AdminItemsPage />} />
              <Route path="/admin/categorias" element={<AdminCategoriesPage />} />
              <Route path="/admin/usuarios" element={<AdminUsersPage />} />
            </Route>
          </Route>

        </Route>

        {/* --- Rotas de Convidado --- */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}