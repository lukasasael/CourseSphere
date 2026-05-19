const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { LessonPlan, User } = require('../models');
const { authenticate } = require('../middleware/auth');
const { generateRecommendations } = require('../services/aiService');
const logger = require('../utils/logger');

// GET /lesson-plans — list with pagination, filters, search, sort
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      page = 1,
      per_page = 10,
      discipline,
      tag,
      planned_date,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = req.query;

    const where = {};

    // Filter by discipline
    if (discipline) {
      where.discipline = discipline;
    }

    // Filter by planned date
    if (planned_date) {
      where.planned_date = planned_date;
    }

    // Search by title
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    // Filter by tag (search within JSON string)
    if (tag) {
      where.tags = { [Op.like]: `%${tag}%` };
    }

    // Validate sort field
    const allowedSortFields = ['title', 'created_at'];
    const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const limit = Math.min(parseInt(per_page) || 10, 100);
    const offset = (Math.max(parseInt(page) || 1, 1) - 1) * limit;

    const { count, rows } = await LessonPlan.findAndCountAll({
      where,
      include: [{ model: User, as: 'creator', attributes: ['id', 'name'] }],
      order: [[sortField, sortDirection]],
      limit,
      offset,
    });

    res.json({
      lesson_plans: rows,
      pagination: {
        total: count,
        page: Math.max(parseInt(page) || 1, 1),
        per_page: limit,
        total_pages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    logger.error('List Lesson Plans Error', { error: err.message });
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// GET /lesson-plans/:id — single lesson plan
router.get('/:id', authenticate, async (req, res) => {
  try {
    const plan = await LessonPlan.findByPk(req.params.id, {
      include: [{ model: User, as: 'creator', attributes: ['id', 'name'] }],
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plano de aula não encontrado.' });
    }

    res.json(plan);
  } catch (err) {
    logger.error('Get Lesson Plan Error', { error: err.message });
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /lesson-plans — create a lesson plan
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, objective, summary, planned_date, discipline, contents, resources, tags } = req.body;

    const plan = await LessonPlan.create({
      title,
      objective,
      summary,
      planned_date: planned_date || null,
      discipline,
      contents,
      resources,
      tags: tags || [],
      user_id: req.userId,
    });

    logger.info('Lesson Plan Created', { planId: plan.id, userId: req.userId });
    res.status(201).json(plan);
  } catch (err) {
    logger.error('Create Lesson Plan Error', { error: err.message });
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// PUT /lesson-plans/:id — update (only creator)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const plan = await LessonPlan.findByPk(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: 'Plano de aula não encontrado.' });
    }

    if (plan.user_id !== req.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para editar este plano.' });
    }

    const { title, objective, summary, planned_date, discipline, contents, resources, tags } = req.body;

    await plan.update({
      title, objective, summary, planned_date, discipline, contents, resources,
      tags: tags || plan.tags,
    });

    logger.info('Lesson Plan Updated', { planId: plan.id, userId: req.userId });
    res.json(plan);
  } catch (err) {
    logger.error('Update Lesson Plan Error', { error: err.message });
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// DELETE /lesson-plans/:id — delete (only creator)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const plan = await LessonPlan.findByPk(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: 'Plano de aula não encontrado.' });
    }

    if (plan.user_id !== req.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para excluir este plano.' });
    }

    await plan.destroy();
    logger.info('Lesson Plan Deleted', { planId: req.params.id, userId: req.userId });
    res.status(204).send();
  } catch (err) {
    logger.error('Delete Lesson Plan Error', { error: err.message });
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /lesson-plans/smart-assist — AI recommendations
router.post('/smart-assist', authenticate, async (req, res) => {
  try {
    const { title, discipline, summary } = req.body;

    if (!title || !discipline || !summary) {
      return res.status(422).json({ error: 'Título, Disciplina e Ementa/Resumo são obrigatórios.' });
    }

    const recommendations = await generateRecommendations({ title, discipline, summary });

    res.json(recommendations);
  } catch (err) {
    logger.error('Smart Assist Error', { error: err.message });
    res.status(500).json({ error: err.message || 'Erro ao gerar recomendações com IA.' });
  }
});

module.exports = router;
