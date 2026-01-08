const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

// TemporaryInvite model
const TemporaryInvite = sequelize.define('TemporaryInvite', {
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
  location: {
    type: DataTypes.JSONB, // Store as { lat: number, lng: number, name: string }
    allowNull: false
  },
  inviteType: {
    type: DataTypes.ENUM('dining', 'sightseeing', 'activity', 'other'),
    defaultValue: 'other'
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'completed'),
    defaultValue: 'active'
  },
  expiresAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'temporary_invites',
  timestamps: true
});

// Define associations
TemporaryInvite.associate = (models) => {
  TemporaryInvite.belongsTo(models.User, { as: 'creator', foreignKey: 'creatorId' });
  TemporaryInvite.hasMany(models.TemporaryInviteParticipant, { as: 'participants', foreignKey: 'inviteId' });
};

module.exports = TemporaryInvite;