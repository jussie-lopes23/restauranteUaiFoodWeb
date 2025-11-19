import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

//Em vez de importar useContext + AuthContext, agora só é importado useAuth().
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }

  return context;
}