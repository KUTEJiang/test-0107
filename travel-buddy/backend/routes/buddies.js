const express = require('express');
const router = express.Router();
const BuddyRequest = require('../models/BuddyRequest');
const auth = require('../middleware/auth');

// @route   POST api/buddies
// @desc    Create a new buddy request
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, activityType, location, startTime, endTime, maxParticipants, expiresAt } = req.body;

    const newBuddyRequest = new BuddyRequest({
      title,
      description,
      activityType,
      location,
      startTime,
      endTime,
      maxParticipants,
      creator: req.user.id,
      participants: [req.user.id],
      expiresAt
    });

    const buddyRequest = await newBuddyRequest.save();
    res.json(buddyRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/buddies
// @desc    Get all buddy requests
// @access  Public
router.get('/', async (req, res) => {
  try {
    const buddyRequests = await BuddyRequest.find()
      .populate('creator', ['name', 'email'])
      .populate('participants', ['name', 'email']);
    res.json(buddyRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/buddies/:id
// @desc    Get buddy request by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const buddyRequest = await BuddyRequest.findById(req.params.id)
      .populate('creator', ['name', 'email'])
      .populate('participants', ['name', 'email']);

    if (!buddyRequest) {
      return res.status(404).json({ msg: 'Buddy request not found' });
    }

    res.json(buddyRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/buddies/:id/join
// @desc    Join a buddy request
// @access  Private
router.put('/:id/join', auth, async (req, res) => {
  try {
    const buddyRequest = await BuddyRequest.findById(req.params.id);

    if (!buddyRequest) {
      return res.status(404).json({ msg: 'Buddy request not found' });
    }

    // Check if user is already a participant
    if (buddyRequest.participants.some(participant => participant.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'User already joined this buddy request' });
    }

    // Check if request is full
    if (buddyRequest.participants.length >= buddyRequest.maxParticipants) {
      return res.status(400).json({ msg: 'Buddy request is full' });
    }

    buddyRequest.participants.push(req.user.id);
    await buddyRequest.save();

    res.json(buddyRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;