# 旅行搭子匹配平台

一个专为独立旅行者设计的平台，帮助他们在旅行前、旅行中和旅行后找到合适的旅行伙伴，并提供便捷的费用分摊功能。

## 功能特性

### 游前功能
- 用户可以发布行程计划，招募志同道合的旅行伙伴
- 支持设置行程的有效期和最大参与人数
- 用户可以查看并加入他人的行程

### 游中功能
- 临时发起邀约（用餐、观光、活动等）
- 查找附近可能的旅行搭子
- 在地图上直观显示行程和邀约位置

### 游后功能
- 费用分摊管理
- 支持多种分摊方式（平均、自定义、按使用量）
- 费用结算跟踪

### 用户配置
- 详细用户档案设置
- MBTI性格类型配置
- 旅行偏好配置（J/P人格类型等）
- 旅行风格、节奏、住宿偏好等
- 驾驶能力、预算敏感度、独自出行经验等信息
- 风险承受能力和活动偏好设置

### MBTI匹配系统
- 基于MBTI性格类型的智能匹配
- 多维度匹配算法（性格、风格、预算、节奏等）
- 个性化旅行活动推荐
- 综合匹配度评分

## 技术栈

- **后端**: Node.js + Express.js
- **数据库**: PostgreSQL
- **ORM**: Sequelize
- **前端**: 原生 JavaScript, HTML5, CSS3
- **地图服务**: Google Maps API

## 项目结构

```
src/
├── controllers/         # 控制器逻辑
│   ├── auth.js         # 认证相关
│   ├── expense.js      # 费用分摊
│   ├── invite.js       # 临时邀约
│   ├── trip.js         # 行程管理
│   └── userProfile.js  # 用户档案
├── middleware/          # 中间件
│   └── auth.js         # 认证中间件
├── models/             # 数据模型
│   ├── Expense.js
│   ├── ExpenseSplit.js
│   ├── TemporaryInvite.js
│   ├── TemporaryInviteParticipant.js
│   ├── Trip.js
│   ├── TripParticipant.js
│   ├── User.js
│   ├── UserProfile.js
│   └── index.js        # 模型关联
├── routes/             # 路由定义
├── utils/              # 工具函数
│   └── database.js     # 数据库连接
└── server.js           # 服务器入口
```

## API 接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户资料
- `PUT /api/auth/profile` - 更新用户资料

### 用户
- `GET /api/users/:id` - 获取用户信息
- `PUT /api/users/:id` - 更新用户信息
- `GET /api/users/profile/me` - 获取当前用户资料
- `PUT /api/users/profile/me` - 更新当前用户资料

### 行程
- `POST /api/trips` - 创建行程
- `GET /api/trips` - 获取行程列表
- `GET /api/trips/:id` - 获取特定行程
- `PUT /api/trips/:id` - 更新行程
- `DELETE /api/trips/:id` - 删除行程
- `POST /api/trips/:id/join` - 加入行程
- `POST /api/trips/:id/leave` - 退出行程

### 临时邀约
- `POST /api/invites` - 创建邀约
- `GET /api/invites` - 获取邀约列表
- `GET /api/invites/:id` - 获取特定邀约
- `POST /api/invites/:id/join` - 加入邀约
- `POST /api/invites/:id/leave` - 退出邀约

### 费用分摊
- `POST /api/expenses` - 创建费用
- `GET /api/expenses` - 获取费用列表
- `POST /api/expenses/split` - 重新计算分摊
- `POST /api/expenses/:id/settle` - 标记费用为已支付

## 安装和运行

1. 安装依赖:
```bash
npm install
```

2. 配置环境变量:
```bash
cp .env.example .env
# 编辑 .env 文件配置数据库和其他参数
```

3. 启动服务器:
```bash
npm start
# 或开发模式
npm run dev
```

## 环境变量

- `DB_HOST`: 数据库主机地址
- `DB_PORT`: 数据库端口
- `DB_NAME`: 数据库名称
- `DB_USER`: 数据库用户名
- `DB_PASSWORD`: 数据库密码
- `JWT_SECRET`: JWT密钥
- `JWT_EXPIRE`: JWT过期时间
- `PORT`: 服务器端口
- `MAP_API_KEY`: 地图API密钥

## 前端功能

前端采用原生JavaScript开发，包含以下功能模块：
- 用户认证界面
- 行程管理界面
- 临时邀约界面
- 费用分摊界面
- 个人档案配置
- 地图展示功能

## 数据库模型

### 用户表 (users)
存储用户基本信息

### 用户档案表 (user_profiles)
存储用户的旅行偏好和能力信息

### 行程表 (trips)
存储行程信息

### 行程参与者表 (trip_participants)
存储行程参与关系

### 临时邀约表 (temporary_invites)
存储临时邀约信息

### 临时邀约参与者表 (temporary_invite_participants)
存储临时邀约参与关系

### 费用表 (expenses)
存储费用信息

### 费用分摊表 (expense_splits)
存储费用分摊详情

## 扩展建议

1. 集成实时聊天功能
2. 添加行程推荐算法
3. 实现多语言支持
4. 添加移动端响应式设计
5. 集成第三方支付接口
6. 增加社交功能（点赞、评论等）