import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export default function CourseDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await apiFetch(`/courses/${id}`);
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="text-center py-12">Carregando...</div>;
  if (!data) return <div className="text-center py-12 text-red-600">Curso não encontrado.</div>;

  const { course, lessons, guest_instructor } = data;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link to="/courses" className="text-indigo-600 hover:underline mb-6 inline-block">&larr; Voltar para cursos</Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{course.name}</h1>
        <p className="text-gray-700 text-lg mb-6">{course.description}</p>
        
        <div className="flex gap-4 text-sm text-gray-500">
          <span>Início: {course.start_date || 'N/A'}</span>
          <span>Fim: {course.end_date || 'N/A'}</span>
          <span>Autor: {course.user?.name || 'Desconhecido'}</span>
        </div>
      </div>

      {guest_instructor && (
        <div className="bg-indigo-50 rounded-xl p-6 mb-8 flex items-center gap-4">
          <img src={guest_instructor.avatar_url} alt="Guest Instructor" className="w-16 h-16 rounded-full shadow-sm" />
          <div>
            <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider mb-1">Instrutor Convidado Especial</h3>
            <p className="text-lg font-medium text-gray-900">{guest_instructor.name}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Lições</h2>
        </div>
        {lessons && lessons.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {lessons.map(lesson => (
              <li key={lesson.id} className="py-4 flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-medium text-gray-800">{lesson.title}</h4>
                  {lesson.video_url && <a href={lesson.video_url} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline">Assistir Vídeo</a>}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${lesson.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {lesson.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">Nenhuma lição cadastrada neste curso ainda.</p>
        )}
      </div>
    </div>
  );
}
