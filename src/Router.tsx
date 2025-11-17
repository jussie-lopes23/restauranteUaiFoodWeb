import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Nossos componentes de layout de rota
import PrivateRoute from '../src/components/PrivateRoute';
import GuestRoute from '../src/components/GuestRoute';
import Layout from '../src/components/Layout';

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

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rotas Protegidas (Só para usuários LOGADOS) --- */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cardapio" element={<MenuPage />} /> {/* 2. ADICIONE a rota */}
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/meus-pedidos" element={<MyOrdersPage />} />
            <Route path="/pedidos/:id" element={<OrderDetailsPage />} />

            {/* 3. ADICIONE AS ROTAS ANINHADAS DE PERFIL */}
            <Route path="/perfil" element={<MyAccountPage />}>
              {/* Esta é a rota "index" (padrão) de /perfil */}
              <Route index element={<ProfilePage />} />
              <Route path="senha" element={<ChangePasswordPage />} />
              <Route path="enderecos" element={<AddressesPage />} />
              {/* (Adicionaremos '/perfil/enderecos' aqui) */}
            </Route>
            
          </Route>
        </Route>

        {/* --- Rotas de Convidado (Só para usuários DESLOGADOS) --- */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}