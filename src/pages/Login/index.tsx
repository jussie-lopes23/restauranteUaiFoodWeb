import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Nosso hook!
import api from '../../services/api'; // Nosso axios
import axios from 'axios'; // Importamos o axios padrão para checar o tipo de erro
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  // 1. Hooks
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Para mensagens de erro
  
  const navigate = useNavigate(); // Para redirecionar
  const { login } = useAuth(); // Nossa função de login do Contexto

  // 2. Função de Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    setError(null); // Limpa erros antigos

    // Validação simples
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // 3. Chamar a API de Login
      const response = await api.post('/users/login', {
        email: email,
        password: password,
      });

      const { token } = response.data;

      // 2. DISPARE O POP-UP DE SUCESSO!
      toast.success('Login realizado com sucesso!');

      // 4. Chamar a função de login do Contexto
      // (Isso vai salvar o token, buscar o usuário (com /me) e redirecionar)
      await login(token);

      // 5. Redirecionar para a Home
      navigate('/');

    } catch (err: unknown) {
      // 6. Tratamento de Erro
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response.data.message || 'Falha no login. Verifique suas credenciais.';
        
        // 4. (Opcional) Use um pop-up de erro também!
        toast.error(errorMessage);
        setError(errorMessage); // Você pode manter ambos
        
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.');
        setError('Ocorreu um erro inesperado. Tente novamente.');
      }
      console.error('Erro no login:', err);
    }
  };

  // 3. JSX com Tailwind
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Entrar no UaiFood
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-red-700">
              {error}
            </div>
          )}

          {/* Campo de E-mail */}
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

          {/* Campo de Senha */}
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

          {/* Botão de Login */}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}