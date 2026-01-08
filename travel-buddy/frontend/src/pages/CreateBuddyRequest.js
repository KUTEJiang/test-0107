import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateBuddyRequest = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activityType: 'meal',
    location: '',
    startTime: '',
    endTime: '',
    maxParticipants: 2,
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
      console.log('Creating buddy request:', formData);
      
      alert('搭子请求创建成功！（演示目的）');
      navigate('/buddy-requests');
    } catch (err) {
      console.error(err);
      alert('创建搭子请求失败，请重试');
    }
  };

  return (
    <div className="create-buddy-request">
      <h2>创建搭子请求</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">请求标题</label>
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
          <label htmlFor="description">请求描述</label>
          <textarea 
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="activityType">活动类型</label>
          <select 
            id="activityType"
            name="activityType"
            value={formData.activityType}
            onChange={onChange}
          >
            <option value="meal">一起用餐</option>
            <option value="sightseeing">一起游览</option>
            <option value="activity">其他活动</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">地点</label>
          <input 
            type="text" 
            id="location"
            name="location"
            value={formData.location}
            onChange={onChange}
            required 
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">开始时间</label>
            <input 
              type="datetime-local" 
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={onChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endTime">结束时间</label>
            <input 
              type="datetime-local" 
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={onChange}
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
          <label htmlFor="expiresAt">请求截止时间</label>
          <input 
            type="datetime-local" 
            id="expiresAt"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={onChange}
            required 
          />
        </div>
        
        <button type="submit" className="btn btn-primary">发布请求</button>
      </form>
    </div>
  );
};

export default CreateBuddyRequest;