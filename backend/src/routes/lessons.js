const express = require('express');
const router = express.Router({ mergeParams: true });
const { Lesson, Course } = require('../models');
const { authenticate } = require('../middleware/auth');
const logger = require('../utils/logger');

// POST /courses/:id/lessons — create a lesson
router.post('/', authenticate, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado.' });
    }

    if (course.user_id !== req.userId) {
      return res.status(403).json({ error: 'Apenas o criador do curso pode adicionar lições.' });
    }

    const { title, status, video_url } = req.body.lesson || req.body;

    const lesson = await Lesson.create({
      title,
      status: status || 'draft',
      video_url: video_url || null,
      course_id: course.id,
    });

    logger.info('Lesson Created', { lessonId: lesson.id, courseId: course.id });
    res.status(201).json(lesson);
  } catch (err) {
    logger.error('Create Lesson Error', { error: err.message });
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
