const { DataTypes } = require('sequelize');
const client = require('../config/database');

const User = client.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  carot: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isadmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;