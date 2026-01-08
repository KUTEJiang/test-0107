import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Travel Buddy</h1>
        <p>为独自旅行者打造的搭子匹配平台</p>
      </header>
      
      <section className="features">
        <div className="feature-card">
          <h2>游前计划</h2>
          <p>发布行程，招募志同道合的旅伴一起出游</p>
        </div>
        
        <div className="feature-card">
          <h2>游中搭子</h2>
          <p>临时寻找伙伴一起吃饭、游览景点</p>
        </div>
        
        <div className="feature-card">
          <h2>游后结算</h2>
          <p>轻松分摊旅行费用，明确转账金额</p>
        </div>
      </section>
      
      <section className="cta">
        <Link to="/register" className="btn btn-primary">立即注册</Link>
        <Link to="/login" className="btn btn-secondary">登录</Link>
      </section>
    </div>
  );
};

export default Home;