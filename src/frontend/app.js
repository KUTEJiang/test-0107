// API base URL
const API_BASE_URL = '/api';

// 地图实例
let tripMap = null;
let inviteMap = null;

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const tripsNavBtn = document.getElementById('tripsNavBtn');
const invitesNavBtn = document.getElementById('invitesNavBtn');
const expensesNavBtn = document.getElementById('expensesNavBtn');
const profileNavBtn = document.getElementById('profileNavBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeButtons = document.querySelectorAll('.close');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const homeSection = document.getElementById('homeSection');
const tripsSection = document.getElementById('tripsSection');
const invitesSection = document.getElementById('invitesSection');
const expensesSection = document.getElementById('expensesSection');
const profileSection = document.getElementById('profileSection');
const createTripBtn = document.getElementById('createTripBtn');
const createInviteBtn = document.getElementById('createInviteBtn');
const preferenceForm = document.getElementById('preferenceForm');
const mapContainer = document.getElementById('mapContainer');
const mapContainer2 = document.getElementById('mapContainer2');

// Auth state
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  updateUIBasedOnAuth();
  
  // 初始化地图（如果元素存在）
  if (mapContainer) {
    tripMap = new TravelMap('mapContainer');
  }
  
  if (mapContainer2) {
    inviteMap = new TravelMap('mapContainer2');
  }
});

// Set up event listeners
function setupEventListeners() {
  // Modal triggers
  loginBtn.addEventListener('click', () => openModal(loginModal));
  registerBtn.addEventListener('click', () => openModal(registerModal));
  logoutBtn.addEventListener('click', logout);

  // Close modals
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  // Form submissions
  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);

  // Navigation buttons
  tripsNavBtn.addEventListener('click', showTrips);
  invitesNavBtn.addEventListener('click', showInvites);
  expensesNavBtn.addEventListener('click', showExpenses);
  profileNavBtn.addEventListener('click', showProfile);

  // Other buttons
  createTripBtn.addEventListener('click', createTrip);
  createInviteBtn.addEventListener('click', createInvite);
  
  // Profile form
  preferenceForm.addEventListener('submit', saveProfilePreferences);

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
      closeModal(event.target);
    }
  });
}

// Modal functions
function openModal(modal) {
  modal.style.display = 'block';
}

function closeModal(modal) {
  if (modal) {
    modal.style.display = 'none';
  } else {
    // If no modal specified, close all
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
  }
}

// Authentication handlers
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;
      
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      updateUIBasedOnAuth();
      closeModal(loginModal);
      alert('登录成功！');
    } else {
      alert(data.message || '登录失败');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('登录时发生错误，请稍后再试');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;
      
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      updateUIBasedOnAuth();
      closeModal(registerModal);
      alert('注册成功！');
    } else {
      alert(data.message || '注册失败');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('注册时发生错误，请稍后再试');
  }
}

function logout() {
  authToken = null;
  currentUser = null;
  
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  
  updateUIBasedOnAuth();
  alert('已退出登录');
}

function updateUIBasedOnAuth() {
  if (authToken) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    profileNavBtn.style.display = 'inline-block';
  } else {
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    profileNavBtn.style.display = 'none';
    
    // Hide profile section when logged out
    profileSection.style.display = 'none';
  }
}

// Navigation functions
function showTrips() {
  homeSection.style.display = 'none';
  tripsSection.style.display = 'block';
  invitesSection.style.display = 'none';
  expensesSection.style.display = 'none';
  
  loadTrips();
}

function showInvites() {
  homeSection.style.display = 'none';
  tripsSection.style.display = 'none';
  invitesSection.style.display = 'block';
  expensesSection.style.display = 'none';
  
  loadInvites();
}

function showExpenses() {
  homeSection.style.display = 'none';
  tripsSection.style.display = 'none';
  invitesSection.style.display = 'none';
  expensesSection.style.display = 'block';
  
  loadExpenses();
}

function showProfile() {
  if (!authToken) {
    alert('请先登录');
    return;
  }
  
  homeSection.style.display = 'none';
  tripsSection.style.display = 'none';
  invitesSection.style.display = 'none';
  expensesSection.style.display = 'none';
  profileSection.style.display = 'block';
  
  loadUserProfile();
}

async function loadUserProfile() {
  try {
    const response = await apiRequest('/users/profile/me');
    const profile = await response.json();
    
    if (response.ok) {
      // 填充表单字段
      if (profile.mbtiType) {
        document.getElementById('mbtiType').value = profile.mbtiType;
      }
      if (profile.travelPreference) {
        document.getElementById('travelPreference').value = profile.travelPreference;
      }
      if (profile.canDrive !== undefined) {
        document.getElementById('canDrive').checked = profile.canDrive;
      }
      if (profile.budgetSensitivity) {
        document.getElementById('budgetSensitivity').value = profile.budgetSensitivity;
      }
      if (profile.soloExperience !== undefined) {
        document.getElementById('soloExperience').value = profile.soloExperience;
      }
      if (profile.travelStyle) {
        document.getElementById('travelStyle').value = profile.travelStyle;
      }
      if (profile.pacePreference) {
        document.getElementById('pacePreference').value = profile.pacePreference;
      }
      if (profile.accommodationPreference) {
        document.getElementById('accommodationPreference').value = profile.accommodationPreference;
      }
      if (profile.activityPreference) {
        document.getElementById('activityPreference').value = profile.activityPreference;
      }
      if (profile.riskTolerance) {
        document.getElementById('riskTolerance').value = profile.riskTolerance;
      }
      if (profile.countriesVisited && profile.countriesVisited.length > 0) {
        document.getElementById('countriesVisited').value = profile.countriesVisited.join(', ');
      }
      if (profile.profileImage) {
        document.getElementById('profileImage').value = profile.profileImage;
      }
      if (profile.bio) {
        document.getElementById('bio').value = profile.bio;
      }
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
    // 初始化表单为空
    document.getElementById('mbtiType').value = '';
    document.getElementById('travelPreference').value = '';
    document.getElementById('canDrive').checked = false;
    document.getElementById('budgetSensitivity').value = 'medium';
    document.getElementById('soloExperience').value = '0';
    document.getElementById('travelStyle').value = 'cultural';
    document.getElementById('pacePreference').value = 'moderate';
    document.getElementById('accommodationPreference').value = 'mixed';
    document.getElementById('activityPreference').value = 'mixed';
    document.getElementById('riskTolerance').value = 'medium';
    document.getElementById('countriesVisited').value = '';
    document.getElementById('profileImage').value = '';
    document.getElementById('bio').value = '';
  }
}

async function saveProfilePreferences(e) {
  e.preventDefault();
  
  if (!authToken) {
    alert('请先登录');
    return;
  }
  
  const mbtiType = document.getElementById('mbtiType').value.toUpperCase();
  const travelPreference = document.getElementById('travelPreference').value;
  const canDrive = document.getElementById('canDrive').checked;
  const budgetSensitivity = document.getElementById('budgetSensitivity').value;
  const soloExperience = parseInt(document.getElementById('soloExperience').value) || 0;
  const travelStyle = document.getElementById('travelStyle').value;
  const pacePreference = document.getElementById('pacePreference').value;
  const accommodationPreference = document.getElementById('accommodationPreference').value;
  const activityPreference = document.getElementById('activityPreference').value;
  const riskTolerance = document.getElementById('riskTolerance').value;
  const countriesVisitedText = document.getElementById('countriesVisited').value;
  const countriesVisited = countriesVisitedText ? countriesVisitedText.split(',').map(country => country.trim()).filter(country => country) : [];
  const profileImage = document.getElementById('profileImage').value;
  const bio = document.getElementById('bio').value;
  
  // 验证MBTI类型
  if (mbtiType && !/^[EJI][NSFP][TFJP][PJ]$/.test(mbtiType)) {
    alert('请输入有效的MBTI类型（例如：ENFJ, ISTP等）');
    return;
  }
  
  try {
    const response = await apiRequest('/users/profile/me', {
      method: 'PUT',
      body: JSON.stringify({
        mbtiType,
        travelPreference,
        canDrive,
        budgetSensitivity,
        soloExperience,
        travelStyle,
        pacePreference,
        accommodationPreference,
        activityPreference,
        riskTolerance,
        countriesVisited,
        profileImage,
        bio
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      alert('档案更新成功！');
    } else {
      alert(result.message || '更新档案失败');
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('更新档案时发生错误');
  }
}

// API helper function
async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  return response;
}

// Trip functions
async function loadTrips() {
  try {
    const response = await apiRequest('/trips');
    const trips = await response.json();
    
    const tripsList = document.getElementById('tripsList');
    tripsList.innerHTML = '';
    
    // 显示地图容器
    if (mapContainer) {
      mapContainer.style.display = 'block';
    }
    
    if (trips.trips && trips.trips.length > 0) {
      trips.trips.forEach(trip => {
        const tripElement = document.createElement('div');
        tripElement.className = 'trip-item';
        tripElement.innerHTML = `
          <h3>${trip.title}</h3>
          <p>${trip.description}</p>
          <div class="trip-meta">
            <p><strong>创建者:</strong> ${trip.creator?.username || '未知'}</p>
            <p><strong>开始时间:</strong> ${formatDate(trip.startDate)}</p>
            <p><strong>结束时间:</strong> ${formatDate(trip.endDate)}</p>
            <p><strong>最大人数:</strong> ${trip.maxParticipants}</p>
            <p><strong>状态:</strong> ${trip.status}</p>
          </div>
          <div class="trip-actions">
            <button class="btn btn-primary" onclick="joinTrip(${trip.id})">加入行程</button>
            <button class="btn btn-outline" onclick="viewTripDetails(${trip.id}); showTripOnMap(${trip.id})">在地图上查看</button>
          </div>
        `;
        tripsList.appendChild(tripElement);
      });
    } else {
      tripsList.innerHTML = '<p>暂无行程信息</p>';
    }
  } catch (error) {
    console.error('Error loading trips:', error);
    document.getElementById('tripsList').innerHTML = '<p>加载行程信息失败</p>';
  }
}

// 在地图上显示行程
async function showTripOnMap(tripId) {
  try {
    const response = await apiRequest(`/trips/${tripId}`);
    const trip = await response.json();
    
    if (tripMap && tripMap.loaded) {
      tripMap.addTripToMap(trip);
    } else {
      console.log('地图尚未加载完成，将在加载后显示行程');
      // 等待地图加载后显示
      setTimeout(() => showTripOnMap(tripId), 1000);
    }
  } catch (error) {
    console.error('Error showing trip on map:', error);
  }
}

async function createTrip() {
  if (!authToken) {
    alert('请先登录');
    return;
  }
  
  // 使用更友好的界面来创建行程
  const tripData = prompt('请输入行程信息 (格式: 标题|描述|开始日期|结束日期|最大人数，例如: 北欧之旅|探索北欧四国|2023-06-01|2023-06-15|5):');
  
  if (tripData) {
    const [title, description, startDate, endDate, maxParticipantsStr] = tripData.split('|');
    
    if (title && description && startDate && endDate && maxParticipantsStr) {
      try {
        const response = await apiRequest('/trips', {
          method: 'POST',
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            startDate,
            endDate,
            maxParticipants: parseInt(maxParticipantsStr.trim()),
            locations: [], // For now, empty array
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
          })
        });
        
        if (response.ok) {
          alert('行程创建成功！');
          loadTrips(); // Refresh the list
        } else {
          const error = await response.json();
          alert(error.message || '创建行程失败');
        }
      } catch (error) {
        console.error('Error creating trip:', error);
        alert('创建行程时发生错误');
      }
    } else {
      alert('输入格式不正确，请按照指定格式输入');
    }
  }
}

async function joinTrip(tripId) {
  if (!authToken) {
    alert('请先登录');
    return;
  }
  
  try {
    const response = await apiRequest(`/trips/${tripId}/join`, {
      method: 'POST'
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('已申请加入行程！等待确认中...');
      loadTrips(); // Refresh the list
    } else {
      alert(data.message || '加入行程失败');
    }
  } catch (error) {
    console.error('Error joining trip:', error);
    alert('加入行程时发生错误');
  }
}

async function viewTripDetails(tripId) {
  try {
    const response = await apiRequest(`/trips/${tripId}`);
    const trip = await response.json();
    
    alert(`
      行程详情:
      标题: ${trip.title}
      描述: ${trip.description}
      创建者: ${trip.creator?.username || '未知'}
      开始时间: ${formatDate(trip.startDate)}
      结束时间: ${formatDate(trip.endDate)}
      最大人数: ${trip.maxParticipants}
      状态: ${trip.status}
      参与人数: ${trip.participants?.length || 0}
    `);
  } catch (error) {
    console.error('Error viewing trip details:', error);
    alert('获取行程详情失败');
  }
}

// Invite functions
async function loadInvites() {
  try {
    const response = await apiRequest('/invites');
    const invites = await response.json();
    
    const invitesList = document.getElementById('invitesList');
    invitesList.innerHTML = '';
    
    // 显示地图容器
    if (mapContainer2) {
      mapContainer2.style.display = 'block';
    }
    
    if (invites.invites && invites.invites.length > 0) {
      invites.invites.forEach(invite => {
        const inviteElement = document.createElement('div');
        inviteElement.className = 'invite-item';
        inviteElement.innerHTML = `
          <h3>${invite.title}</h3>
          <p>${invite.description}</p>
          <div class="invite-meta">
            <p><strong>发起者:</strong> ${invite.creator?.username || '未知'}</p>
            <p><strong>类型:</strong> ${getInviteTypeName(invite.inviteType)}</p>
            <p><strong>位置:</strong> ${invite.location?.name || '未指定'}</p>
            <p><strong>最大人数:</strong> ${invite.maxParticipants}</p>
            <p><strong>状态:</strong> ${invite.status}</p>
          </div>
          <div class="invite-actions">
            <button class="btn btn-primary" onclick="joinInvite(${invite.id})">加入邀约</button>
            <button class="btn btn-outline" onclick="viewInviteDetails(${invite.id}); showInviteOnMap(${invite.id})">在地图上查看</button>
          </div>
        `;
        invitesList.appendChild(inviteElement);
      });
    } else {
      invitesList.innerHTML = '<p>暂无临时邀约</p>';
    }
  } catch (error) {
    console.error('Error loading invites:', error);
    document.getElementById('invitesList').innerHTML = '<p>加载临时邀约失败</p>';
  }
}

// 在地图上显示邀请
async function showInviteOnMap(inviteId) {
  try {
    const response = await apiRequest(`/invites/${inviteId}`);
    const invite = await response.json();
    
    if (inviteMap && inviteMap.loaded) {
      inviteMap.addInviteToMap(invite);
    } else {
      console.log('地图尚未加载完成，将在加载后显示邀请');
      // 等待地图加载后显示
      setTimeout(() => showInviteOnMap(inviteId), 1000);
    }
  } catch (error) {
    console.error('Error showing invite on map:', error);
  }
}

function getInviteTypeName(type) {
  const types = {
    'dining': '用餐',
    'sightseeing': '观光',
    'activity': '活动',
    'other': '其他'
  };
  return types[type] || type;
}

async function createInvite() {
  if (!authToken) {
    alert('请先登录');
    return;
  }
  
  const title = prompt('请输入邀约标题:');
  const description = prompt('请输入邀约描述:');
  const inviteType = prompt('请输入邀约类型 (dining/sightseeing/activity/other):');
  const locationName = prompt('请输入位置名称:');
  const maxParticipants = prompt('请输入最大参与人数:');
  
  if (title && description && inviteType && locationName && maxParticipants) {
    try {
      const response = await apiRequest('/invites', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          inviteType,
          location: {
            name: locationName,
            lat: 0, // Will be set by map integration later
            lng: 0
          },
          maxParticipants: parseInt(maxParticipants),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours
        })
      });
      
      if (response.ok) {
        alert('临时邀约创建成功！');
        loadInvites(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.message || '创建邀约失败');
      }
    } catch (error) {
      console.error('Error creating invite:', error);
      alert('创建邀约时发生错误');
    }
  }
}

async function joinInvite(inviteId) {
  if (!authToken) {
    alert('请先登录');
    return;
  }
  
  try {
    const response = await apiRequest(`/invites/${inviteId}/join`, {
      method: 'POST'
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('已加入邀约！');
      loadInvites(); // Refresh the list
    } else {
      alert(data.message || '加入邀约失败');
    }
  } catch (error) {
    console.error('Error joining invite:', error);
    alert('加入邀约时发生错误');
  }
}

async function viewInviteDetails(inviteId) {
  try {
    const response = await apiRequest(`/invites/${inviteId}`);
    const invite = await response.json();
    
    alert(`
      邀约详情:
      标题: ${invite.title}
      描述: ${invite.description}
      发起者: ${invite.creator?.username || '未知'}
      类型: ${getInviteTypeName(invite.inviteType)}
      位置: ${invite.location?.name || '未指定'}
      最大人数: ${invite.maxParticipants}
      状态: ${invite.status}
      参与人数: ${(invite.participants || []).length}
    `);
  } catch (error) {
    console.error('Error viewing invite details:', error);
    alert('获取邀约详情失败');
  }
}

// Expense functions
async function loadExpenses() {
  if (!authToken) {
    alert('请先登录');
    return;
  }
  
  const tripId = prompt('请输入行程ID以查看相关费用:');
  
  if (tripId) {
    try {
      const response = await apiRequest(`/expenses?tripId=${tripId}`);
      const expenses = await response.json();
      
      const expensesList = document.getElementById('expensesList');
      expensesList.innerHTML = '';
      
      if (expenses && expenses.length > 0) {
        expenses.forEach(expense => {
          const expenseElement = document.createElement('div');
          expenseElement.className = 'expense-item';
          expenseElement.innerHTML = `
            <h3>${expense.title}</h3>
            <div class="expense-meta">
              <p><strong>金额:</strong> ${expense.amount} ${expense.currency}</strong></p>
              <p><strong>创建者:</strong> ${expense.creator?.username || '未知'}</p>
              <p><strong>分摊方式:</strong> ${getSplitTypeName(expense.splitType)}</p>
              <p><strong>创建时间:</strong> ${formatDate(expense.createdAt)}</p>
            </div>
            <div class="expense-splits">
              <h4>分摊详情:</h4>
              ${(expense.splits || []).map(split => 
                `<p>${split.user?.username || '未知'}: ${split.amountOwed} (${split.paid ? '已支付' : '待支付'})</p>`
              ).join('')}
            </div>
            <div class="expense-actions">
              <button class="btn btn-primary" onclick="settleExpense(${expense.id})">标记为已支付</button>
            </div>
          `;
          expensesList.appendChild(expenseElement);
        });
      } else {
        expensesList.innerHTML = '<p>该行程暂无费用记录</p>';
      }
      
      // 添加创建费用按钮
      const createExpenseBtn = document.createElement('button');
      createExpenseBtn.className = 'btn btn-primary';
      createExpenseBtn.textContent = '创建新费用';
      createExpenseBtn.onclick = () => createExpense(tripId);
      expensesList.appendChild(createExpenseBtn);
    } catch (error) {
      console.error('Error loading expenses:', error);
      document.getElementById('expensesList').innerHTML = '<p>加载费用信息失败</p>';
    }
  }
}

async function createExpense(tripId) {
  if (!authToken) {
    alert('请先登录');
    return;
  }
  
  const title = prompt('请输入费用名称:');
  const amount = prompt('请输入金额:');
  const currency = prompt('请输入货币单位 (默认CNY):') || 'CNY';
  const splitType = prompt('请输入分摊方式 (equal/custom/by_usage，默认equal):') || 'equal';
  
  if (title && amount) {
    try {
      const response = await apiRequest('/expenses', {
        method: 'POST',
        body: JSON.stringify({
          tripId: parseInt(tripId),
          title,
          amount: parseFloat(amount),
          currency,
          splitType
        })
      });
      
      if (response.ok) {
        alert('费用创建成功！');
        loadExpenses(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.message || '创建费用失败');
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('创建费用时发生错误');
    }
  }
}

function getSplitTypeName(type) {
  const types = {
    'equal': '平均分摊',
    'custom': '自定义分摊',
    'by_usage': '按使用量分摊'
  };
  return types[type] || type;
}

async function settleExpense(expenseId) {
  if (!authToken) {
    alert('请先登录');
    return;
  }
  
  if (confirm('确定要将此费用标记为已支付吗？')) {
    try {
      const response = await apiRequest(`/expenses/${expenseId}/settle`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('费用状态已更新！');
        loadExpenses(); // Refresh the list
      } else {
        alert(data.message || '更新费用状态失败');
      }
    } catch (error) {
      console.error('Error settling expense:', error);
      alert('更新费用状态时发生错误');
    }
  }
}

// 功能：查找附近的旅行搭子
async function findNearbyTravelBuddies() {
  if (!navigator.geolocation) {
    alert('您的浏览器不支持地理位置服务');
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    
    // 尝试在两个地图上都显示附近的人
    if (tripMap && tripMap.loaded) {
      tripMap.showNearbyTravelBuddies(pos);
    }
    
    if (inviteMap && inviteMap.loaded) {
      inviteMap.showNearbyTravelBuddies(pos);
    }
    
    // 获取当前用户档案用于匹配
    try {
      const response = await apiRequest('/users/profile/me');
      const currentUserProfile = await response.json();
      
      // 获取附近用户并进行MBTI匹配
      const nearbyUsers = await getNearbyUsersWithProfiles(pos);
      const matchedUsers = performMBTIMatching(currentUserProfile, nearbyUsers);
      
      showEnhancedMatchingResults(matchedUsers);
    } catch (error) {
      console.error('获取用户档案失败:', error);
      alert('正在查找附近的旅行搭子...');
    }
  }, (error) => {
    console.error('获取位置失败:', error);
    alert('无法获取您的位置信息，请确保已授权位置访问权限');
  });
}

// Utility functions
function formatDate(dateString) {
  if (!dateString) return '未设置';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
}

// 模拟获取附近用户的档案
async function getNearbyUsersWithProfiles(position) {
  // 这里应该是实际的API调用，返回附近用户的档案
  // 模拟返回几个用户的数据
  return [
    {
      id: 2,
      name: '李明',
      mbtiType: 'ENFJ',
      travelStyle: 'cultural',
      budgetSensitivity: 'medium',
      pacePreference: 'moderate',
      riskTolerance: 'medium',
      soloExperience: 3,
      accommodationPreference: 'hotel',
      activityPreference: 'cultural',
      position: { lat: position.lat + 0.01, lng: position.lng + 0.01 }
    },
    {
      id: 3,
      name: '王小美',
      mbtiType: 'ISFP',
      travelStyle: 'relaxing',
      budgetSensitivity: 'high',
      pacePreference: 'slow',
      riskTolerance: 'low',
      soloExperience: 1,
      accommodationPreference: 'airbnb',
      activityPreference: 'indoor',
      position: { lat: position.lat - 0.02, lng: position.lng - 0.02 }
    },
    {
      id: 4,
      name: '张伟',
      mbtiType: 'ENTP',
      travelStyle: 'adventure',
      budgetSensitivity: 'medium',
      pacePreference: 'fast',
      riskTolerance: 'high',
      soloExperience: 5,
      accommodationPreference: 'hostel',
      activityPreference: 'outdoor',
      position: { lat: position.lat + 0.015, lng: position.lng - 0.015 }
    },
    {
      id: 5,
      name: '陈思思',
      mbtiType: 'ESFJ',
      travelStyle: 'cultural',
      budgetSensitivity: 'medium',
      pacePreference: 'moderate',
      riskTolerance: 'medium',
      soloExperience: 2,
      accommodationPreference: 'mixed',
      activityPreference: 'food',
      position: { lat: position.lat - 0.01, lng: position.lng + 0.02 }
    },
    {
      id: 6,
      name: '刘强',
      mbtiType: 'ISTJ',
      travelStyle: 'budget',
      budgetSensitivity: 'high',
      pacePreference: 'slow',
      riskTolerance: 'low',
      soloExperience: 4,
      accommodationPreference: 'hostel',
      activityPreference: 'outdoor',
      position: { lat: position.lat + 0.02, lng: position.lng - 0.01 }
    }
  ];
}

// 功能：搜索具有相似偏好的用户
async function searchCompatibleUsers() {
  if (!authToken) {
    alert('请先登录');
    return;
  }
  
  try {
    // 获取当前用户的档案
    const response = await apiRequest('/users/profile/me');
    const currentUserProfile = await response.json();
    
    // 获取所有用户档案用于匹配
    const allUsersResponse = await apiRequest('/users/profiles');
    const allUsers = await allUsersResponse.json();
    
    // 过滤掉当前用户自己
    const otherUsers = allUsers.filter(user => user.userId !== currentUserProfile.userId);
    
    // 执行MBTI匹配
    const matchedUsers = performMBTIMatching(currentUserProfile, otherUsers);
    
    // 显示增强版匹配结果
    showEnhancedMatchingResults(matchedUsers);
    
  } catch (error) {
    console.error('搜索兼容用户时出错:', error);
    alert('搜索兼容用户时出现错误');
  }
}

// 功能：根据特定条件筛选用户
function filterUsersByPreferences(users, filters) {
  return users.filter(user => {
    // MBTI类型过滤
    if (filters.mbtiType && user.mbtiType !== filters.mbtiType) {
      return false;
    }
    
    // 旅行风格过滤
    if (filters.travelStyle && user.travelStyle !== filters.travelStyle) {
      return false;
    }
    
    // 预算敏感度过滤
    if (filters.budgetSensitivity && user.budgetSensitivity !== filters.budgetSensitivity) {
      return false;
    }
    
    // 节奏偏好过滤
    if (filters.pacePreference && user.pacePreference !== filters.pacePreference) {
      return false;
    }
    
    // 风险承受能力过滤
    if (filters.riskTolerance && user.riskTolerance !== filters.riskTolerance) {
      return false;
    }
    
    // 经验范围过滤
    if (filters.minExperience !== undefined && user.soloExperience < filters.minExperience) {
      return false;
    }
    
    if (filters.maxExperience !== undefined && user.soloExperience > filters.maxExperience) {
      return false;
    }
    
    return true;
  });
}

// 执行MBTI匹配
function performMBTIMatching(currentUserProfile, nearbyUsers) {
  if (!window.MBTIMatcher) {
    console.error('MBTI匹配器未加载');
    return nearbyUsers.slice(0, 3); // 返回前3个用户作为模拟结果
  }
  
  // 计算每个附近用户与当前用户的匹配度
  const matchedUsers = nearbyUsers.map(user => {
    const matchScore = MBTIMatcher.calculateComprehensiveMatch(currentUserProfile, user);
    const activities = MBTIMatcher.recommendActivities(currentUserProfile, user);
    const destinations = MBTIMatcher.recommendDestinations(user); // 获取目的地推荐
    
    return {
      ...user,
      matchScore,
      activities: activities.slice(0, 3), // 只取前3个推荐活动
      destinations: destinations.slice(0, 3) // 只取前3个推荐目的地
    };
  });
  
  // 按匹配度降序排列
  matchedUsers.sort((a, b) => b.matchScore - a.matchScore);
  
  return matchedUsers;
}

// 显示匹配结果
function showMatchingResults(matchedUsers) {
  if (matchedUsers.length === 0) {
    alert('暂时没有找到匹配的旅行搭子');
    return;
  }
  
  // 创建更详细的匹配结果显示
  let message = '匹配到的旅行搭子:\n\n';
  matchedUsers.forEach((user, index) => {
    message += `${index + 1}. ${user.name} (匹配度: ${user.matchScore}%)\n`;
    message += `   MBTI: ${user.mbtiType || '未填写'}, 风格: ${user.travelStyle}\n`;
    message += `   节奏: ${user.pacePreference}, 预算: ${user.budgetSensitivity}\n`;
    message += `   推荐活动: ${user.activities && user.activities.length > 0 ? user.activities.join(', ') : '无'}\n`;
    message += `   推荐目的地: ${user.destinations && user.destinations.length > 0 ? user.destinations.join(', ') : '无'}\n\n`;
  });
  
  alert(message);
}

// 显示增强版匹配结果（在页面上展示，而不是弹窗）
function showEnhancedMatchingResults(matchedUsers) {
  if (matchedUsers.length === 0) {
    // 显示无结果消息
    const resultsContainer = document.getElementById('matchingResults') || createMatchingResultsContainer();
    resultsContainer.innerHTML = '<p class="no-results">暂时没有找到匹配的旅行搭子</p>';
    return;
  }
  
  // 创建匹配结果HTML
  const resultsHTML = matchedUsers.map((user, index) => {
    // 生成匹配度颜色
    let matchColor = '#ff4757'; // 红色，低匹配度
    if (user.matchScore >= 80) {
      matchColor = '#2ed573'; // 绿色，高匹配度
    } else if (user.matchScore >= 60) {
      matchColor = '#ffa502'; // 橙色，中高匹配度
    } else if (user.matchScore >= 40) {
      matchColor = '#3742fa'; // 蓝色，中等匹配度
    }
    
    return `
      <div class="match-card">
        <div class="match-header">
          <h3>${user.name}</h3>
          <div class="match-score" style="color: ${matchColor}">
            匹配度: ${user.matchScore}%
          </div>
        </div>
        <div class="match-details">
          <div class="detail-item">
            <span class="label">MBTI:</span>
            <span>${user.mbtiType || '未填写'}</span>
          </div>
          <div class="detail-item">
            <span class="label">风格:</span>
            <span>${user.travelStyle}</span>
          </div>
          <div class="detail-item">
            <span class="label">节奏:</span>
            <span>${user.pacePreference}</span>
          </div>
          <div class="detail-item">
            <span class="label">预算:</span>
            <span>${user.budgetSensitivity}</span>
          </div>
          <div class="detail-item">
            <span class="label">经验:</span>
            <span>${user.soloExperience}年</span>
          </div>
        </div>
        <div class="recommendations">
          <div class="activities">
            <h4>推荐活动:</h4>
            <p>${user.activities && user.activities.length > 0 ? user.activities.join(', ') : '无'}</p>
          </div>
          <div class="destinations">
            <h4>推荐目的地:</h4>
            <p>${user.destinations && user.destinations.length > 0 ? user.destinations.join(', ') : '无'}</p>
          </div>
        </div>
        <div class="match-actions">
          <button class="btn btn-primary" onclick="contactBuddy(${user.id})">联系搭子</button>
        </div>
      </div>
    `;
  }).join('');
  
  // 显示结果
  const resultsContainer = document.getElementById('matchingResults') || createMatchingResultsContainer();
  resultsContainer.innerHTML = resultsHTML;
}

// 创建匹配结果容器
function createMatchingResultsContainer() {
  // 如果不存在匹配结果区域，则创建一个
  const container = document.createElement('div');
  container.id = 'matchingResults';
  container.className = 'matching-results';
  
  // 添加样式
  container.style.cssText = `
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  `;
  
  // 插入到页面中适当的位置
  const mainContent = document.querySelector('.main .container');
  if (mainContent) {
    mainContent.appendChild(container);
  }
  
  return container;
}

// Make functions available globally for inline event handlers
window.joinTrip = joinTrip;
window.viewTripDetails = viewTripDetails;
window.joinInvite = joinInvite;
window.viewInviteDetails = viewInviteDetails;
window.settleExpense = settleExpense;
window.showTripOnMap = showTripOnMap;
window.showInviteOnMap = showInviteOnMap;
window.contactBuddy = (buddyId) => {
  alert(`正在联系搭子 ${buddyId}...`);
};