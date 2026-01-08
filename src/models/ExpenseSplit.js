const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

// ExpenseSplit model
const ExpenseSplit = sequelize.define('ExpenseSplit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  expenseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'expenses',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  amountOwed: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'expense_splits',
  timestamps: true
});

// Define associations
ExpenseSplit.associate = (models) => {
  ExpenseSplit.belongsTo(models.Expense, { as: 'expense', foreignKey: 'expenseId' });
  ExpenseSplit.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
};

module.exports = ExpenseSplit;