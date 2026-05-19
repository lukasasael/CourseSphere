const User = require('./User');
const Course = require('./Course');
const Lesson = require('./Lesson');
const LessonPlan = require('./LessonPlan');

// User -> Courses (one-to-many)
User.hasMany(Course, { foreignKey: 'user_id', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'user_id', as: 'creator' });

// Course -> Lessons (one-to-many)
Course.hasMany(Lesson, { foreignKey: 'course_id', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'course_id' });

// User -> LessonPlans (one-to-many)
User.hasMany(LessonPlan, { foreignKey: 'user_id', as: 'lessonPlans' });
LessonPlan.belongsTo(User, { foreignKey: 'user_id', as: 'creator' });

module.exports = { User, Course, Lesson, LessonPlan };
