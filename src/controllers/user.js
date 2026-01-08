const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const { defineAssociations } = require('../models');

// Get user profile by ID
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email'],
      include: [{
        model: UserProfile,
        as: 'profile',
        attributes: ['travelPreference', 'canDrive', 'budgetSensitivity', 'soloExperience', 'countriesVisited', 'profileImage', 'bio']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { travelPreference, canDrive, budgetSensitivity, soloExperience, countriesVisited, profileImage, bio } = req.body;

    // Find user profile
    const profile = await UserProfile.findOne({ where: { userId: req.params.id } });
    
    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Update profile
    await profile.update({
      travelPreference,
      canDrive,
      budgetSensitivity,
      soloExperience,
      countriesVisited,
      profileImage,
      bio
    });

    res.json({ message: 'Profile updated successfully', profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};