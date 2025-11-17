import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Nossos componentes de layout de rota
import PrivateRoute from '../src/components/PrivateRoute';
import GuestRoute from '../src/components/GuestRoute';

// Nossas páginas
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rotas Protegidas (Só para usuários LOGADOS) --- */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          {/* Adicione aqui outras rotas logadas:
            <Route path="/meus-pedidos" element={<MeusPedidosPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
          */}
        </Route>

        {/* --- Rotas de Convidado (Só para usuários DESLOGADOS) --- */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Você pode adicionar aqui rotas públicas (ex: 404)
          <Route path="*" element={<Pagina404 />} />
        */}
      </Routes>
    </BrowserRouter>
  );
}