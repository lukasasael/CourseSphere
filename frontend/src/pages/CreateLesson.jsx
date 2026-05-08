import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export default function CreateLesson() {
  const { id } = useParams(); // course id
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [lesson, setLesson] = useState({
    title: '',
    status: 'draft',
    video_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await apiFetch(`/courses/${id}/lessons`, {
        method: 'POST',
        body: JSON.stringify({ lesson })
      });
      navigate(`/courses/${id}`);
    } catch (err) {
      setError(err.message || 'Erro ao criar lição.');
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setLesson({ ...lesson, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link to={`/courses/${id}`} className="text-indigo-600 hover:underline mb-6 inline-block">&larr; Voltar para o curso</Link>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nova Lição</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm whitespace-pre-line">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input 
              type="text" 
              name="title"
              value={lesson.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
              minLength="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL do Vídeo</label>
            <input 
              type="url" 
              name="video_url"
              value={lesson.video_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              name="status"
              value={lesson.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
            >
              <option value="draft">Rascunho (Draft)</option>
              <option value="published">Publicado (Published)</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {saving ? 'Criando...' : 'Criar Lição'}
          </button>
        </form>
      </div>
    </div>
  );
}
