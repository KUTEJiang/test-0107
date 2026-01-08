// 聊天功能模块
class ChatSystem {
  constructor() {
    this.chatContainer = null;
    this.chatWindow = null;
    this.messages = [];
    this.isConnected = false;
    this.currentChatPartner = null;
    this.chatHistory = new Map(); // 存储与每个用户的聊天历史
    
    this.init();
  }
  
  init() {
    this.createChatUI();
    this.setupEventListeners();
  }
  
  createChatUI() {
    // 创建聊天容器
    this.chatContainer = document.createElement('div');
    this.chatContainer.id = 'chat-container';
    this.chatContainer.className = 'chat-container';
    this.chatContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      width: 350px;
      height: 450px;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      overflow: hidden;
      display: none; /* 默认隐藏 */
    `;
    
    this.chatContainer.innerHTML = `
      <div class="chat-header" style="
        background: linear-gradient(45deg, #4361ee, #3a0ca3);
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div class="chat-title">旅行搭子聊天</div>
        <div class="chat-status" style="font-size: 0.8em; opacity: 0.8;"></div>
        <button id="close-chat" style="
          background: none;
          border: none;
          color: white;
          font-size: 1.2em;
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        ">&times;</button>
      </div>
      <div id="chat-messages" class="chat-messages" style="
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        background: #f9f9f9;
        display: flex;
        flex-direction: column;
        gap: 10px;
      "></div>
      <div class="chat-input-area" style="
        padding: 12px;
        border-top: 1px solid #eee;
        background: white;
        display: flex;
        gap: 8px;
      ">
        <input type="text" id="chat-input" placeholder="输入消息..." style="
          flex: 1;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 20px;
          outline: none;
        ">
        <button id="send-message" style="
          background: #4361ee;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        ">➤</button>
      </div>
    `;
    
    document.body.appendChild(this.chatContainer);
    
    // 获取元素引用
    this.chatWindow = this.chatContainer;
    this.messagesContainer = document.getElementById('chat-messages');
    this.chatInput = document.getElementById('chat-input');
    this.sendMessageBtn = document.getElementById('send-message');
    this.closeChatBtn = document.getElementById('close-chat');
    
    // 设置事件监听器
    this.sendMessageBtn.addEventListener('click', () => this.sendMessage());
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
    this.closeChatBtn.addEventListener('click', () => this.closeChat());
  }
  
  setupEventListeners() {
    // 监听全局聊天请求
    window.addEventListener('startChat', (event) => {
      this.startChat(event.detail.userId, event.detail.username);
    });
  }
  
  startChat(userId, username) {
    this.currentChatPartner = { id: userId, username: username };
    this.chatContainer.style.display = 'flex';
    
    // 更新聊天标题
    document.querySelector('.chat-title').textContent = `与 ${username} 聊天`;
    
    // 显示连接状态
    this.updateStatus('已连接');
    
    // 加载聊天历史
    this.loadChatHistory(userId);
    
    // 模拟收到欢迎消息
    setTimeout(() => {
      this.addMessage({
        id: Date.now(),
        sender: 'system',
        content: `您正在与${username}聊天。祝您聊天愉快！`,
        timestamp: new Date()
      });
    }, 500);
  }
  
  closeChat() {
    this.chatContainer.style.display = 'none';
    this.currentChatPartner = null;
    this.messages = [];
    this.updateStatus('离线');
  }
  
  updateStatus(status) {
    document.querySelector('.chat-status').textContent = status;
  }
  
  loadChatHistory(userId) {
    // 模拟加载聊天历史
    const history = this.chatHistory.get(userId) || [];
    this.messages = [...history];
    this.renderMessages();
  }
  
  saveChatHistory(userId) {
    this.chatHistory.set(userId, [...this.messages]);
  }
  
  sendMessage() {
    if (!this.currentChatPartner || !this.chatInput.value.trim()) return;
    
    const message = {
      id: Date.now(),
      sender: 'me',
      content: this.chatInput.value.trim(),
      timestamp: new Date()
    };
    
    this.addMessage(message);
    this.chatInput.value = '';
    
    // 保存聊天历史
    if (this.currentChatPartner) {
      this.saveChatHistory(this.currentChatPartner.id);
    }
    
    // 模拟对方回复
    this.simulateReply();
  }
  
  addMessage(message) {
    this.messages.push(message);
    this.renderMessages();
    
    // 滚动到底部
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
  
  renderMessages() {
    if (!this.messagesContainer) return;
    
    this.messagesContainer.innerHTML = this.messages.map(msg => {
      const isMe = msg.sender === 'me';
      const isSystem = msg.sender === 'system';
      
      let messageClass = 'message';
      if (isMe) messageClass += ' message-outgoing';
      else if (isSystem) messageClass += ' message-system';
      else messageClass += ' message-incoming';
      
      const sender = isMe ? '我' : (isSystem ? '系统' : this.currentChatPartner?.username || '对方');
      const timestamp = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      return `
        <div class="${messageClass}" style="
          max-width: 80%;
          padding: 10px 15px;
          border-radius: 18px;
          margin-bottom: 8px;
          position: relative;
          ${isMe ? 'margin-left: auto; background: #4361ee; color: white;' : 
            isSystem ? 'margin: 10px auto; background: #f0f0f0; color: #666; text-align: center; width: fit-content;' : 
            'margin-right: auto; background: #e9ecef; color: #333;'}
        ">
          ${!isSystem ? `<div style="font-weight: 500; font-size: 0.8em; margin-bottom: 3px;">${sender}</div>` : ''}
          <div>${msg.content}</div>
          <div style="
            font-size: 0.7em;
            opacity: 0.7;
            text-align: right;
            margin-top: 3px;
            ${isSystem ? 'text-align: center;' : ''}
          ">${timestamp}</div>
        </div>
      `;
    }).join('');
  }
  
  simulateReply() {
    // 模拟对方回复
    setTimeout(() => {
      if (!this.currentChatPartner) return;
      
      const replies = [
        '听起来不错！',
        '是的，我也这么想',
        '你计划什么时候出发？',
        '有什么具体的行程安排吗？',
        '需要我帮忙查一下交通信息吗？',
        '你对当地美食有什么推荐吗？',
        '我们可以在XX景点见面',
        '我觉得这个计划很合理',
        '你有什么特别想去的地方吗？',
        '我们可以一起制定详细计划'
      ];
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const replyMessage = {
        id: Date.now(),
        sender: 'other',
        content: randomReply,
        timestamp: new Date()
      };
      
      this.addMessage(replyMessage);
      
      // 保存聊天历史
      if (this.currentChatPartner) {
        this.saveChatHistory(this.currentChatPartner.id);
      }
    }, 1000 + Math.random() * 2000); // 1-3秒后回复
  }
  
  // 公共方法：开始聊天
  startChatWithUser(userId, username) {
    window.dispatchEvent(new CustomEvent('startChat', {
      detail: { userId, username }
    }));
  }
  
  // 检查是否有未读消息
  hasUnreadMessages(userId) {
    const history = this.chatHistory.get(userId) || [];
    // 在实际应用中，这里会检查最后阅读的消息时间戳
    return history.length > 0;
  }
  
  // 获取最后一条消息
  getLastMessage(userId) {
    const history = this.chatHistory.get(userId) || [];
    return history.length > 0 ? history[history.length - 1] : null;
  }
}

// 创建全局聊天实例
const chatSystem = new ChatSystem();

// 添加聊天相关的CSS
const chatStyles = document.createElement('style');
chatStyles.textContent = `
  .chat-container {
    font-family: 'Noto Sans SC', sans-serif;
  }
  
  .message-outgoing {
    background: linear-gradient(45deg, #4361ee, #3a0ca3) !important;
  }
  
  .message-incoming {
    background: #e9ecef !important;
  }
  
  .message-system {
    background: #f0f0f0 !important;
    color: #666 !important;
    text-align: center !important;
    width: fit-content !important;
    margin: 10px auto !important;
    border-radius: 20px !important;
  }
  
  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }
  
  .chat-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .chat-messages::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;
document.head.appendChild(chatStyles);

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChatSystem;
}