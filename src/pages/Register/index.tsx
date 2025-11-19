import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; 
import axios from 'axios'; 
import { toast } from 'react-hot-toast'; 

export default function RegisterPage() {
  // 1. Hooks
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [acceptTerms, setAcceptTerms] = useState(false);

  const navigate = useNavigate();

  // Função de Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    
    if (!name || !email || !phone || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (!acceptTerms) {
      setError('Você precisa aceitar os termos de privacidade para continuar.');
      toast.error('Você precisa aceitar os termos de privacidade.');
      return;
    }

    try {
      //Chamar a API de Registo
      await api.post('/users', {
        name,
        email,
        phone,
        password,
        acceptsTerms: acceptTerms,
      });

      
      toast.success('Conta criada com sucesso! Faça o login.');
      navigate('/login'); 

    } catch (err: unknown) {
      
      if (axios.isAxiosError(err) && err.response) {
        
        const errorMessage = err.response.data.message || 'Falha ao criar conta.';
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        toast.error('Ocorreu um erro inesperado.');
        setError('Ocorreu um erro inesperado.');
      }
      console.error('Erro no registo:', err);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Criar Conta no UaiFood
        </h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-red-700">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone (ex: 34999998888)
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha (mínimo 6 caracteres)
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Eu li e aceito os{' '}
                <a href="#" className="font-medium text-blue-600 hover:underline">
                  Termos de Privacidade
                </a>
                .
              </span>
            </label>
          </div>


          <button
            type="submit"
            disabled={!acceptTerms} 
            className="w-full rounded-md bg-green-600 p-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50" 
          >
            Criar Conta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já possui uma conta?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Faça o login
          </Link>
        </p>
        
      </div>
    </div>
  );
}