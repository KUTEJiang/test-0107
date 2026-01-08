const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createExpense, getExpenses, splitExpenses, settleExpense } = require('../controllers/expense');

router.post('/', protect, createExpense);
router.get('/', getExpenses);
router.post('/split', protect, splitExpenses);
router.post('/:id/settle', protect, settleExpense);

module.exports = router;