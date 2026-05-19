import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export default function LessonPlanForm() {
  const { id } = useParams(); // if editing
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    objective: '',
    summary: '',
    planned_date: '',
    discipline: '',
    contents: '',
    resources: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await apiFetch(`/lesson-plans/${id}`);
        setFormData({
          title: data.title || '',
          objective: data.objective || '',
          summary: data.summary || '',
          planned_date: data.planned_date || '',
          discipline: data.discipline || '',
          contents: data.contents || '',
          resources: data.resources || '',
          tags: data.tags || [],
        });
      } catch {
        setError('Erro ao carregar plano de aula.');
      }
    };

    if (isEditing) {
      fetchPlan();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmed] });
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tagToRemove) });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSmartAssist = async () => {
    if (!formData.title || !formData.discipline || !formData.summary) {
      setAiError('Preencha o Título, Disciplina e Ementa/Resumo para usar o Smart Assist.');
      return;
    }

    setAiLoading(true);
    setAiError('');

    try {
      const recommendations = await apiFetch('/lesson-plans/smart-assist', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title,
          discipline: formData.discipline,
          summary: formData.summary,
        }),
      });

      setFormData((prev) => ({
        ...prev,
        contents: recommendations.contents || prev.contents,
        resources: recommendations.resources || prev.resources,
        tags: recommendations.tags || prev.tags,
      }));
    } catch (err) {
      setAiError(err.message || 'Erro ao gerar recomendações. Tente novamente.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        await apiFetch(`/lesson-plans/${id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch('/lesson-plans', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      navigate('/lesson-plans');
    } catch (err) {
      setError(err.message || 'Erro ao salvar plano de aula.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link to="/lesson-plans" className="text-indigo-600 hover:underline mb-6 inline-block">
        &larr; Voltar para Planos de Aula
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 whitespace-pre-line">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título da Aula *</label>
          <input
            type="text"
            name="title"
            required
            minLength="3"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
            placeholder="Ex: Introdução ao Protocolo OSPF"
          />
        </div>

        {/* Discipline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina *</label>
          <input
            type="text"
            name="discipline"
            required
            value={formData.discipline}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
            placeholder="Ex: Redes de Computadores"
          />
        </div>

        {/* Objective */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
          <textarea
            name="objective"
            rows="2"
            value={formData.objective}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
            placeholder="Qual o objetivo pedagógico desta aula?"
          ></textarea>
        </div>

        {/* Summary / Ementa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ementa / Resumo *</label>
          <textarea
            name="summary"
            rows="3"
            required
            value={formData.summary}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
            placeholder="Descreva os tópicos abordados na aula..."
          ></textarea>
        </div>

        {/* Smart Assist Button */}
        <div className="border-2 border-dashed border-indigo-200 rounded-xl p-4 bg-indigo-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-indigo-800">🤖 Smart Assist (IA)</h3>
              <p className="text-xs text-indigo-600 mt-0.5">
                Preencha Título, Disciplina e Ementa, depois clique para gerar sugestões automáticas.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSmartAssist}
              disabled={aiLoading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center gap-2 text-sm whitespace-nowrap"
            >
              {aiLoading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Gerando...
                </>
              ) : (
                'Gerar Recomendações com IA'
              )}
            </button>
          </div>
          {aiError && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">{aiError}</div>
          )}
        </div>

        {/* Planned Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Prevista</label>
          <input
            type="date"
            name="planned_date"
            value={formData.planned_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
          />
        </div>

        {/* Contents (auto-filled by AI) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conteúdos
            {aiLoading && <span className="text-indigo-500 ml-2 text-xs">(preenchendo via IA...)</span>}
          </label>
          <textarea
            name="contents"
            rows="3"
            value={formData.contents}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
            placeholder="Conteúdos complementares para a aula..."
          ></textarea>
        </div>

        {/* Resources (auto-filled by AI) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recursos de Apoio
            {aiLoading && <span className="text-indigo-500 ml-2 text-xs">(preenchendo via IA...)</span>}
          </label>
          <textarea
            name="resources"
            rows="3"
            value={formData.resources}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
            placeholder="Livros, links, materiais de apoio..."
          ></textarea>
        </div>

        {/* Tags (auto-filled by AI) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
            {aiLoading && <span className="text-indigo-500 ml-2 text-xs">(preenchendo via IA...)</span>}
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Adicionar tag e pressionar Enter..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((t, i) => (
              <span
                key={i}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="text-indigo-400 hover:text-indigo-700 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/lesson-plans')}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Plano de Aula'}
          </button>
        </div>
      </form>
    </div>
  );
}
