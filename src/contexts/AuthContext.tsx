import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api'; // Nossa instância do axios

// 1. Define o formato dos dados do usuário (do nosso back-end)
interface User {
  id: string;
  name: string;
  email: string;
  type: 'CLIENT' | 'ADMIN';
  phone: string;
}

// 2. Define o que o nosso Contexto vai fornecer
interface AuthContextData {
  user: User | null;         // Os dados do usuário logado
  token: string | null;      // O JWT
  loading: boolean;          // True enquanto valida o token na inicialização
  login: (token: string) => Promise<void>; // Função de Login
  logout: () => void;           // Função de Logout
}

// 3. Define as props do nosso Provider
interface AuthProviderProps {
  children: ReactNode; // "children" são os componentes que ele vai envolver
}

// 4. Cria o Contexto
export const AuthContext = createContext({} as AuthContextData);

// 5. Cria o "Provider" (o componente que fornece os dados)
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Começa true

  // 6. Roda UMA VEZ quando o app carrega
  useEffect(() => {
    async function loadStorageData() {
      // Busca o token salvo no localStorage
      const storedToken = localStorage.getItem('@UaiFood:token');

      if (storedToken) {
        try {
          // Se achou um token, configura o axios para usá-lo
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Valida o token chamando a rota /me
          const response = await api.get('/users/me'); 
          
          setUser(response.data); // Salva os dados do usuário
          setToken(storedToken);  // Salva o token
        } catch (err) {
          // Se o token for inválido (ex: expirado), limpa
          console.error("Falha ao validar token:", err);
          localStorage.removeItem('@UaiFood:token');
        }
      }
      // Termina o loading (mesmo se falhar)
      setLoading(false); 
    }
    loadStorageData();
  }, []); // O array vazio [] garante que isso rode só uma vez

  // 7. Função de Login
  const login = async (newToken: string) => {
    setLoading(true);
    try {
      // 1. Salva o token no localStorage
      localStorage.setItem('@UaiFood:token', newToken);

      // 2. Define o token no header do axios
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // 3. Busca os dados do usuário (rota /me)
      const response = await api.get('/users/me');
      setUser(response.data);
      setToken(newToken);
      
    } catch (err) {
      console.error("Falha no login:", err);
    } finally {
      setLoading(false);
    }
  };

  // 8. Função de Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('@UaiFood:token');
    delete api.defaults.headers.common['Authorization'];
  };

  // 9. Fornece os dados para os "children"
  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {/* Só renderiza o app quando o loading acabar */}
      {!loading && children} 
    </AuthContext.Provider>
  );
}