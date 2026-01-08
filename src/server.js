const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./utils/database');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Import and define model associations
const { defineAssociations } = require('./models');
defineAssociations();

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully.');
    // Sync models
    return sequelize.sync();
  })
  .then(() => {
    console.log('Models synchronized with database.');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/invites', require('./routes/invites'));
app.use('/api/expenses', require('./routes/expenses'));

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});