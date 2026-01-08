const Expense = require('../models/Expense');
const ExpenseSplit = require('../models/ExpenseSplit');
const Trip = require('../models/Trip');
const TripParticipant = require('../models/TripParticipant');
const User = require('../models/User');

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { tripId, title, amount, currency, participants, splitType } = req.body;

    // Verify user is part of the trip
    const tripParticipant = await TripParticipant.findOne({
      where: { 
        tripId,
        userId: req.userId
      }
    });

    if (!tripParticipant) {
      return res.status(403).json({ message: 'Not a participant of this trip' });
    }

    const expense = await Expense.create({
      tripId,
      creatorId: req.userId,
      title,
      amount,
      currency,
      participants: participants || [req.userId], // Default to creator only
      splitType
    });

    // Calculate splits based on splitType
    await calculateExpenseSplits(expense.id);

    res.status(201).json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get expenses for a trip
exports.getExpenses = async (req, res) => {
  try {
    const { tripId } = req.query;

    const expenses = await Expense.findAll({
      where: { tripId },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username']
        },
        {
          model: ExpenseSplit,
          as: 'splits',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Calculate expense splits
exports.splitExpenses = async (req, res) => {
  try {
    const { tripId } = req.body;

    // Get all unsettled expenses for the trip
    const expenses = await Expense.findAll({
      where: { tripId }
    });

    // Recalculate all splits
    for (const expense of expenses) {
      await calculateExpenseSplits(expense.id);
    }

    res.json({ message: 'Expense splits recalculated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mark an expense as settled
exports.settleExpense = async (req, res) => {
  try {
    const expenseSplit = await ExpenseSplit.findOne({
      where: {
        expenseId: req.params.id,
        userId: req.userId
      }
    });

    if (!expenseSplit) {
      return res.status(404).json({ message: 'Expense split not found' });
    }

    await expenseSplit.update({ paid: true });

    res.json({ message: 'Expense settled successfully', split: expenseSplit });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Helper function to calculate expense splits
async function calculateExpenseSplits(expenseId) {
  const expense = await Expense.findByPk(expenseId, {
    include: [{ model: Trip, as: 'trip' }]
  });

  if (!expense) {
    throw new Error('Expense not found');
  }

  // Clear existing splits
  await ExpenseSplit.destroy({ where: { expenseId } });

  // Get participants for this expense
  const participants = expense.participants;

  if (participants.length === 0) {
    return;
  }

  let splits = [];

  if (expense.splitType === 'equal') {
    // Split equally among participants
    const amountPerPerson = parseFloat(expense.amount) / participants.length;
    
    for (const userId of participants) {
      splits.push({
        expenseId: expense.id,
        userId,
        amountOwed: amountPerPerson
      });
    }
  } else if (expense.splitType === 'custom') {
    // Custom splits should be passed as part of the request
    // For now, defaulting to equal split as example
    const amountPerPerson = parseFloat(expense.amount) / participants.length;
    
    for (const userId of participants) {
      splits.push({
        expenseId: expense.id,
        userId,
        amountOwed: amountPerPerson
      });
    }
  } else if (expense.splitType === 'by_usage') {
    // For by_usage, we would need additional data about individual usage
    // Defaulting to equal split for now
    const amountPerPerson = parseFloat(expense.amount) / participants.length;
    
    for (const userId of participants) {
      splits.push({
        expenseId: expense.id,
        userId,
        amountOwed: amountPerPerson
      });
    }
  }

  // Create new splits
  if (splits.length > 0) {
    await ExpenseSplit.bulkCreate(splits);
  }
}