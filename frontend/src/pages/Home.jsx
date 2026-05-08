import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        Bem-vindo ao CourseSphere
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        A plataforma definitiva para gerenciar seus cursos e lições.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <Link to="/register" className="block text-left bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold text-indigo-600 mb-2">Para Instrutores</h2>
          <p className="text-gray-600">Crie cursos, adicione lições em vídeo e gerencie seus alunos em um só lugar.</p>
        </Link>
        <Link to="/register" className="block text-left bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold text-indigo-600 mb-2">Para Estudantes</h2>
          <p className="text-gray-600">Acesse conteúdo de qualidade, acompanhe seu progresso e interaja com a comunidade.</p>
        </Link>
      </div>
    </div>
  );
}
