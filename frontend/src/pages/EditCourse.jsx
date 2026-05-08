import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import Spinner from '../components/Spinner';

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [course, setCourse] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await apiFetch(`/courses/${id}`);
        // data.course contains the course info
        setCourse({
          name: data.course.name || '',
          description: data.course.description || '',
          start_date: data.course.start_date || '',
          end_date: data.course.end_date || ''
        });
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar dados do curso.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await apiFetch(`/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ course })
      });
      navigate(`/courses/${id}`);
    } catch (err) {
      setError(err.message || 'Erro ao atualizar curso.');
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link to={`/courses/${id}`} className="text-indigo-600 hover:underline mb-6 inline-block">&larr; Voltar</Link>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Curso</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm whitespace-pre-line">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Curso</label>
            <input 
              type="text" 
              name="name"
              value={course.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
              minLength="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea 
              name="description"
              value={course.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
              <input 
                type="date" 
                name="start_date"
                value={course.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
              <input 
                type="date" 
                name="end_date"
                value={course.end_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}
