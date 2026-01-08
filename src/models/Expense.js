const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

// Expense model
const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trips',
      key: 'id'
    }
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'CNY'
  },
  participants: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of user IDs
    defaultValue: []
  },
  splitType: {
    type: DataTypes.ENUM('equal', 'custom', 'by_usage'),
    defaultValue: 'equal'
  }
}, {
  tableName: 'expenses',
  timestamps: true
});

// Define associations
Expense.associate = (models) => {
  Expense.belongsTo(models.Trip, { as: 'trip', foreignKey: 'tripId' });
  Expense.belongsTo(models.User, { as: 'creator', foreignKey: 'creatorId' });
  Expense.hasMany(models.ExpenseSplit, { as: 'splits', foreignKey: 'expenseId' });
};

module.exports = Expense;