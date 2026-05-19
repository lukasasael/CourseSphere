require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const logger = require('./src/utils/logger');

// Import models to register associations
require('./src/models');

// Import routes
const healthRoutes = require('./src/routes/health');
const authRoutes = require('./src/routes/auth');
const courseRoutes = require('./src/routes/courses');
const lessonRoutes = require('./src/routes/lessons');
const lessonPlanRoutes = require('./src/routes/lessonPlans');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });
  next();
});

// Routes
app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/users', authRoutes); // POST /users for registration (frontend compatibility)
app.use('/courses', courseRoutes);
app.use('/courses/:id/lessons', lessonRoutes);
app.use('/lesson-plans', lessonPlanRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled Error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

// Database sync and server start
async function start() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established.');

    await sequelize.sync({ force: false });
    logger.info('Database synced.');

    // Run seed if --seed flag is passed
    if (process.argv.includes('--seed')) {
      const seed = require('./src/config/seed');
      await sequelize.sync({ force: true });
      await seed();
      logger.info('Seed completed. Exiting.');
      process.exit(0);
    }

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
}

start();
