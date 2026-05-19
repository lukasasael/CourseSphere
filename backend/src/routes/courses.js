const express = require('express');
const router = express.Router();
const { Course, Lesson, User } = require('../models');
const { authenticate } = require('../middleware/auth');
const logger = require('../utils/logger');

// Helper to fetch a random guest instructor from RandomUser API
async function fetchGuestInstructor() {
  try {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    const person = data.results[0];
    return {
      name: `${person.name.first} ${person.name.last}`,
      avatar_url: person.picture.large,
    };
  } catch {
    return null;
  }
}

// GET /courses — list all courses (optional search by name)
router.get('/', authenticate, async (req, res) => {
  try {
    const where = {};
    if (req.query.name) {
      const { Op } = require('sequelize');
      where.name = { [Op.like]: `%${req.query.name}%` };
    }

    const courses = await Course.findAll({
      where,
      include: [{ model: User, as: 'creator', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
    });

    res.json(courses);
  } catch (err) {
    logger.error('List Courses Error', { error: err.message });
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// GET /courses/:id — course details with lessons and guest instructor
router.get('/:id', authenticate, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{ model: User, as: 'creator', attributes: ['id', 'name'] }],
    });

    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado.' });
    }

    const lessons = await Lesson.findAll({
      where: { course_id: course.id },
      order: [['created_at', 'ASC']],
    });

    const guest_instructor = await fetchGuestInstructor();

    res.json({ course, lessons, guest_instructor });
  } catch (err) {
    logger.error('Get Course Error', { error: err.message });
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /courses — create a course
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, start_date, end_date } = req.body.course || req.body;

    const course = await Course.create({
      name,
      description,
      start_date: start_date || null,
      end_date: end_date || null,
      user_id: req.userId,
    });

    logger.info('Course Created', { courseId: course.id, userId: req.userId });
    res.status(201).json(course);
  } catch (err) {
    logger.error('Create Course Error', { error: err.message });
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// PUT /courses/:id — update a course (only creator)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado.' });
    }

    if (course.user_id !== req.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para editar este curso.' });
    }

    const { name, description, start_date, end_date } = req.body.course || req.body;

    await course.update({ name, description, start_date, end_date });
    logger.info('Course Updated', { courseId: course.id, userId: req.userId });

    res.json(course);
  } catch (err) {
    logger.error('Update Course Error', { error: err.message });
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// DELETE /courses/:id — delete a course (only creator)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado.' });
    }

    if (course.user_id !== req.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para excluir este curso.' });
    }

    // Delete associated lessons first
    await Lesson.destroy({ where: { course_id: course.id } });
    await course.destroy();
    logger.info('Course Deleted', { courseId: req.params.id, userId: req.userId });

    res.status(204).send();
  } catch (err) {
    logger.error('Delete Course Error', { error: err.message });
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
