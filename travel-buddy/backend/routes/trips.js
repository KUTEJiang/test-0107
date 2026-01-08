const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

// @route   POST api/trips
// @desc    Create a new trip
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, startDate, endDate, destination, itinerary, maxParticipants, expiresAt } = req.body;

    const newTrip = new Trip({
      title,
      description,
      startDate,
      endDate,
      destination,
      itinerary,
      maxParticipants,
      creator: req.user.id,
      participants: [req.user.id],
      expiresAt
    });

    const trip = await newTrip.save();
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/trips
// @desc    Get all trips
// @access  Public
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().populate('creator', ['name', 'email']).populate('participants', ['name', 'email']);
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/trips/:id
// @desc    Get trip by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('creator', ['name', 'email'])
      .populate('participants', ['name', 'email']);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/trips/:id/join
// @desc    Join a trip
// @access  Private
router.put('/:id/join', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Check if user is already a participant
    if (trip.participants.some(participant => participant.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'User already joined this trip' });
    }

    // Check if trip is full
    if (trip.participants.length >= trip.maxParticipants) {
      return res.status(400).json({ msg: 'Trip is full' });
    }

    trip.participants.push(req.user.id);
    await trip.save();

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;