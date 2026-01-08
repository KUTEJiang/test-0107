const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createTrip, getTrips, getTrip, updateTrip, deleteTrip, joinTrip, leaveTrip } = require('../controllers/trip');

router.post('/', protect, createTrip);
router.get('/', getTrips);
router.get('/:id', getTrip);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);
router.post('/:id/join', protect, joinTrip);
router.post('/:id/leave', protect, leaveTrip);

module.exports = router;