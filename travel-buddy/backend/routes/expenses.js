const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// @route   POST api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, amount, paidBy, participants, trip, category } = req.body;

    const newExpense = new Expense({
      title,
      description,
      amount,
      paidBy,
      participants,
      trip,
      category
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/expenses
// @desc    Get all expenses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('paidBy', ['name', 'email'])
      .populate('participants.user', ['name', 'email']);

    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('paidBy', ['name', 'email'])
      .populate('participants.user', ['name', 'email']);

    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/expenses/:id/settle
// @desc    Mark expense as settled
// @access  Private
router.put('/:id/settle', auth, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status: 'settled' },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;