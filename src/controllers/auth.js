const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Register a new user
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    user = await User.create({
      username,
      email,
      passwordHash
    });

    // Create default user profile
    await UserProfile.create({
      userId: user.id,
      travelPreference: null,
      canDrive: false,
      budgetSensitivity: 'medium',
      soloExperience: 0,
      countriesVisited: []
    });

    // Generate JWT token
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user profile separately since there's no association defined
    const profile = await UserProfile.findOne({ 
      where: { userId: req.userId } 
    });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      profile: profile || null
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { travelPreference, canDrive, budgetSensitivity, soloExperience, countriesVisited, profileImage, bio } = req.body;

    // Find or create user profile
    let profile = await UserProfile.findOne({ where: { userId: req.userId } });
    
    if (profile) {
      profile = await profile.update({
        travelPreference,
        canDrive,
        budgetSensitivity,
        soloExperience,
        countriesVisited,
        profileImage,
        bio
      });
    } else {
      profile = await UserProfile.create({
        userId: req.userId,
        travelPreference,
        canDrive,
        budgetSensitivity,
        soloExperience,
        countriesVisited,
        profileImage,
        bio
      });
    }

    res.json({ profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};