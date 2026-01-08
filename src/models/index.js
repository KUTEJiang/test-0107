const User = require('./User');
const UserProfile = require('./UserProfile');
const Trip = require('./Trip');
const TripParticipant = require('./TripParticipant');
const TemporaryInvite = require('./TemporaryInvite');
const TemporaryInviteParticipant = require('./TemporaryInviteParticipant');
const Expense = require('./Expense');
const ExpenseSplit = require('./ExpenseSplit');

// Define all associations
function defineAssociations() {
  User.associate({ User, UserProfile, Trip, TripParticipant, TemporaryInvite, TemporaryInviteParticipant, Expense, ExpenseSplit });
  UserProfile.associate({ User, UserProfile, Trip, TripParticipant, TemporaryInvite, TemporaryInviteParticipant, Expense, ExpenseSplit });
  Trip.associate({ User, UserProfile, Trip, TripParticipant, TemporaryInvite, TemporaryInviteParticipant, Expense, ExpenseSplit });
  TripParticipant.associate({ User, UserProfile, Trip, TripParticipant, TemporaryInvite, TemporaryInviteParticipant, Expense, ExpenseSplit });
  TemporaryInvite.associate({ User, UserProfile, Trip, TripParticipant, TemporaryInvite, TemporaryInviteParticipant, Expense, ExpenseSplit });
  TemporaryInviteParticipant.associate({ User, UserProfile, Trip, TripParticipant, TemporaryInvite, TemporaryInviteParticipant, Expense, ExpenseSplit });
  Expense.associate({ User, UserProfile, Trip, TripParticipant, TemporaryInvite, TemporaryInviteParticipant, Expense, ExpenseSplit });
  ExpenseSplit.associate({ User, UserProfile, Trip, TripParticipant, TemporaryInvite, TemporaryInviteParticipant, Expense, ExpenseSplit });
}

module.exports = { defineAssociations, User, UserProfile, Trip, TripParticipant, TemporaryInvite, TemporaryInviteParticipant, Expense, ExpenseSplit };