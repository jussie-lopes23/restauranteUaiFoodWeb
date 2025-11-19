import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'CLIENT' | 'ADMIN';
  phone: string;
}

//Define o que o Contexto vai fornecer
interface AuthContextData {
  user: User | null;         
  token: string | null;     
  loading: boolean;         
  login: (token: string) => Promise<User>;
  logout: () => void;         
}


interface AuthProviderProps {
  children: ReactNode; 
}

//Cria o Contexto
export const AuthContext = createContext({} as AuthContextData);

//Cria o componente que fornece os dados
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function loadStorageData() {

      const storedToken = localStorage.getItem('@UaiFood:token');

      if (storedToken) {
        try {
          //configura o axios para usar o token
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Valida o token buscando os dados do usuário
          const response = await api.get('/users/me'); 
          
          setUser(response.data);
          setToken(storedToken); 
        } catch (err) {
          console.error("Falha ao validar token:", err);
          localStorage.removeItem('@UaiFood:token');
        }
      }
    
      setLoading(false); 
    }
    loadStorageData();
  }, []);

  //Função de Login
  const login = async (newToken: string) => {
    setLoading(true);
    try {
      //Salva o token no localStorage
      localStorage.setItem('@UaiFood:token', newToken);

      //Define o token no header do axios
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      //Busca os dados do usuário 
      const response = await api.get('/users/me');
      setUser(response.data);
      setToken(newToken);

      return response.data;
      
    } catch (err) {
      console.error("Falha no login:", err);
      logout(); 
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('@UaiFood:token');
    delete api.defaults.headers.common['Authorization'];
  };

  
  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}