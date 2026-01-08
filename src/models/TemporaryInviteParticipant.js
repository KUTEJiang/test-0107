const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

// TemporaryInviteParticipant model
const TemporaryInviteParticipant = sequelize.define('TemporaryInviteParticipant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  inviteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'temporary_invites',
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
  tableName: 'temporary_invite_participants',
  timestamps: true
});

// Define associations
TemporaryInviteParticipant.associate = (models) => {
  TemporaryInviteParticipant.belongsTo(models.TemporaryInvite, { as: 'invite', foreignKey: 'inviteId' });
  TemporaryInviteParticipant.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
};

module.exports = TemporaryInviteParticipant;