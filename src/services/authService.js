import apiClient from './apiClient';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export default {
  /**
   * Đăng nhập
   * @param {string} username - Tên đăng nhập hoặc email
   * @param {string} password - Mật khẩu
   * @returns {Promise<Object>} - Promise trả về thông tin người dùng
   */
  login(username, password) {
    return apiClient.post('/auth/login', { username, password })
      .then(response => {
        const { token, user } = response.data;
        
        // Lưu thông tin xác thực vào localStorage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        
        return user;
      });
  },
  
  /**
   * Đăng ký tài khoản mới
   * @param {Object} userData - Thông tin đăng ký
   * @returns {Promise<Object>} - Promise trả về thông tin người dùng
   */
  register(userData) {
    return apiClient.post('/auth/register', userData)
      .then(response => response.data);
  },
  
  /**
   * Đăng xuất
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  /**
   * Kiểm tra đã đăng nhập chưa
   * @returns {boolean}
   */
  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  
  /**
   * Lấy thông tin người dùng hiện tại
   * @returns {Object|null}
   */
  getCurrentUser() {
    try {
      const userJson = localStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  /**
   * Lấy thông tin người dùng từ server
   * @returns {Promise<Object>}
   */
  getUserProfile() {
    return apiClient.get('/auth/me')
      .then(response => {
        // Cập nhật thông tin người dùng trong localStorage
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
        return response.data;
      });
  },
  
  /**
   * Cập nhật thông tin người dùng
   * @param {Object} userData - Thông tin cần cập nhật
   * @returns {Promise<Object>}
   */
  updateUserProfile(userData) {
    return apiClient.put('/auth/profile', userData)
      .then(response => {
        // Cập nhật thông tin người dùng trong localStorage nếu là người dùng hiện tại
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === response.data.user.id) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        }
        return response.data.user;
      });
  },
  
  /**
   * Cập nhật thông tin người dùng bởi admin
   * @param {number} userId - ID người dùng
   * @param {Object} userData - Thông tin cần cập nhật
   * @returns {Promise<Object>}
   */
  updateUser(userId, userData) {
    return apiClient.put(`/auth/users/${userId}`, userData)
      .then(response => response.data.user);
  },
  
  /**
   * Đổi mật khẩu
   * @param {string} currentPassword - Mật khẩu hiện tại
   * @param {string} newPassword - Mật khẩu mới
   * @returns {Promise<Object>}
   */
  changePassword(currentPassword, newPassword) {
    return apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
  },
  
  /**
   * Quên mật khẩu
   * @param {string} email - Email người dùng
   * @returns {Promise<Object>}
   */
  forgotPassword(email) {
    return apiClient.post('/auth/forgot-password', { email });
  },
  
  /**
   * Lấy danh sách người dùng (chỉ admin)
   * @param {Object} params - Tham số lọc và phân trang
   * @returns {Promise<Object>}
   */
  getUsers(params = {}) {
    return apiClient.get('/auth/users', { params })
      .then(response => response.data);
  },
  
  /**
   * Lấy thông tin chi tiết người dùng (chỉ admin)
   * @param {number} id - ID người dùng
   * @returns {Promise<Object>}
   */
  getUserById(id) {
    return apiClient.get(`/auth/users/${id}`)
      .then(response => response.data);
  },
  
  /**
   * Xóa người dùng (chỉ admin)
   * @param {number} id - ID người dùng
   * @returns {Promise<Object>}
   */
  deleteUser(id) {
    return apiClient.delete(`/auth/users/${id}`)
      .then(response => response.data);
  }
};