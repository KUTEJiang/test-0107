# Travel Buddy - 旅行搭子匹配平台

这是一个专为独自旅行者设计的平台，帮助他们在旅行前、旅行中和旅行后找到合适的旅伴。

## 功能特性

### 游前计划
- 用户可以发布行程，招募志同道合的旅伴一起出游
- 邀约设有有效期，其他用户可以加入行程

### 游中搭子
- 用户可临时发布招募伙伴一起吃饭或游览景点的单点式邀约
- 邀约设有有效期，便于实时匹配

### 游后结算
- 参与者可以对旅行中共同产生的费用进行分单
- 明确互相转账金额，简化结算流程

### 用户档案
- 用户注册时填写旅游倾向和个人能力信息
- 包括MBTI性格类型(J/P)、驾驶能力、价格敏感度、独自出行经验等

### 地图集成
- 在游前和游中通过地图显示具体的行程或点位

## 技术栈

### 后端
- Node.js
- Express.js
- MongoDB/Mongoose

### 前端
- React
- React Router
- React Leaflet (地图功能)

## 项目结构

```
travel-buddy/
├── backend/
│   ├── models/           # 数据模型
│   ├── routes/           # API路由
│   ├── middleware/       # 中间件
│   └── server.js         # 服务器入口
└── frontend/
    ├── public/           # 公共资源
    ├── src/
    │   ├── components/   # 可复用组件
    │   ├── pages/        # 页面组件
    │   ├── contexts/     # React Context
    │   ├── utils/        # 工具函数
    │   ├── App.js        # 主应用组件
    │   └── index.js      # 应用入口
    └── package.json
```

## 安装和运行

### 后端设置
```bash
cd travel-buddy/backend
npm install
npm run dev
```

### 前端设置
```bash
cd travel-buddy/frontend
npm install
npm start
```

## API 端点

### 用户相关
- `POST /api/users` - 注册新用户
- `GET /api/users/:id` - 获取用户信息

### 行程相关
- `POST /api/trips` - 创建新行程
- `GET /api/trips` - 获取所有行程
- `GET /api/trips/:id` - 获取特定行程
- `PUT /api/trips/:id/join` - 加入行程

### 搭子请求相关
- `POST /api/buddies` - 创建搭子请求
- `GET /api/buddies` - 获取所有搭子请求
- `GET /api/buddies/:id` - 获取特定搭子请求
- `PUT /api/buddies/:id/join` - 加入搭子请求

### 费用相关
- `POST /api/expenses` - 创建费用记录
- `GET /api/expenses` - 获取费用记录
- `GET /api/expenses/:id` - 获取特定费用记录
- `PUT /api/expenses/:id/settle` - 标记费用为已结算

## 数据模型

### User (用户)
- name: 用户名
- email: 邮箱
- password: 密码
- travelPreferences: 旅行偏好对象
  - personalityType: 性格类型 (J/P)
  - canDrive: 是否会开车
  - priceSensitivity: 价格敏感度 (budget/mid-range/luxury)
  - soloExperience: 独自出行经验 (beginner/intermediate/experienced)
  - countriesVisited: 去过的国家列表
  - interests: 兴趣爱好
  - about: 关于自己

### Trip (行程)
- title: 行程标题
- description: 行程描述
- startDate: 开始日期
- endDate: 结束日期
- destination: 目的地
- location: 地理位置坐标
- creator: 创建者ID
- participants: 参与者列表
- maxParticipants: 最大参与者数
- status: 状态 (active/full/completed/cancelled)
- itinerary: 行程安排
- createdAt: 创建时间
- expiresAt: 截止时间

### BuddyRequest (搭子请求)
- title: 请求标题
- description: 请求描述
- activityType: 活动类型 (meal/sightseeing/activity/other)
- location: 位置信息
- creator: 创建者ID
- participants: 参与者列表
- maxParticipants: 最大参与者数
- startTime: 开始时间
- endTime: 结束时间
- status: 状态
- createdAt: 创建时间
- expiresAt: 截止时间

### Expense (费用)
- title: 费用标题
- description: 费用描述
- amount: 金额
- paidBy: 支付者ID
- participants: 参与者及分摊金额
- trip: 所属行程ID
- category: 类别 (food/accommodation/transportation/activity/other)
- date: 日期
- status: 状态 (pending/settled)
- createdAt: 创建时间