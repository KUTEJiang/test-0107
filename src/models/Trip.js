const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

// Trip model
const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  description: {
    type: DataTypes.TEXT
  },
  startDate: {
    type: DataTypes.DATE
  },
  endDate: {
    type: DataTypes.DATE
  },
  locations: {
    type: DataTypes.JSONB, // Store as JSON array of location objects
    defaultValue: []
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'completed'),
    defaultValue: 'active'
  },
  expiresAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'trips',
  timestamps: true
});

// Define associations
Trip.associate = (models) => {
  Trip.belongsTo(models.User, { as: 'creator', foreignKey: 'creatorId' });
  Trip.hasMany(models.TripParticipant, { as: 'participants', foreignKey: 'tripId' });
};

module.exports = Trip;