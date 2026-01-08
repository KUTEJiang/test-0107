import { Request, Response } from 'express';
import { File } from '../models/File';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config';

// 上传文件
export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '没有上传文件' });
    }

    // 计算文件哈希值
    const fileBuffer = fs.readFileSync(req.file.path);
    const hash = crypto.createHash('md5').update(fileBuffer).digest('hex');

    // 检查是否已存在相同文件
    const existingFile = await File.findOne({ hash });
    if (existingFile) {
      // 删除重复上传的文件
      fs.unlinkSync(req.file.path);
      return res.status(409).json({ 
        message: '文件已存在', 
        file: existingFile 
      });
    }

    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploader: req.body.userId, // 假设有用户认证
      hash
    });

    await newFile.save();
    
    res.status(201).json({
      message: '文件上传成功',
      file: newFile
    });
  } catch (error) {
    console.error('上传文件错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取文件列表
export const getFileList = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const files = await File.find()
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await File.countDocuments();

    res.json({
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取文件列表错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 下载文件
export const downloadFile = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: '文件未找到' });
    }

    const filePath = path.join(process.cwd(), file.path);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: '文件不存在' });
    }

    // 设置响应头
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Length', file.size);

    // 创建文件流
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // 记录下载次数（可选）
    // await File.findByIdAndUpdate(fileId, { $inc: { downloadCount: 1 } });
  } catch (error) {
    console.error('下载文件错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 删除文件
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: '文件未找到' });
    }

    // 删除物理文件
    const filePath = path.join(process.cwd(), file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 从数据库删除记录
    await File.findByIdAndDelete(fileId);

    res.json({ message: '文件删除成功' });
  } catch (error) {
    console.error('删除文件错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取文件信息
export const getFileById = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId).select('-__v');

    if (!file) {
      return res.status(404).json({ message: '文件未找到' });
    }

    res.json(file);
  } catch (error) {
    console.error('获取文件信息错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};