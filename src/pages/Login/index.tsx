import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import api from '../../services/api'; 
import axios from 'axios'; 
import { toast } from 'react-hot-toast'; 

export default function LoginPage() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); 

  const navigate = useNavigate(); 
  const { login } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(null); 
   
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      //Chamar a API de Login
      const response = await api.post('/users/login', {
        email: email,
        password: password,
      });

      const { token } = response.data;

      //Chamar a função de login do Contexto
      toast.success('Login realizado com sucesso!');
      await login(token);

      //Chamar a função de login... que agora DEVOLVE o utilizador
      const loggedInUser = await login(token);

      if (loggedInUser.type === 'ADMIN') {
        navigate('/admin/pedidos'); // Admin vai para o painel
      } else {
        navigate('/'); // Cliente vai para a home
      }

    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response.data.message || 'Falha no login. Verifique suas credenciais.';
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        const errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
        toast.error(errorMessage);
        setError(errorMessage);
      }
      console.error('Erro no login:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Entrar no UaiFood
        </h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-red-700">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Não possui uma conta?{' '}
          <Link
            to="/register"
            className="font-medium text-green-600 hover:text-green-500 hover:underline"
          >
            Então cadastre-se
          </Link>
        </p>

      </div>
    </div>
  );
}