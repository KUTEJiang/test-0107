import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BuddyRequestsList = () => {
  const [buddyRequests, setBuddyRequests] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch from the backend
    // Mock data for demonstration
    const mockBuddyRequests = [
      {
        _id: '1',
        title: '寻找晚餐伙伴',
        description: '在涩谷找个人一起吃晚餐',
        activityType: 'meal',
        location: '东京涩谷',
        startTime: '2023-06-15T19:00',
        endTime: '2023-06-15T21:00',
        creator: { name: '赵六' },
        participants: [{ name: '赵六' }],
        maxParticipants: 2,
        status: 'active'
      },
      {
        _id: '2',
        title: '浅草寺游览伙伴',
        description: '一起参观浅草寺和周边商店街',
        activityType: 'sightseeing',
        location: '东京浅草',
        startTime: '2023-06-16T10:00',
        endTime: '2023-06-16T14:00',
        creator: { name: '钱七' },
        participants: [{ name: '钱七' }, { name: '孙八' }],
        maxParticipants: 4,
        status: 'active'
      }
    ];
    
    setBuddyRequests(mockBuddyRequests);
  }, []);

  return (
    <div className="buddy-requests-list">
      <div className="header">
        <h2>搭子请求</h2>
        <Link to="/create-buddy-request" className="btn btn-primary">发布新请求</Link>
      </div>
      
      <div className="buddy-requests-grid">
        {buddyRequests.map(request => (
          <div key={request._id} className="buddy-request-card">
            <h3>{request.title}</h3>
            <p className="activity-type">{request.activityType === 'meal' ? '用餐' : request.activityType === 'sightseeing' ? '游览' : '其他活动'}</p>
            <p className="location">{request.location}</p>
            <p className="time">{new Date(request.startTime).toLocaleString()} - {new Date(request.endTime).toLocaleString()}</p>
            <p className="description">{request.description}</p>
            <div className="participants">
              已有 {request.participants.length} 人参与，最多 {request.maxParticipants} 人
            </div>
            <div className="creator">
              发起人: {request.creator.name}
            </div>
            <div className="actions">
              <button className="btn btn-secondary">查看详情</button>
              {request.status === 'active' && (
                <button className="btn btn-primary">加入请求</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuddyRequestsList;