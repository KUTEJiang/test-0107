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
  mbtiType: {
    type: DataTypes.STRING, // MBTI personality type (e.g. ENFJ, ISTP, etc.)
    allowNull: true
  },
  travelPreference: {
    type: DataTypes.STRING, // 'J' for Judging, 'P' for Perceiving (part of MBTI)
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
  },
  // Additional personality and preference fields
  travelStyle: {
    type: DataTypes.ENUM('adventure', 'relaxing', 'cultural', 'luxury', 'budget', 'backpacking'),
    defaultValue: 'cultural'
  },
  pacePreference: {
    type: DataTypes.ENUM('fast', 'moderate', 'slow'),
    defaultValue: 'moderate'
  },
  accommodationPreference: {
    type: DataTypes.ENUM('hotel', 'hostel', 'airbnb', 'luxury', 'camping', 'mixed'),
    defaultValue: 'mixed'
  },
  activityPreference: {
    type: DataTypes.ENUM('outdoor', 'indoor', 'cultural', 'adventure', 'food', 'mixed'),
    defaultValue: 'mixed'
  },
  riskTolerance: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
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