const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lesson = sequelize.define('Lesson', {
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
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'draft',
    validate: { isIn: [['draft', 'published']] },
  },
  video_url: {
    type: DataTypes.STRING,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'lessons',
  underscored: true,
});

module.exports = Lesson;
