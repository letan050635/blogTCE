import apiClient from './apiClient';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const ADMIN_TOKEN_KEY = 'admin_auth_token';
const ADMIN_USER_KEY = 'admin_auth_user';

export default {
  login(username, password, isAdmin = false) {
    return apiClient.post('/auth/login', { username, password })
      .then(response => {
        const { token, user } = response.data;
        
        if (isAdmin || user.role === 'admin') {
          localStorage.setItem(ADMIN_TOKEN_KEY, token);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
        } else {
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
        
        return user;
      });
  },
  
  register(userData) {
    return apiClient.post('/auth/register', userData)
      .then(response => response.data);
  },
  
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  logoutAdmin() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  },
  
  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  
  isAdminLoggedIn() {
    return !!localStorage.getItem(ADMIN_TOKEN_KEY);
  },
  
  getCurrentUser() {
    try {
      const userJson = localStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  getCurrentAdmin() {
    try {
      const userJson = localStorage.getItem(ADMIN_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error parsing admin data:', error);
      return null;
    }
  },
  
  getUserProfile() {
    return apiClient.get('/auth/me')
      .then(response => {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
        return response.data;
      });
  },
  
  updateUserProfile(userData) {
    return apiClient.put('/auth/profile', userData)
      .then(response => {
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === response.data.user.id) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        }
        return response.data.user;
      });
  },
  
  updateUser(userId, userData) {
    return apiClient.put(`/auth/users/${userId}`, userData)
      .then(response => response.data.user);
  },
  
  changePassword(currentPassword, newPassword) {
    return apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
  },
  
  forgotPassword(email) {
    return apiClient.post('/auth/forgot-password', { email });
  },
  
  getUsers(params = {}) {
    return apiClient.get('/auth/users', { params })
      .then(response => response.data);
  },
  
  getUserById(id) {
    return apiClient.get(`/auth/users/${id}`)
      .then(response => response.data);
  },
  
  deleteUser(id) {
    return apiClient.delete(`/auth/users/${id}`)
      .then(response => response.data);
  }
};