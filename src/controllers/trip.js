const Trip = require('../models/Trip');
const TripParticipant = require('../models/TripParticipant');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate, locations, maxParticipants, expiresAt } = req.body;

    const trip = await Trip.create({
      creatorId: req.userId,
      title,
      description,
      startDate,
      endDate,
      locations,
      maxParticipants,
      expiresAt
    });

    // Add creator as participant
    await TripParticipant.create({
      tripId: trip.id,
      userId: req.userId,
      status: 'accepted'
    });

    res.status(201).json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all trips
exports.getTrips = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    
    const offset = (page - 1) * limit;
    
    const trips = await Trip.findAndCountAll({
      where: { status },
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
      trips: trips.rows,
      totalPages: Math.ceil(trips.count / limit),
      currentPage: parseInt(page),
      total: trips.count
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get a specific trip
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username']
        },
        {
          model: TripParticipant,
          as: 'participants',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username'],
            include: [{
              model: UserProfile,
              as: 'profile',
              attributes: ['travelPreference', 'canDrive', 'budgetSensitivity', 'soloExperience']
            }]
          }]
        }
      ]
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is the creator
    if (trip.creatorId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this trip' });
    }

    await trip.update(req.body);

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is the creator
    if (trip.creatorId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this trip' });
    }

    await trip.destroy();

    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Join a trip
exports.joinTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if trip is full
    const participantCount = await TripParticipant.count({
      where: { 
        tripId: req.params.id, 
        status: 'accepted' 
      }
    });

    if (participantCount >= trip.maxParticipants) {
      return res.status(400).json({ message: 'Trip is full' });
    }

    // Check if user is already a participant
    const existingParticipant = await TripParticipant.findOne({
      where: { 
        tripId: req.params.id, 
        userId: req.userId 
      }
    });

    if (existingParticipant) {
      return res.status(400).json({ message: 'Already joined this trip' });
    }

    const participant = await TripParticipant.create({
      tripId: req.params.id,
      userId: req.userId,
      status: 'pending' // Need approval from trip creator
    });

    res.status(201).json(participant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Leave a trip
exports.leaveTrip = async (req, res) => {
  try {
    const participant = await TripParticipant.findOne({
      where: { 
        tripId: req.params.id, 
        userId: req.userId 
      }
    });

    if (!participant) {
      return res.status(404).json({ message: 'Not a participant of this trip' });
    }

    await participant.destroy();

    res.json({ message: 'Left trip successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};