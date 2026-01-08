import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import fileRoutes from './routes/fileRoutes';
import { config } from './config';
import cors from 'cors';
import path from 'path';

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// 路由
app.use('/api', fileRoutes);

// 根路径测试
app.get('/', (req: Request, res: Response) => {
  res.json({ message: '文件上传下载系统 API' });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: () => void) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误', error: err.message });
});

// 连接数据库并启动服务器
const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('连接到MongoDB数据库');

    app.listen(config.port, () => {
      console.log(`服务器运行在端口 ${config.port}`);
    });
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
};

startServer();

export default app;