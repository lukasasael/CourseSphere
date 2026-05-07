import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (query = '') => {
    try {
      const url = query ? `/courses?name=${encodeURIComponent(query)}` : '/courses';
      const data = await apiFetch(url);
      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses(search);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cursos</h1>
        {user && (
          <Link to="/courses/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Novo Curso
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar curso por nome..." 
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
        />
        <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors">
          Buscar
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                Criado por: {course.user?.name || 'Desconhecido'}
              </div>
              <Link to={`/courses/${course.id}`} className="text-indigo-600 font-medium hover:text-indigo-800">
                Ver detalhes &rarr;
              </Link>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum curso encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
