import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Importe a nova página de Login
import LoginPage from './pages/Login'; 
import App from './App';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        {/* 2. Adicione a Rota de Login */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}