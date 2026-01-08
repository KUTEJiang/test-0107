import { Router } from 'express';
import { uploadFile, getFileList, downloadFile, deleteFile, getFileById } from '../controllers/fileController';
import { upload } from '../middleware/upload';

const router = Router();

// 上传文件
router.post('/upload', upload.single('file'), uploadFile);

// 获取文件列表
router.get('/files', getFileList);

// 获取单个文件信息
router.get('/files/:id', getFileById);

// 下载文件
router.get('/download/:id', downloadFile);

// 删除文件
router.delete('/files/:id', deleteFile);

export default router;