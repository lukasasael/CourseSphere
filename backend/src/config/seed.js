const { User, Course, Lesson } = require('../models');
const logger = require('../utils/logger');

async function seed() {
  logger.info('Seeding database...');

  // Create users
  const instructor = await User.create({
    name: 'Instrutor Demo',
    email: 'instrutor@example.com',
    password_digest: 'password', // hook will hash
  });

  const instructor2 = await User.create({
    name: 'Instrutor 2',
    email: 'instrutor2@example.com',
    password_digest: 'password',
  });

  const student = await User.create({
    name: 'Estudante Demo',
    email: 'estudante@email.com',
    password_digest: 'password',
  });

  // Create courses
  const course1 = await Course.create({
    name: 'Introdução ao React',
    description: 'Curso completo de React para iniciantes, cobrindo componentes, hooks e estado.',
    start_date: '2026-06-01',
    end_date: '2026-07-01',
    user_id: instructor.id,
  });

  const course2 = await Course.create({
    name: 'Node.js Avançado',
    description: 'Tópicos avançados de Node.js incluindo streams, workers e performance.',
    start_date: '2026-06-15',
    end_date: '2026-08-15',
    user_id: instructor2.id,
  });

  // Create lessons
  await Lesson.create({
    title: 'JSX e Componentes',
    status: 'published',
    video_url: 'https://youtube.com/watch?v=example1',
    course_id: course1.id,
  });

  await Lesson.create({
    title: 'Hooks: useState e useEffect',
    status: 'draft',
    video_url: 'https://youtube.com/watch?v=example2',
    course_id: course1.id,
  });

  await Lesson.create({
    title: 'Streams e Buffers',
    status: 'published',
    video_url: 'https://youtube.com/watch?v=example3',
    course_id: course2.id,
  });

  logger.info('Seed completed.', {
    users: 3,
    courses: 2,
    lessons: 3,
  });
}

module.exports = seed;
