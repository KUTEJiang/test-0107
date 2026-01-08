const UserProfile = require('../models/UserProfile');
const User = require('../models/User');

// Get user profile with travel preferences
exports.getProfile = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ 
      where: { userId: req.params.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email']
      }]
    });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.json(userProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user profile with travel preferences
exports.updateProfile = async (req, res) => {
  try {
    const {
      mbtiType,
      travelPreference,
      canDrive,
      budgetSensitivity,
      soloExperience,
      countriesVisited,
      profileImage,
      bio,
      travelStyle,
      pacePreference,
      accommodationPreference,
      activityPreference,
      riskTolerance
    } = req.body;

    const profile = await UserProfile.findOne({ where: { userId: req.params.id } });
    
    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Update profile
    await profile.update({
      mbtiType,
      travelPreference,
      canDrive,
      budgetSensitivity,
      soloExperience,
      countriesVisited,
      profileImage,
      bio,
      travelStyle,
      pacePreference,
      accommodationPreference,
      activityPreference,
      riskTolerance
    });

    res.json({ 
      message: 'Profile updated successfully', 
      profile: {
        ...profile.toJSON(),
        // Include user info in response
        user: await User.findByPk(req.params.id, {
          attributes: ['id', 'username', 'email']
        })
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get current user's profile
exports.getCurrentUserProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ 
      where: { userId: req.userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email']
      }]
    });

    if (!profile) {
      // If no profile exists, create a default one
      const newProfile = await UserProfile.create({
        userId: req.userId,
        travelPreference: null,
        canDrive: false,
        budgetSensitivity: 'medium',
        soloExperience: 0,
        countriesVisited: [],
        profileImage: null,
        bio: null
      });

      return res.json(newProfile);
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update current user's profile
exports.updateCurrentUserProfile = async (req, res) => {
  try {
    const {
      mbtiType,
      travelPreference,
      canDrive,
      budgetSensitivity,
      soloExperience,
      countriesVisited,
      profileImage,
      bio,
      travelStyle,
      pacePreference,
      accommodationPreference,
      activityPreference,
      riskTolerance
    } = req.body;

    let profile = await UserProfile.findOne({ where: { userId: req.userId } });
    
    if (!profile) {
      // Create profile if it doesn't exist
      profile = await UserProfile.create({
        userId: req.userId,
        mbtiType,
        travelPreference,
        canDrive,
        budgetSensitivity,
        soloExperience,
        countriesVisited,
        profileImage,
        bio,
        travelStyle,
        pacePreference,
        accommodationPreference,
        activityPreference,
        riskTolerance
      });
    } else {
      // Update existing profile
      await profile.update({
        mbtiType,
        travelPreference,
        canDrive,
        budgetSensitivity,
        soloExperience,
        countriesVisited,
        profileImage,
        bio,
        travelStyle,
        pacePreference,
        accommodationPreference,
        activityPreference,
        riskTolerance
      });
    }

    res.json({ 
      message: 'Profile updated successfully', 
      profile 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};