const { DataTypes } = require('sequelize');
const client = require('../config/database');
const User = require('./users');

const GameState = client.define('GameState', {
  gameid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'userid'
    }
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  upgrades: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  lastSaved: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
}, {
  tableName: 'gamestate',
  timestamps: false
});

User.hasOne(GameState, { foreignKey: 'userid' });
GameState.belongsTo(User, {  foreignKey: 'userid' });

module.exports = GameState;