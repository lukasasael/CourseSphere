const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password_digest: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      user.password_digest = await bcrypt.hash(user.password_digest, 10);
    },
  },
});

User.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password_digest);
};

// Hide password_digest from JSON output
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password_digest;
  return values;
};

module.exports = User;
