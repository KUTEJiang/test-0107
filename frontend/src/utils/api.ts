const API_BASE_URL = '/api';

export const fileApi = {
  // 上传文件
  uploadFile: async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded * 100) / event.total);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`上传失败: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('网络错误'));
      });

      xhr.open('POST', `${API_BASE_URL}/upload`);
      xhr.send(formData);
    });
  },

  // 获取文件列表
  getFileList: async (page: number = 1, limit: number = 10) => {
    const response = await fetch(`${API_BASE_URL}/files?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('获取文件列表失败');
    }
    return response.json();
  },

  // 下载文件
  downloadFile: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/download/${id}`);
    if (!response.ok) {
      throw new Error('下载失败');
    }
    return response.blob();
  },

  // 删除文件
  deleteFile: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/files/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('删除失败');
    }
    return response.json();
  },

  // 获取单个文件信息
  getFileById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/files/${id}`);
    if (!response.ok) {
      throw new Error('获取文件信息失败');
    }
    return response.json();
  }
};