import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TripsList = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch from the backend
    // Mock data for demonstration
    const mockTrips = [
      {
        _id: '1',
        title: '日本关西文化之旅',
        description: '探索京都、大阪、奈良的文化遗产',
        destination: '日本关西',
        startDate: '2023-06-15',
        endDate: '2023-06-22',
        creator: { name: '张三' },
        participants: [{ name: '张三' }, { name: '李四' }],
        maxParticipants: 4,
        status: 'active'
      },
      {
        _id: '2',
        title: '泰国海岛度假',
        description: '普吉岛和皮皮岛的海滩度假',
        destination: '泰国',
        startDate: '2023-07-10',
        endDate: '2023-07-17',
        creator: { name: '王五' },
        participants: [{ name: '王五' }],
        maxParticipants: 3,
        status: 'active'
      }
    ];
    
    setTrips(mockTrips);
  }, []);

  return (
    <div className="trips-list">
      <div className="header">
        <h2>所有行程</h2>
        <Link to="/create-trip" className="btn btn-primary">发布新行程</Link>
      </div>
      
      <div className="trips-grid">
        {trips.map(trip => (
          <div key={trip._id} className="trip-card">
            <h3>{trip.title}</h3>
            <p className="destination">{trip.destination}</p>
            <p className="dates">{trip.startDate} 到 {trip.endDate}</p>
            <p className="description">{trip.description}</p>
            <div className="participants">
              已有 {trip.participants.length} 人参与，最多 {trip.maxParticipants} 人
            </div>
            <div className="creator">
              发起人: {trip.creator.name}
            </div>
            <div className="actions">
              <button className="btn btn-secondary">查看详情</button>
              {trip.status === 'active' && (
                <button className="btn btn-primary">加入行程</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripsList;