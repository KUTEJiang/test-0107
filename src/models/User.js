const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

// User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true
});

// Define associations
User.associate = (models) => {
  User.hasOne(models.UserProfile, { as: 'profile', foreignKey: 'userId' });
  User.hasMany(models.Trip, { as: 'trips', foreignKey: 'creatorId' });
  User.hasMany(models.TripParticipant, { as: 'tripParticipations', foreignKey: 'userId' });
  User.hasMany(models.Expense, { as: 'createdExpenses', foreignKey: 'creatorId' });
  User.hasMany(models.ExpenseSplit, { as: 'expenseSplits', foreignKey: 'userId' });
};

module.exports = User;