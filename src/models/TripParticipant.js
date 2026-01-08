const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

// TripParticipant model
const TripParticipant = sequelize.define('TripParticipant', {
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'trip_participants',
  timestamps: true
});

// Define associations
TripParticipant.associate = (models) => {
  TripParticipant.belongsTo(models.Trip, { as: 'trip', foreignKey: 'tripId' });
  TripParticipant.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
};

module.exports = TripParticipant;