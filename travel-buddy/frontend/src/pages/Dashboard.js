import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>用户仪表盘</h2>
      
      <div className="dashboard-cards">
        <div className="card">
          <h3>游前计划</h3>
          <p>发布或查看即将开始的旅行计划</p>
          <Link to="/create-trip" className="btn btn-primary">发布行程</Link>
          <Link to="/trips" className="btn btn-secondary">查看行程</Link>
        </div>
        
        <div className="card">
          <h3>游中搭子</h3>
          <p>寻找临时旅伴一起用餐或游览</p>
          <Link to="/create-buddy-request" className="btn btn-primary">发起招募</Link>
          <Link to="/buddy-requests" className="btn btn-secondary">查看招募</Link>
        </div>
        
        <div className="card">
          <h3>费用管理</h3>
          <p>管理旅行中的费用分摊</p>
          <Link to="/expenses" className="btn btn-primary">管理费用</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;