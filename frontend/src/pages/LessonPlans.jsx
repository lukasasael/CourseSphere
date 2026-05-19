import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

export default function LessonPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [tag, setTag] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('per_page', '6');
      params.append('sort_by', sortBy);
      params.append('sort_order', sortOrder);
      if (search) params.append('search', search);
      if (discipline) params.append('discipline', discipline);
      if (tag) params.append('tag', tag);
      if (plannedDate) params.append('planned_date', plannedDate);

      const data = await apiFetch(`/lesson-plans?${params.toString()}`);
      setPlans(data.lesson_plans);
      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortOrder]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPlans();
  };

  const clearFilters = () => {
    setSearch('');
    setDiscipline('');
    setTag('');
    setPlannedDate('');
    setSortBy('created_at');
    setSortOrder('DESC');
    setPage(1);
    // will re-fetch via useEffect
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este plano de aula?')) return;
    try {
      await apiFetch(`/lesson-plans/${id}`, { method: 'DELETE' });
      fetchPlans();
    } catch (err) {
      alert(err.message || 'Erro ao excluir plano.');
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Planos de Aula</h1>
        <Link
          to="/lesson-plans/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Novo Plano
        </Link>
      </div>

      {/* Filters Panel */}
      <form onSubmit={handleFilter} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Buscar por título</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Título da aula..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Disciplina</label>
            <input
              type="text"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              placeholder="Ex: Matemática"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tag</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Ex: algoritmos"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Data Prevista</label>
            <input
              type="date"
              value={plannedDate}
              onChange={(e) => setPlannedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Limpar
          </button>
        </div>
      </form>

      {/* Sort controls */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <span>Ordenar por:</span>
        <button
          onClick={() => toggleSort('title')}
          className={`px-3 py-1 rounded-md transition-colors ${sortBy === 'title' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-100'}`}
        >
          Título {sortBy === 'title' && (sortOrder === 'ASC' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => toggleSort('created_at')}
          className={`px-3 py-1 rounded-md transition-colors ${sortBy === 'created_at' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-100'}`}
        >
          Data de cadastro {sortBy === 'created_at' && (sortOrder === 'ASC' ? '↑' : '↓')}
        </button>
        <span className="ml-auto text-gray-400">{pagination.total} plano(s) encontrado(s)</span>
      </div>

      {/* Plans List */}
      {loading ? (
        <Spinner />
      ) : plans.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">Nenhum plano de aula encontrado.</p>
          <Link to="/lesson-plans/new" className="text-indigo-600 hover:underline mt-2 inline-block">
            Crie o primeiro plano &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{plan.title}</h2>
                  {plan.discipline && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      {plan.discipline}
                    </span>
                  )}
                </div>
                {plan.objective && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plan.objective}</p>
                )}
                {plan.tags && plan.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {plan.tags.map((t, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-sm text-gray-500 mb-3">
                  {plan.planned_date && <span>📅 {plan.planned_date}</span>}
                  {plan.creator && <span className="ml-3">👤 {plan.creator.name}</span>}
                </div>
                {user && plan.creator && user.id === plan.creator.id && (
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <Link
                      to={`/lesson-plans/${plan.id}/edit`}
                      className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-500 text-sm font-medium hover:text-red-700 ml-auto"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {pagination.page} de {pagination.total_pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
            disabled={page === pagination.total_pages}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
