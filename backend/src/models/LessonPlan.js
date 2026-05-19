const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LessonPlan = sequelize.define('LessonPlan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3, 255] },
  },
  objective: {
    type: DataTypes.TEXT,
  },
  summary: {
    type: DataTypes.TEXT,
  },
  planned_date: {
    type: DataTypes.DATEONLY,
  },
  discipline: {
    type: DataTypes.STRING,
  },
  contents: {
    type: DataTypes.TEXT,
  },
  resources: {
    type: DataTypes.TEXT,
  },
  tags: {
    type: DataTypes.TEXT, // stored as JSON string
    get() {
      const raw = this.getDataValue('tags');
      return raw ? JSON.parse(raw) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'lesson_plans',
  underscored: true,
});

module.exports = LessonPlan;
