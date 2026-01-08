const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createInvite, getInvites, getInvite, joinInvite, leaveInvite } = require('../controllers/invite');

router.post('/', protect, createInvite);
router.get('/', getInvites);
router.get('/:id', getInvite);
router.post('/:id/join', protect, joinInvite);
router.post('/:id/leave', protect, leaveInvite);

module.exports = router;