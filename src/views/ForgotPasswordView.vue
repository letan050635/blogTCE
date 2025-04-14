<!-- src/views/ForgotPasswordView.vue -->
<template>
    <div class="forgot-password-view">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Quên mật khẩu</h2>
            <p>Vui lòng nhập email để khôi phục mật khẩu</p>
          </div>
          
          <div v-if="errorMessage" class="auth-alert error">
            {{ errorMessage }}
          </div>
          
          <div v-if="successMessage" class="auth-alert success">
            {{ successMessage }}
          </div>
          
          <form v-if="!resetSent" @submit.prevent="handleForgotPassword" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                placeholder="Nhập email của bạn"
                required
                :disabled="isLoading"
              >
            </div>
            
            <button 
              type="submit" 
              class="submit-button" 
              :disabled="isLoading || !email"
            >
              <span v-if="isLoading">Đang xử lý...</span>
              <span v-else>Gửi yêu cầu</span>
            </button>
          </form>
          
          <div v-else class="reset-sent-message">
            <div class="check-icon">✓</div>
            <p>Một email khôi phục mật khẩu đã được gửi đến {{ email }}.</p>
            <p>Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn.</p>
          </div>
          
          <div class="auth-footer">
            <div class="auth-links">
              <router-link to="/login" class="back-link">
                Quay lại đăng nhập
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import authService from '@/services/authService';
  
  export default {
    name: 'ForgotPasswordView',
    setup() {
      const email = ref('');
      const isLoading = ref(false);
      const errorMessage = ref('');
      const successMessage = ref('');
      const resetSent = ref(false);
      
      const handleForgotPassword = async () => {
        if (!email.value) return;
        
        isLoading.value = true;
        errorMessage.value = '';
        successMessage.value = '';
        
        try {
          await authService.forgotPassword(email.value);
          
          // Hiển thị thông báo thành công
          successMessage.value = 'Yêu cầu đặt lại mật khẩu đã được gửi thành công!';
          resetSent.value = true;
        } catch (error) {
          errorMessage.value = error.message || 'Không thể gửi yêu cầu. Vui lòng thử lại sau.';
        } finally {
          isLoading.value = false;
        }
      };
      
      return {
        email,
        isLoading,
        errorMessage,
        successMessage,
        resetSent,
        handleForgotPassword
      };
    }
  }
  </script>
  
  <style scoped>
  .forgot-password-view {
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
  
  .reset-sent-message {
    padding: 24px;
    text-align: center;
  }
  
  .check-icon {
    width: 60px;
    height: 60px;
    background-color: #2e7d32;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    margin: 0 auto 20px;
  }
  
  .reset-sent-message p {
    margin: 10px 0;
    color: #555;
    line-height: 1.5;
  }
  
  .auth-footer {
    padding: 16px 24px 24px;
    text-align: center;
    border-top: 1px solid #eee;
  }
  
  .auth-links {
    display: flex;
    justify-content: center;
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
  }
  </style>