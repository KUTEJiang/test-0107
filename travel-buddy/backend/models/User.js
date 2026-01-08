const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  travelPreferences: {
    personalityType: {  // J or P personality
      type: String,
      enum: ['J', 'P']
    },
    canDrive: {
      type: Boolean,
      default: false
    },
    priceSensitivity: {
      type: String,  // budget, mid-range, luxury
      enum: ['budget', 'mid-range', 'luxury']
    },
    soloExperience: {
      type: String,  // beginner, intermediate, experienced
      enum: ['beginner', 'intermediate', 'experienced']
    },
    countriesVisited: [{
      type: String
    }],
    interests: [String],
    about: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      index: '2dsphere'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);