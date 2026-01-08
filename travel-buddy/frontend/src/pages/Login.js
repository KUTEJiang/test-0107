import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    try {
      // In a real app, you would handle authentication here
      // For now, just navigate to dashboard
      console.log('Login attempt with:', formData);
      alert('登录成功！（演示目的）');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('登录失败，请重试');
    }
  };

  return (
    <div className="login">
      <h2>登录</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">邮箱</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input 
            type="password" 
            id="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required 
          />
        </div>
        
        <button type="submit" className="btn btn-primary">登录</button>
      </form>
      
      <p>
        还没有账户？ <Link to="/register">立即注册</Link>
      </p>
    </div>
  );
};

export default Login;