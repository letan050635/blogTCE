import axios from 'axios';

// Tạo instance của axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Thêm interceptor để tự động đính kèm token trong header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý các lỗi response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Nếu lỗi 401 Unauthorized, đăng xuất và chuyển hướng về trang đăng nhập
    if (error.response && error.response.status === 401) {
      // Xóa thông tin xác thực khỏi localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Nếu không phải trang đăng nhập, chuyển hướng
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?redirect=' + window.location.pathname;
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;