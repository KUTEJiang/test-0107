const TemporaryInvite = require('../models/TemporaryInvite');
const TemporaryInviteParticipant = require('../models/TemporaryInviteParticipant');
const User = require('../models/User');

// Create a new temporary invite
exports.createInvite = async (req, res) => {
  try {
    const { title, description, location, inviteType, maxParticipants, expiresAt } = req.body;

    const invite = await TemporaryInvite.create({
      creatorId: req.userId,
      title,
      description,
      location,
      inviteType,
      maxParticipants,
      expiresAt
    });

    // Add creator as participant
    await TemporaryInviteParticipant.create({
      inviteId: invite.id,
      userId: req.userId,
      status: 'accepted'
    });

    res.status(201).json(invite);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all temporary invites
exports.getInvites = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active', inviteType } = req.query;
    
    const offset = (page - 1) * limit;
    
    const whereCondition = { status };
    if (inviteType) {
      whereCondition.inviteType = inviteType;
    }
    
    const invites = await TemporaryInvite.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }]
    });

    res.json({
      invites: invites.rows,
      totalPages: Math.ceil(invites.count / limit),
      currentPage: parseInt(page),
      total: invites.count
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get a specific invite
exports.getInvite = async (req, res) => {
  try {
    const invite = await TemporaryInvite.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username']
        },
        {
          model: TemporaryInviteParticipant,
          as: 'participants',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          }]
        }
      ]
    });

    if (!invite) {
      return res.status(404).json({ message: 'Invite not found' });
    }

    res.json(invite);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Join an invite
exports.joinInvite = async (req, res) => {
  try {
    const invite = await TemporaryInvite.findByPk(req.params.id);

    if (!invite) {
      return res.status(404).json({ message: 'Invite not found' });
    }

    // Check if invite is full
    const participantCount = await TemporaryInviteParticipant.count({
      where: { 
        inviteId: req.params.id, 
        status: 'accepted' 
      }
    });

    if (participantCount >= invite.maxParticipants) {
      return res.status(400).json({ message: 'Invite is full' });
    }

    // Check if user is already a participant
    const existingParticipant = await TemporaryInviteParticipant.findOne({
      where: { 
        inviteId: req.params.id, 
        userId: req.userId 
      }
    });

    if (existingParticipant) {
      return res.status(400).json({ message: 'Already joined this invite' });
    }

    const participant = await TemporaryInviteParticipant.create({
      inviteId: req.params.id,
      userId: req.userId,
      status: 'accepted' // For temporary invites, auto-accept
    });

    res.status(201).json(participant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Leave an invite
exports.leaveInvite = async (req, res) => {
  try {
    const participant = await TemporaryInviteParticipant.findOne({
      where: { 
        inviteId: req.params.id, 
        userId: req.userId 
      }
    });

    if (!participant) {
      return res.status(404).json({ message: 'Not a participant of this invite' });
    }

    // Don't allow creator to leave their own invite
    const invite = await TemporaryInvite.findByPk(req.params.id);
    if (invite.creatorId === req.userId) {
      return res.status(400).json({ message: 'Cannot leave your own invite' });
    }

    await participant.destroy();

    res.json({ message: 'Left invite successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};