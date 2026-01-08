// 实时通知系统
class NotificationSystem {
  constructor() {
    this.notifications = [];
    this.notificationContainer = null;
    this.init();
  }

  init() {
    // 创建通知容器
    this.createNotificationContainer();
  }

  createNotificationContainer() {
    // 检查是否已有容器
    this.notificationContainer = document.getElementById('notification-container');
    
    if (!this.notificationContainer) {
      this.notificationContainer = document.createElement('div');
      this.notificationContainer.id = 'notification-container';
      this.notificationContainer.className = 'notifications';
      
      // 设置样式
      this.notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
      `;
      
      document.body.appendChild(this.notificationContainer);
    }
  }

  /**
   * 显示通知
   * @param {string} message - 通知消息
   * @param {string} type - 通知类型 ('info', 'success', 'warning', 'error')
   * @param {number} duration - 显示持续时间（毫秒），0表示永久显示
   */
  show(message, type = 'info', duration = 5000) {
    const notificationId = Date.now() + Math.random();
    
    const notificationEl = document.createElement('div');
    notificationEl.className = `notification notification-${type}`;
    notificationEl.dataset.id = notificationId;
    
    // 设置样式
    notificationEl.style.cssText = `
      background: ${this.getBackgroundColor(type)};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      margin-bottom: 10px;
      animation: slideInRight 0.3s ease-out;
      position: relative;
      min-width: 300px;
      max-width: 100%;
      word-wrap: break-word;
      opacity: 0;
      transform: translateX(100%);
      transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    
    // 添加内容
    notificationEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="flex: 1;">${this.getIcon(type)} ${message}</div>
        <button class="notification-close" 
                style="background: none; border: none; color: white; font-size: 1.2em; cursor: pointer; margin-left: 10px;"
                onclick="notificationSystem.hide(${notificationId})">&times;</button>
      </div>
    `;
    
    // 添加到容器
    this.notificationContainer.insertBefore(notificationEl, this.notificationContainer.firstChild);
    
    // 触发进入动画
    setTimeout(() => {
      notificationEl.style.opacity = '1';
      notificationEl.style.transform = 'translateX(0)';
    }, 10);
    
    // 添加到通知列表
    this.notifications.push({
      id: notificationId,
      element: notificationEl,
      type,
      message,
      timestamp: new Date()
    });
    
    // 自动隐藏
    if (duration > 0) {
      setTimeout(() => {
        this.hide(notificationId);
      }, duration);
    }
    
    return notificationId;
  }

  /**
   * 隐藏通知
   * @param {number} notificationId - 通知ID
   */
  hide(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      // 触发退出动画
      notification.element.style.opacity = '0';
      notification.element.style.transform = 'translateX(100%)';
      
      // 从DOM移除
      setTimeout(() => {
        if (notification.element.parentNode) {
          notification.element.parentNode.removeChild(notification.element);
        }
      }, 300);
      
      // 从列表移除
      this.notifications = this.notifications.filter(n => n.id !== notificationId);
    }
  }

  /**
   * 隐藏所有通知
   */
  hideAll() {
    [...this.notifications].forEach(notification => {
      this.hide(notification.id);
    });
  }

  /**
   * 获取背景颜色
   */
  getBackgroundColor(type) {
    switch (type) {
      case 'success':
        return '#2ed573';
      case 'warning':
        return '#ffa502';
      case 'error':
        return '#ff4757';
      case 'info':
      default:
        return '#3742fa';
    }
  }

  /**
   * 获取图标
   */
  getIcon(type) {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✗';
      case 'info':
      default:
        return 'ℹ';
    }
  }

  /**
   * 旅行相关通知
   */
  showTripNotification(message, type = 'info') {
    return this.show(`✈️ ${message}`, type);
  }

  /**
   * 匹配相关通知
   */
  showMatchNotification(message, type = 'info') {
    return this.show(`👥 ${message}`, type);
  }

  /**
   * 系统通知
   */
  showSystemNotification(message, type = 'info') {
    return this.show(`⚙️ ${message}`, type);
  }

  /**
   * 实时聊天通知
   */
  showChatNotification(message, sender) {
    return this.show(`💬 ${sender}: ${message}`, 'info', 10000);
  }

  /**
   * 位置更新通知
   */
  showLocationNotification(message) {
    return this.show(`📍 ${message}`, 'info', 3000);
  }

  /**
   * 新搭子匹配通知
   */
  showNewMatchNotification(username, matchPercentage) {
    return this.show(`🎉 新的旅行搭子匹配！与 ${username} 的匹配度为 ${matchPercentage}%`, 'success', 8000);
  }

  /**
   * 邀请通知
   */
  showInviteNotification(inviter, activity, location) {
    return this.show(`💌 ${inviter} 邀请您参加 ${activity} 活动，地点：${location}`, 'info', 10000);
  }
}

// 创建全局实例
const notificationSystem = new NotificationSystem();

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
  
  .notification {
    font-family: 'Noto Sans SC', sans-serif;
  }
`;
document.head.appendChild(style);

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationSystem;
}