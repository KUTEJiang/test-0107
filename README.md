# 文件上传下载系统

这是一个完整的文件上传下载系统，包含前后端功能，支持文件上传、下载、列表展示和管理功能。

## 功能特性

- 文件上传（支持拖拽上传）
- 文件下载
- 文件列表展示（带分页）
- 文件删除
- 文件类型和大小限制
- 上传进度显示
- 响应式设计

## 技术栈

- 后端：Node.js, Express, MongoDB, TypeScript
- 前端：React, TypeScript
- 构建工具：Webpack

## 安装和运行

### 前提条件

- Node.js (v14或更高版本)
- MongoDB

### 安装步骤

1. 安装依赖：
```bash
npm install
```

2. 启动MongoDB服务

3. 创建上传目录：
```bash
mkdir uploads
```

### 运行方式

#### 开发模式

启动后端服务：
```bash
npm run dev
```

启动前端开发服务器：
```bash
npm run dev:frontend
```

#### 生产模式

编译TypeScript：
```bash
npm run build
```

启动服务：
```bash
npm start
```

## API 接口

- `POST /api/upload` - 上传文件
- `GET /api/files` - 获取文件列表
- `GET /api/files/:id` - 获取单个文件信息
- `GET /api/download/:id` - 下载文件
- `DELETE /api/files/:id` - 删除文件

## 安全特性

- 文件类型验证
- 文件大小限制
- 防止路径遍历攻击
- 文件内容哈希去重

## 配置

系统配置在 `backend/src/config/index.ts` 中，可以修改：

- 上传目录
- 最大文件大小
- 允许的MIME类型
- 端口号
- 数据库连接字符串

## 前端功能

- 拖拽上传界面
- 上传进度显示
- 文件列表展示
- 分页浏览
- 下载和删除功能