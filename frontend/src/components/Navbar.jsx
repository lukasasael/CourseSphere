import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-indigo-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center text-white">
        <Link to="/" className="text-xl font-bold tracking-wider">
          CourseSphere
        </Link>
        <div className="space-x-4 flex items-center">

          <Link to="/lesson-plans" className="hover:text-indigo-200 transition-colors font-medium">
            Planos de Aula
          </Link>
          {user ? (
            <>
              <span className="text-indigo-200">Olá, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="hover:bg-indigo-800 transition-colors bg-indigo-700 px-3 py-1 rounded-md"
              >
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:bg-indigo-800 transition-colors bg-indigo-700 px-3 py-1 rounded-md">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
