const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateRecommendations({ title, discipline, summary }) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY não configurada. Adicione-a ao arquivo .env.');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `Você é um Assistente Pedagógico especialista. Com base nas informações abaixo sobre um plano de aula, forneça recomendações estruturadas em formato JSON.

Título da Aula: ${title}
Disciplina: ${discipline}
Ementa/Resumo: ${summary}

Responda EXCLUSIVAMENTE com um objeto JSON válido no seguinte formato (sem markdown, sem explicações, apenas o JSON puro):
{
  "contents": "Texto com conteúdos complementares sugeridos para a aula, separados por ponto e vírgula",
  "resources": "Texto com recursos de apoio recomendados (livros, links, materiais), separados por ponto e vírgula",
  "tags": ["tag1", "tag2", "tag3"]
}

Regras:
- Sempre retorne exatamente 3 tags relevantes em português.
- Os conteúdos devem ser complementares ao tema, não repetir a ementa.
- Os recursos devem ser práticos e úteis para o docente.`;

  const startTime = Date.now();

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const latency = ((Date.now() - startTime) / 1000).toFixed(2);

  // Extract token usage if available
  const usageMetadata = response.usageMetadata || {};
  const tokenUsage = usageMetadata.totalTokenCount || 'N/A';

  logger.info('AI Request', {
    Title: title,
    Discipline: discipline,
    TokenUsage: tokenUsage,
    Latency: `${latency}s`,
  });

  // Parse JSON from AI response, stripping any markdown fences
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    logger.error('AI Response Parse Error', { rawResponse: text });
    throw new Error('A IA retornou uma resposta em formato inválido.');
  }
}

module.exports = { generateRecommendations };
