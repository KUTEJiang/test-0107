import React, { useState, useEffect } from 'react';
import { FileItem } from '../types/file';
import { fileApi } from '../utils/api';

interface FileListProps {
  onFileDelete?: () => void;
}

const FileList: React.FC<FileListProps> = ({ onFileDelete }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const loadFiles = async (page: number) => {
    try {
      setLoading(true);
      const response = await fileApi.getFileList(page, 10);
      setFiles(response.files);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setError(err.message || '加载文件列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string, originalName: string) => {
    try {
      const blob = await fileApi.downloadFile(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || '下载失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个文件吗？')) {
      try {
        await fileApi.deleteFile(id);
        loadFiles(currentPage); // 重新加载当前页
        if (onFileDelete) {
          onFileDelete();
        }
      } catch (err) {
        setError(err.message || '删除失败');
      }
    }
  };

  useEffect(() => {
    loadFiles(currentPage);
  }, [currentPage]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error">错误: {error}</div>;
  }

  return (
    <div className="file-list-container">
      <h2>文件列表</h2>
      {files.length === 0 ? (
        <p className="no-files">暂无文件</p>
      ) : (
        <div className="file-grid">
          {files.map((file) => (
            <div key={file._id} className="file-item">
              <div className="file-info">
                <div className="file-name">{file.originalName}</div>
                <div className="file-meta">
                  <span className="file-size">{formatFileSize(file.size)}</span>
                  <span className="file-date">{formatDate(file.uploadDate)}</span>
                </div>
              </div>
              <div className="file-actions">
                <button
                  className="btn btn-download"
                  onClick={() => handleDownload(file._id, file.originalName)}
                >
                  下载
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(file._id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn-page ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;