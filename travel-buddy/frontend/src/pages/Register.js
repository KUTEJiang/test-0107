import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    personalityType: '',
    canDrive: false,
    priceSensitivity: '',
    soloExperience: '',
    countriesVisited: '',
    interests: '',
    about: ''
  });
  
  const navigate = useNavigate();

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('密码不匹配');
      return;
    }

    try {
      const countriesVisitedArray = formData.countriesVisited.split(',').map(country => country.trim()).filter(country => country);
      const interestsArray = formData.interests.split(',').map(interest => interest.trim()).filter(interest => interest);

      const res = await axios.post('/api/users', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        travelPreferences: {
          personalityType: formData.personalityType,
          canDrive: formData.canDrive,
          priceSensitivity: formData.priceSensitivity,
          soloExperience: formData.soloExperience,
          countriesVisited: countriesVisitedArray,
          interests: interestsArray,
          about: formData.about
        }
      });

      alert('注册成功！');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('注册失败，请重试');
    }
  };

  return (
    <div className="register">
      <h2>注册新账户</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">姓名</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            required 
          />
        </div>
        
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
        
        <div className="form-group">
          <label htmlFor="confirmPassword">确认密码</label>
          <input 
            type="password" 
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            required 
          />
        </div>
        
        <h3>旅行偏好</h3>
        
        <div className="form-group">
          <label htmlFor="personalityType">性格类型 (J/P)</label>
          <select 
            id="personalityType"
            name="personalityType"
            value={formData.personalityType}
            onChange={onChange}
          >
            <option value="">请选择</option>
            <option value="J">J (判断型)</option>
            <option value="P">P (知觉型)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="canDrive">
            <input 
              type="checkbox"
              id="canDrive"
              name="canDrive"
              checked={formData.canDrive}
              onChange={e => setFormData({...formData, canDrive: e.target.checked})}
            />
            能否开车
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="priceSensitivity">价格敏感度</label>
          <select 
            id="priceSensitivity"
            name="priceSensitivity"
            value={formData.priceSensitivity}
            onChange={onChange}
          >
            <option value="">请选择</option>
            <option value="budget">预算型</option>
            <option value="mid-range">中档</option>
            <option value="luxury">豪华型</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="soloExperience">独自出行经验</label>
          <select 
            id="soloExperience"
            name="soloExperience"
            value={formData.soloExperience}
            onChange={onChange}
          >
            <option value="">请选择</option>
            <option value="beginner">新手</option>
            <option value="intermediate">有一定经验</option>
            <option value="experienced">经验丰富</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="countriesVisited">去过的国家 (用逗号分隔)</label>
          <input 
            type="text" 
            id="countriesVisited"
            name="countriesVisited"
            value={formData.countriesVisited}
            onChange={onChange}
            placeholder="例如: 中国, 日本, 泰国"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="interests">兴趣爱好 (用逗号分隔)</label>
          <input 
            type="text" 
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={onChange}
            placeholder="例如: 摄影, 美食, 徒步, 博物馆"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="about">关于自己</label>
          <textarea 
            id="about"
            name="about"
            value={formData.about}
            onChange={onChange}
            rows="4"
          ></textarea>
        </div>
        
        <button type="submit" className="btn btn-primary">注册</button>
      </form>
    </div>
  );
};

export default Register;