const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

// UserProfile model
const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    unique: true
  },
  travelPreference: {
    type: DataTypes.STRING, // 'J' for Judging, 'P' for Perceiving
    allowNull: true
  },
  canDrive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  budgetSensitivity: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  soloExperience: {
    type: DataTypes.INTEGER, // years of solo travel experience
    defaultValue: 0
  },
  countriesVisited: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  profileImage: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: null
  }
}, {
  tableName: 'user_profiles',
  timestamps: true
});

// Define associations
UserProfile.associate = (models) => {
  UserProfile.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
};

module.exports = UserProfile;