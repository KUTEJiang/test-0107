const mongoose = require('mongoose');

const buddyRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  activityType: {
    type: String,
    enum: ['meal', 'sightseeing', 'activity', 'other'],
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      index: '2dsphere'
    },
    address: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxParticipants: {
    type: Number,
    default: 4
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  status: {
    type: String,
    enum: ['active', 'full', 'completed', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('BuddyRequest', buddyRequestSchema);