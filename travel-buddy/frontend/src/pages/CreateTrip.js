import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    destination: '',
    maxParticipants: 4,
    expiresAt: ''
  });
  
  const navigate = useNavigate();

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    try {
      // In a real app, you would send this to the backend
      console.log('Creating trip:', formData);
      
      // Mock API call
      // const res = await axios.post('/api/trips', formData, {
      //   headers: {
      //     'x-auth-token': localStorage.getItem('token')
      //   }
      // });

      alert('行程创建成功！（演示目的）');
      navigate('/trips');
    } catch (err) {
      console.error(err);
      alert('创建行程失败，请重试');
    }
  };

  return (
    <div className="create-trip">
      <h2>创建新行程</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">行程标题</label>
          <input 
            type="text" 
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">行程描述</label>
          <textarea 
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            rows="4"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="destination">目的地</label>
          <input 
            type="text" 
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={onChange}
            required 
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">开始日期</label>
            <input 
              type="date" 
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={onChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">结束日期</label>
            <input 
              type="date" 
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={onChange}
              required 
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="maxParticipants">最大参与者数量</label>
          <input 
            type="number" 
            id="maxParticipants"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={onChange}
            min="2"
            max="10"
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="expiresAt">招募截止时间</label>
          <input 
            type="datetime-local" 
            id="expiresAt"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={onChange}
            required 
          />
        </div>
        
        <button type="submit" className="btn btn-primary">创建行程</button>
      </form>
    </div>
  );
};

export default CreateTrip;