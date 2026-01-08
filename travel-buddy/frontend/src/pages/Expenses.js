import React, { useState, useEffect } from 'react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'food',
    paidBy: '',
    participants: []
  });

  useEffect(() => {
    // In a real app, you would fetch from the backend
    // Mock data for demonstration
    const mockExpenses = [
      {
        _id: '1',
        title: '晚餐费用',
        description: '在居酒屋的晚餐',
        amount: 800,
        paidBy: { name: '张三' },
        participants: [
          { user: { name: '张三' }, share: 400 },
          { user: { name: '李四' }, share: 400 }
        ],
        category: 'food',
        date: '2023-06-15',
        status: 'pending'
      },
      {
        _id: '2',
        title: '交通费',
        description: '从机场到酒店的出租车费用',
        amount: 1200,
        paidBy: { name: '王五' },
        participants: [
          { user: { name: '王五' }, share: 600 },
          { user: { name: '赵六' }, share: 600 }
        ],
        category: 'transportation',
        date: '2023-06-14',
        status: 'settled'
      }
    ];
    
    setExpenses(mockExpenses);
  }, []);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    try {
      // In a real app, you would send this to the backend
      console.log('Creating expense:', formData);
      
      alert('费用记录创建成功！（演示目的）');
      setShowForm(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        category: 'food',
        paidBy: '',
        participants: []
      });
    } catch (err) {
      console.error(err);
      alert('创建费用记录失败，请重试');
    }
  };

  const calculateBalances = () => {
    // Calculate who owes whom how much
    const balances = {};
    
    expenses.forEach(expense => {
      if (expense.status === 'settled') return;
      
      // Add to the person who paid
      if (!balances[expense.paidBy.name]) {
        balances[expense.paidBy.name] = 0;
      }
      
      // Subtract each participant's share
      expense.participants.forEach(participant => {
        if (!balances[participant.user.name]) {
          balances[participant.user.name] = 0;
        }
        
        if (participant.user.name !== expense.paidBy.name) {
          balances[expense.paidBy.name] += participant.share;
          balances[participant.user.name] -= participant.share;
        }
      });
    });
    
    return balances;
  };

  const balances = calculateBalances();

  return (
    <div className="expenses">
      <div className="header">
        <h2>费用管理</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '取消' : '添加费用'}
        </button>
      </div>
      
      {showForm && (
        <form onSubmit={onSubmit} className="expense-form">
          <div className="form-group">
            <label htmlFor="title">费用名称</label>
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
            <label htmlFor="description">描述</label>
            <textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="2"
            ></textarea>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">金额</label>
              <input 
                type="number" 
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={onChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">类别</label>
              <select 
                id="category"
                name="category"
                value={formData.category}
                onChange={onChange}
              >
                <option value="food">餐饮</option>
                <option value="accommodation">住宿</option>
                <option value="transportation">交通</option>
                <option value="activity">活动</option>
                <option value="other">其他</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="paidBy">支付人</label>
            <input 
              type="text" 
              id="paidBy"
              name="paidBy"
              value={formData.paidBy}
              onChange={onChange}
              required 
              placeholder="输入支付人姓名"
            />
          </div>
          
          <button type="submit" className="btn btn-primary">添加费用</button>
        </form>
      )}
      
      <div className="expenses-list">
        <h3>费用明细</h3>
        {expenses.map(expense => (
          <div key={expense._id} className="expense-card">
            <div className="expense-header">
              <h4>{expense.title}</h4>
              <span className={`status ${expense.status}`}>{expense.status === 'pending' ? '待结算' : '已结算'}</span>
            </div>
            <p className="description">{expense.description}</p>
            <p className="amount">金额: ¥{expense.amount}</p>
            <p className="paid-by">支付人: {expense.paidBy.name}</p>
            <div className="participants">
              <h5>参与者及分摊:</h5>
              <ul>
                {expense.participants.map((participant, index) => (
                  <li key={index}>
                    {participant.user.name}: ¥{participant.share}
                  </li>
                ))}
              </ul>
            </div>
            <div className="expense-actions">
              {expense.status === 'pending' && (
                <button className="btn btn-secondary">标记为已结算</button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="balance-summary">
        <h3>结算概览</h3>
        <ul>
          {Object.entries(balances).map(([name, balance]) => (
            <li key={name} className={balance > 0 ? 'positive' : balance < 0 ? 'negative' : ''}>
              {name}: {balance > 0 ? `应收 ¥${balance}` : balance < 0 ? `应付 ¥${Math.abs(balance)}` : `已结清`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Expenses;