const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/user');
const { getCurrentUserProfile, updateCurrentUserProfile, getAllUserProfiles } = require('../controllers/userProfile');

// Get any user's public profile
router.get('/:id', getProfile);

// Update a user's profile (requires authentication)
router.put('/:id', protect, updateProfile);

// Get current user's profile
router.get('/profile/me', protect, getCurrentUserProfile);

// Update current user's profile
router.put('/profile/me', protect, updateCurrentUserProfile);

// Get all user profiles (for matching purposes)
router.get('/profiles', protect, getAllUserProfiles);

module.exports = router;