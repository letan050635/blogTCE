<!-- src/views/ChangePasswordView.vue -->
<template>
    <div class="change-password-view">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Đổi mật khẩu</h2>
            <p>Vui lòng nhập mật khẩu mới của bạn</p>
          </div>
          
          <div v-if="errorMessage" class="auth-alert error">
            {{ errorMessage }}
          </div>
          
          <div v-if="successMessage" class="auth-alert success">
            {{ successMessage }}
          </div>
          
          <form @submit.prevent="handleChangePassword" class="auth-form">
            <div class="form-group">
              <label for="currentPassword">Mật khẩu hiện tại</label>
              <div class="password-input-container">
                <input 
                  :type="showCurrentPassword ? 'text' : 'password'" 
                  id="currentPassword" 
                  v-model="currentPassword" 
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                  :disabled="isLoading"
                >
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="toggleShowCurrentPassword"
                  :disabled="isLoading"
                >
                  {{ showCurrentPassword ? 'Ẩn' : 'Hiện' }}
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="newPassword">Mật khẩu mới</label>
              <div class="password-input-container">
                <input 
                  :type="showNewPassword ? 'text' : 'password'" 
                  id="newPassword" 
                  v-model="newPassword" 
                  placeholder="Nhập mật khẩu mới"
                  required
                  @input="validateNewPassword"
                  :disabled="isLoading"
                >
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="toggleShowNewPassword"
                  :disabled="isLoading"
                >
                  {{ showNewPassword ? 'Ẩn' : 'Hiện' }}
                </button>
              </div>
              <div class="password-strength" v-if="newPassword">
                <div class="password-requirements">
                  <div 
                    class="requirement" 
                    :class="{ 'is-valid': passwordRequirements.minLength }"
                  >
                    Tối thiểu 8 ký tự
                  </div>
                  <div 
                    class="requirement" 
                    :class="{ 'is-valid': passwordRequirements.hasNumber }"
                  >
                    Có ít nhất 1 số
                  </div>
                  <div 
                    class="requirement" 
                    :class="{ 'is-valid': passwordRequirements.hasUppercase }"
                  >
                    Có ít nhất 1 chữ hoa
                  </div>
                  <div 
                    class="requirement" 
                    :class="{ 'is-valid': passwordRequirements.hasSpecialChar }"
                  >
                    Có ít nhất 1 ký tự đặc biệt
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Xác nhận mật khẩu mới</label>
              <div class="password-input-container">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  v-model="confirmPassword" 
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  :disabled="isLoading"
                >
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="toggleShowConfirmPassword"
                  :disabled="isLoading"
                >
                  {{ showConfirmPassword ? 'Ẩn' : 'Hiện' }}
                </button>
              </div>
              <div class="confirm-error" v-if="confirmPassword && confirmPassword !== newPassword">
                Mật khẩu xác nhận không khớp
              </div>
            </div>
            
            <button 
              type="submit" 
              class="submit-button" 
              :disabled="isLoading || !isFormValid"
            >
              <span v-if="isLoading">Đang xử lý...</span>
              <span v-else>Đổi mật khẩu</span>
            </button>
          </form>
          
          <div class="auth-footer">
            <router-link to="/" class="back-link">
              Quay lại trang chủ
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import authService from '@/services/authService';
  
  export default {
    name: 'ChangePasswordView',
    setup() {
      const router = useRouter();
      
      const currentPassword = ref('');
      const newPassword = ref('');
      const confirmPassword = ref('');
      
      const showCurrentPassword = ref(false);
      const showNewPassword = ref(false);
      const showConfirmPassword = ref(false);
      
      const isLoading = ref(false);
      const errorMessage = ref('');
      const successMessage = ref('');
      
      const passwordRequirements = ref({
        minLength: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false
      });
      
      const validateNewPassword = () => {
        const password = newPassword.value;
        
        passwordRequirements.value = {
          minLength: password.length >= 8,
          hasUppercase: /[A-Z]/.test(password),
          hasNumber: /[0-9]/.test(password),
          hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
        };
      };
      
      const isFormValid = computed(() => {
        return (
          currentPassword.value && 
          newPassword.value && 
          confirmPassword.value && 
          newPassword.value === confirmPassword.value &&
          passwordRequirements.value.minLength &&
          passwordRequirements.value.hasUppercase &&
          passwordRequirements.value.hasNumber &&
          passwordRequirements.value.hasSpecialChar
        );
      });
      
      const toggleShowCurrentPassword = () => {
        showCurrentPassword.value = !showCurrentPassword.value;
      };
      
      const toggleShowNewPassword = () => {
        showNewPassword.value = !showNewPassword.value;
      };
      
      const toggleShowConfirmPassword = () => {
        showConfirmPassword.value = !showConfirmPassword.value;
      };
      
      const handleChangePassword = async () => {
        if (!isFormValid.value) return;
        
        isLoading.value = true;
        errorMessage.value = '';
        successMessage.value = '';
        
        try {
          await authService.changePassword(currentPassword.value, newPassword.value);
          
          successMessage.value = 'Mật khẩu đã được thay đổi thành công!';
          
          // Reset form
          currentPassword.value = '';
          newPassword.value = '';
          confirmPassword.value = '';
          
          // Redirect sau một khoảng thời gian
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } catch (error) {
          errorMessage.value = error.message || 'Đổi mật khẩu không thành công. Vui lòng thử lại.';
        } finally {
          isLoading.value = false;
        }
      };
      
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        showCurrentPassword,
        showNewPassword,
        showConfirmPassword,
        isLoading,
        errorMessage,
        successMessage,
        passwordRequirements,
        isFormValid,
        validateNewPassword,
        toggleShowCurrentPassword,
        toggleShowNewPassword,
        toggleShowConfirmPassword,
        handleChangePassword
      };
    }
  }
  </script>
  
  <style scoped>
  .change-password-view {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background-color: #f5f5f5;
  }
  
  .auth-container {
    width: 100%;
    max-width: 400px;
  }
  
  .auth-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .auth-header {
    padding: 24px;
    text-align: center;
    background-color: #0066b3;
    color: #fff;
  }
  
  .auth-header h2 {
    margin: 0 0 8px;
    font-size: 24px;
    font-weight: 500;
  }
  
  .auth-header p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
  
  .auth-alert {
    padding: 12px 16px;
    margin: 16px;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .auth-alert.error {
    background-color: #ffebee;
    color: #d32f2f;
    border-left: 4px solid #d32f2f;
  }
  
  .auth-alert.success {
    background-color: #e8f5e9;
    color: #2e7d32;
    border-left: 4px solid #2e7d32;
  }
  
  .auth-form {
    padding: 24px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #555;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border-color 0.2s;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #0066b3;
    box-shadow: 0 0 0 2px rgba(0, 102, 179, 0.2);
  }
  
  .form-group input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
  
  .password-input-container {
    display: flex;
    position: relative;
  }
  
  .password-input-container input {
    flex: 1;
    padding-right: 60px;
  }
  
  .toggle-password {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 0 12px;
    background: none;
    border: none;
    color: #0066b3;
    font-size: 14px;
    cursor: pointer;
  }
  
  .toggle-password:disabled {
    color: #999;
    cursor: not-allowed;
  }
  
  .password-strength {
    margin-top: 10px;
  }
  
  .password-requirements {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }
  
  .requirement {
    font-size: 12px;
    color: #777;
    background-color: #f5f5f5;
    padding: 4px 8px;
    border-radius: 4px;
    border-left: 3px solid #ddd;
  }
  
  .requirement.is-valid {
    color: #2e7d32;
    background-color: #e8f5e9;
    border-left-color: #2e7d32;
  }
  
  .confirm-error {
    margin-top: 5px;
    color: #d32f2f;
    font-size: 12px;
  }
  
  .submit-button {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: #0066b3;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .submit-button:hover:not(:disabled) {
    background-color: #004e8c;
  }
  
  .submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .auth-footer {
    padding: 16px 24px 24px;
    text-align: center;
    border-top: 1px solid #eee;
  }
  
  .back-link {
    color: #0066b3;
    font-size: 14px;
    text-decoration: none;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
  
  @media screen and (max-width: 480px) {
    .auth-card {
      box-shadow: none;
    }
    
    .auth-form {
      padding: 16px;
    }
    
    .password-requirements {
      flex-direction: column;
      gap: 4px;
    }
  }
  </style>