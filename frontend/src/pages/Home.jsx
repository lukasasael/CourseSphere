import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/lesson-plans" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        Bem-vindo ao CourseSphere
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        A plataforma definitiva para gerenciar seus cursos e lições.
      </p>
      <div className="mt-12">
        <Link to="/login" className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-sm hover:bg-indigo-700 transition-colors">
          Clique aqui para fazer login
        </Link>
      </div>
    </div>
  );
}
