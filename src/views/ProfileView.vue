<!-- src/views/ProfileView.vue -->
<template>
    <div class="profile-view">
      <div class="profile-container">
        <div class="profile-card">
          <div class="profile-header">
            <h2>Thông tin cá nhân</h2>
          </div>
          
          <div v-if="errorMessage" class="profile-alert error">
            {{ errorMessage }}
          </div>
          
          <div v-if="successMessage" class="profile-alert success">
            {{ successMessage }}
          </div>
          
          <div class="profile-content" v-if="!isLoading">
            <div class="profile-section">
              <div class="profile-section-header">
                <h3>Thông tin tài khoản</h3>
              </div>
              
              <div class="profile-info">
                <div class="info-group">
                  <label>Họ và tên:</label>
                  <div v-if="isEditing">
                    <input 
                      type="text" 
                      v-model="editedUser.fullName" 
                      placeholder="Nhập họ và tên"
                    >
                  </div>
                  <div v-else class="info-value">{{ user.fullName }}</div>
                </div>
                
                <div class="info-group">
                  <label>Email:</label>
                  <div class="info-value">{{ user.email }}</div>
                  <small class="text-muted">(Không thể thay đổi)</small>
                </div>
                
                <div class="info-group">
                  <label>Phòng ban:</label>
                  <div v-if="isEditing">
                    <input 
                      type="text" 
                      v-model="editedUser.department" 
                      placeholder="Nhập phòng ban"
                    >
                  </div>
                  <div v-else class="info-value">{{ user.department || 'Chưa cập nhật' }}</div>
                </div>
                
                <div class="info-group">
                  <label>Chức vụ:</label>
                  <div v-if="isEditing">
                    <input 
                      type="text" 
                      v-model="editedUser.position" 
                      placeholder="Nhập chức vụ"
                    >
                  </div>
                  <div v-else class="info-value">{{ user.position || 'Chưa cập nhật' }}</div>
                </div>
                
                <div class="info-group">
                  <label>Số điện thoại:</label>
                  <div v-if="isEditing">
                    <input 
                      type="text" 
                      v-model="editedUser.phone" 
                      placeholder="Nhập số điện thoại"
                    >
                  </div>
                  <div v-else class="info-value">{{ user.phone || 'Chưa cập nhật' }}</div>
                </div>
              </div>
              
              <div class="profile-actions">
                <button 
                  v-if="!isEditing" 
                  @click="startEditing" 
                  class="edit-button"
                >
                  Chỉnh sửa thông tin
                </button>
                <template v-else>
                  <button 
                    @click="saveChanges" 
                    class="save-button" 
                    :disabled="isSaving"
                  >
                    <span v-if="isSaving">Đang lưu...</span>
                    <span v-else>Lưu thay đổi</span>
                  </button>
                  <button 
                    @click="cancelEditing" 
                    class="cancel-button" 
                    :disabled="isSaving"
                  >
                    Hủy
                  </button>
                </template>
              </div>
            </div>
            
            <div class="profile-section">
              <div class="profile-section-header">
                <h3>Bảo mật</h3>
              </div>
              
              <div class="profile-security">
                <div class="security-item">
                  <div class="security-info">
                    <div class="security-title">Mật khẩu</div>
                    <div class="security-description">
                      Thay đổi mật khẩu đăng nhập của bạn
                    </div>
                  </div>
                  <router-link to="/change-password" class="change-password-link">
                    Đổi mật khẩu
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="loading-container">
            <div class="loading-spinner"></div>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import authService from '@/services/authService';
  
  export default {
    name: 'ProfileView',
    setup() {
      const user = ref({});
      const editedUser = ref({});
      const isLoading = ref(true);
      const isEditing = ref(false);
      const isSaving = ref(false);
      const errorMessage = ref('');
      const successMessage = ref('');
      
      const loadUserProfile = async () => {
        isLoading.value = true;
        errorMessage.value = '';
        
        try {
          const userData = await authService.getUserProfile();
          user.value = userData;
        } catch (error) {
          errorMessage.value = 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.';
          console.error('Error loading user profile:', error);
        } finally {
          isLoading.value = false;
        }
      };
      
      const startEditing = () => {
        // Tạo bản sao của thông tin người dùng để chỉnh sửa
        editedUser.value = { ...user.value };
        isEditing.value = true;
      };
      
      const cancelEditing = () => {
        isEditing.value = false;
        // Reset dữ liệu đã chỉnh sửa
        editedUser.value = {};
      };
      
      const saveChanges = async () => {
        isSaving.value = true;
        errorMessage.value = '';
        successMessage.value = '';
        
        try {
          await authService.updateUserProfile(editedUser.value);
          
          // Cập nhật thông tin người dùng
          user.value = { ...editedUser.value };
          
          successMessage.value = 'Thông tin đã được cập nhật thành công!';
          isEditing.value = false;
          
          // Ẩn thông báo thành công sau 3 giây
          setTimeout(() => {
            successMessage.value = '';
          }, 3000);
        } catch (error) {
          errorMessage.value = 'Không thể cập nhật thông tin. Vui lòng thử lại sau.';
          console.error('Error updating user profile:', error);
        } finally {
          isSaving.value = false;
        }
      };
      
      onMounted(() => {
        loadUserProfile();
      });
      
      return {
        user,
        editedUser,
        isLoading,
        isEditing,
        isSaving,
        errorMessage,
        successMessage,
        startEditing,
        cancelEditing,
        saveChanges
      };
    }
  }
  </script>
  
  <style scoped>
  .profile-view {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 20px;
    background-color: #f5f5f5;
  }
  
  .profile-container {
    width: 100%;
    max-width: 800px;
  }
  
  .profile-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .profile-header {
    padding: 24px;
    background-color: #0066b3;
    color: #fff;
  }
  
  .profile-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
  }
  
  .profile-alert {
    padding: 12px 16px;
    margin: 16px;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .profile-alert.error {
    background-color: #ffebee;
    color: #d32f2f;
    border-left: 4px solid #d32f2f;
  }
  
  .profile-alert.success {
    background-color: #e8f5e9;
    color: #2e7d32;
    border-left: 4px solid #2e7d32;
  }
  
  .profile-content {
    padding: 24px;
  }
  
  .profile-section {
    margin-bottom: 30px;
  }
  
  .profile-section:last-child {
    margin-bottom: 0;
  }
  
  .profile-section-header {
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .profile-section-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
  
  .profile-info {
    margin-bottom: 20px;
  }
  
  .info-group {
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;
  }
  
  .info-group label {
    width: 150px;
    font-weight: 500;
    color: #555;
    flex-shrink: 0;
  }
  
  .info-group .info-value {
    flex: 1;
    min-width: 200px;
  }
  
  .text-muted {
    color: #777;
    font-size: 12px;
    margin-left: 150px;
    margin-top: 5px;
  }
  
  .info-group input {
    width: 100%;
    max-width: 300px;
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border-color 0.2s;
  }
  
  .info-group input:focus {
    outline: none;
    border-color: #0066b3;
    box-shadow: 0 0 0 2px rgba(0, 102, 179, 0.2);
  }
  
  .profile-actions {
    display: flex;
    gap: 10px;
  }
  
  .edit-button,
  .save-button,
  .cancel-button {
    padding: 10px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .edit-button {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
  }
  
  .edit-button:hover {
    background-color: #e0e0e0;
  }
  
  .save-button {
    background-color: #0066b3;
    color: #fff;
    border: none;
  }
  
  .save-button:hover:not(:disabled) {
    background-color: #004e8c;
  }
  
  .save-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .cancel-button {
    background-color: #fff;
    color: #333;
    border: 1px solid #ddd;
  }
  
  .cancel-button:hover:not(:disabled) {
    background-color: #f5f5f5;
  }
  
  .cancel-button:disabled {
    color: #999;
    cursor: not-allowed;
  }
  
  .profile-security {
    background-color: #f9f9f9;
    border-radius: 4px;
    padding: 0 15px;
  }
  
  .security-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
  }
  
  .security-item:last-child {
    border-bottom: none;
  }
  
  .security-title {
    font-weight: 500;
    margin-bottom: 5px;
  }
  
  .security-description {
    font-size: 13px;
    color: #666;
  }
  
  .change-password-link {
    display: inline-block;
    padding: 8px 16px;
    background-color: #0066b3;
    color: #fff;
    border-radius: 4px;
    text-decoration: none;
    font-size: 14px;
    transition: background-color 0.2s;
  }
  
  .change-password-link:hover {
    background-color: #004e8c;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0066b3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading-container p {
    color: #666;
    font-size: 14px;
  }
  
  @media screen and (max-width: 768px) {
    .info-group {
      flex-direction: column;
    }
    
    .info-group label {
      width: 100%;
      margin-bottom: 5px;
    }
    
    .text-muted {
      margin-left: 0;
    }
    
    .info-group .info-value {
      min-width: auto;
    }
    
    .security-item {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .change-password-link {
      margin-top: 10px;
    }
  }
  </style>