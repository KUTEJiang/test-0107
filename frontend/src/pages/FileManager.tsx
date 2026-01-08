import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

const FileManager: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // 触发刷新，重新加载文件列表
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFileDelete = () => {
    // 触发刷新，重新加载文件列表
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="file-manager">
      <header className="file-manager-header">
        <h1>文件上传下载系统</h1>
      </header>

      <main className="file-manager-main">
        <section className="upload-section">
          <h2>上传文件</h2>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </section>

        <section className="file-list-section">
          <FileList key={refreshTrigger} onFileDelete={handleFileDelete} />
        </section>
      </main>

      <footer className="file-manager-footer">
        <p>&copy; 2026 文件上传下载系统</p>
      </footer>
    </div>
  );
};

export default FileManager;