/* eslint-disable no-unused-vars */
// Dữ liệu người dùng mẫu
const sampleUsers = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@tce-ems.com',
      password: 'Admin@123',
      fullName: 'Quản trị viên',
      department: 'Ban quản trị',
      position: 'Quản trị viên',
      phone: '0901234567',
      avatar: null
    },
    {
      id: 2,
      username: 'user',
      email: 'user@tce-ems.com',
      password: 'User@123',
      fullName: 'Người dùng',
      department: 'Phòng kỹ thuật',
      position: 'Nhân viên',
      phone: '0909876543',
      avatar: null
    }
  ];
  
  const TOKEN_KEY = 'auth_token';
  const USER_KEY = 'auth_user';
  
  export default {
    /**
     * Đăng nhập
     * @param {string} username - Tên đăng nhập hoặc email
     * @param {string} password - Mật khẩu
     * @param {boolean} rememberMe - Ghi nhớ đăng nhập
     * @returns {Promise<Object>} - Promise trả về thông tin người dùng
     */
    login(username, password, rememberMe = false) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Tìm người dùng theo tên đăng nhập hoặc email
          const user = sampleUsers.find(u => 
            u.username.toLowerCase() === username.toLowerCase() || 
            u.email.toLowerCase() === username.toLowerCase()
          );
          
          if (!user) {
            reject(new Error('Tên đăng nhập hoặc email không tồn tại'));
            return;
          }
          
          if (user.password !== password) {
            reject(new Error('Mật khẩu không chính xác'));
            return;
          }
          
          // Tạo thông tin người dùng không bao gồm mật khẩu
          const userInfo = {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            department: user.department,
            position: user.position,
            phone: user.phone,
            avatar: user.avatar
          };
          
          // Tạo token giả
          const token = `fake-jwt-token.${user.id}.${Date.now()}`;
          
          // Lưu thông tin xác thực vào localStorage
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
          
          resolve(userInfo);
        }, 500); // Giả lập delay mạng
      });
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
     * Đổi mật khẩu
     * @param {string} currentPassword - Mật khẩu hiện tại
     * @param {string} newPassword - Mật khẩu mới
     * @returns {Promise<boolean>}
     */
    changePassword(currentPassword, newPassword) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const currentUser = this.getCurrentUser();
          
          if (!currentUser) {
            reject(new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'));
            return;
          }
          
          // Tìm người dùng trong danh sách mẫu
          const userIndex = sampleUsers.findIndex(u => u.id === currentUser.id);
          
          if (userIndex === -1) {
            reject(new Error('Không tìm thấy thông tin người dùng.'));
            return;
          }
          
          // Kiểm tra mật khẩu hiện tại
          if (sampleUsers[userIndex].password !== currentPassword) {
            reject(new Error('Mật khẩu hiện tại không chính xác.'));
            return;
          }
          
          // Thực hiện đổi mật khẩu
          sampleUsers[userIndex].password = newPassword;
          
          resolve(true);
        }, 800);
      });
    },
    
    /**
     * Quên mật khẩu
     * @param {string} email - Email người dùng
     * @returns {Promise<boolean>}
     */
    forgotPassword(email) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = sampleUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (!user) {
            reject(new Error('Email không tồn tại trong hệ thống.'));
            return;
          }
          
          // Trong ứng dụng thực tế, tại đây sẽ gửi email đặt lại mật khẩu
          console.log(`Email đặt lại mật khẩu đã được gửi tới ${email}`);
          
          resolve(true);
        }, 800);
      });
    },
    
    /**
     * Lấy thông tin người dùng
     * @returns {Promise<Object>}
     */
    getUserProfile() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const currentUser = this.getCurrentUser();
          
          if (!currentUser) {
            reject(new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'));
            return;
          }
          
          resolve(currentUser);
        }, 500);
      });
    },
    
    /**
     * Cập nhật thông tin người dùng
     * @param {Object} userData - Thông tin cần cập nhật
     * @returns {Promise<Object>}
     */
    updateUserProfile(userData) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const currentUser = this.getCurrentUser();
          
          if (!currentUser) {
            reject(new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'));
            return;
          }
          
          // Tìm người dùng trong danh sách mẫu
          const userIndex = sampleUsers.findIndex(u => u.id === currentUser.id);
          
          if (userIndex === -1) {
            reject(new Error('Không tìm thấy thông tin người dùng.'));
            return;
          }
          
          // Cập nhật thông tin người dùng trong danh sách mẫu
          const updatedUser = {
            ...sampleUsers[userIndex],
            fullName: userData.fullName || sampleUsers[userIndex].fullName,
            department: userData.department || sampleUsers[userIndex].department,
            position: userData.position || sampleUsers[userIndex].position,
            phone: userData.phone || sampleUsers[userIndex].phone
          };
          
          sampleUsers[userIndex] = updatedUser;
          
          // Cập nhật thông tin người dùng trong localStorage
          const userInfo = {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            department: updatedUser.department,
            position: updatedUser.position,
            phone: updatedUser.phone,
            avatar: updatedUser.avatar
          };
          
          localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
          
          resolve(userInfo);
        }, 800);
      });
    }
  };