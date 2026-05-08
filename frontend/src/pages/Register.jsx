import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/courses" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== passwordConfirmation) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    
    try {
      await register(name, email, password, passwordConfirmation);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Falha no registro. Verifique os dados fornecidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Criar Conta</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-left whitespace-pre-line">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800"
            placeholder="Seu Nome"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800"
            placeholder="••••••••"
            required
            minLength="6"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
          <input 
            type="password" 
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800"
            placeholder="••••••••"
            required
            minLength="6"
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-600">
        <Link to="/login" className="text-indigo-600 hover:underline">Já estou cadastrado</Link>
      </div>
    </div>
  );
}
