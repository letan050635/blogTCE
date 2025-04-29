import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

apiClient.interceptors.request.use(
  (config) => {
    // Xác định rõ URLs của admin để sử dụng token admin
    const isAdminRoute = config.url.includes('/api/admin/') || 
                        config.url.includes('/api/notifications') || 
                        config.url.includes('/api/regulations') ||
                        config.url.includes('/api/auth/users');
    
    if (isAdminRoute) {
      const token = localStorage.getItem('admin_auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xác định xem lỗi từ API admin hay user
      const isAdminRoute = error.config.url.includes('/admin/') || 
                         error.config.url.includes('/auth/users');
      
      if (isAdminRoute) {
        localStorage.removeItem('admin_auth_token');
        localStorage.removeItem('admin_auth_user');
        
        if (window.location.pathname.startsWith('/admin') && 
            window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login?redirect=' + window.location.pathname;
        }
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?redirect=' + window.location.pathname;
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;