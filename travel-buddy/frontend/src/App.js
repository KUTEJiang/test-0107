import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import TripsList from './pages/TripsList';
import CreateBuddyRequest from './pages/CreateBuddyRequest';
import BuddyRequestsList from './pages/BuddyRequestsList';
import Expenses from './pages/Expenses';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/trips" element={<TripsList />} />
          <Route path="/create-buddy-request" element={<CreateBuddyRequest />} />
          <Route path="/buddy-requests" element={<BuddyRequestsList />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;