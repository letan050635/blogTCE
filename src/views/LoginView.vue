<!-- src/views/LoginView.vue -->
<template>
    <div class="login-view">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Đăng nhập</h2>
            <p>Vui lòng đăng nhập để tiếp tục</p>
          </div>
          
          <div v-if="errorMessage" class="auth-alert error">
            {{ errorMessage }}
          </div>
          
          <form @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group">
              <label for="username">Tên đăng nhập</label>
              <input 
                type="text" 
                id="username" 
                v-model="username" 
                placeholder="Nhập tên đăng nhập hoặc email"
                required
                :disabled="isLoading"
              >
            </div>
            
            <div class="form-group">
              <label for="password">Mật khẩu</label>
              <div class="password-input-container">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="password" 
                  placeholder="Nhập mật khẩu"
                  required
                  :disabled="isLoading"
                >
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="toggleShowPassword"
                  :disabled="isLoading"
                >
                  {{ showPassword ? 'Ẩn' : 'Hiện' }}
                </button>
              </div>
            </div>
            
            <div class="form-checkbox">
              <label>
                <input type="checkbox" v-model="rememberMe" :disabled="isLoading">
                <span>Ghi nhớ đăng nhập</span>
              </label>
            </div>
            
            <button 
              type="submit" 
              class="login-button" 
              :disabled="isLoading || !username || !password"
            >
              <span v-if="isLoading">Đang đăng nhập...</span>
              <span v-else>Đăng nhập</span>
            </button>
          </form>
          
          <div class="auth-footer">
            <router-link to="/forgot-password" class="forgot-password-link">
              Quên mật khẩu?
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import authService from '@/services/authService';
  
  export default {
    name: 'LoginView',
    data() {
      return {
        username: '',
        password: '',
        rememberMe: false,
        showPassword: false,
        isLoading: false,
        errorMessage: ''
      };
    },
    methods: {
      toggleShowPassword() {
        this.showPassword = !this.showPassword;
      },
      
      async handleLogin() {
        if (!this.username || !this.password) return;
        
        this.isLoading = true;
        this.errorMessage = '';
        
        try {
          await authService.login(this.username, this.password, this.rememberMe);
          
          // Chuyển hướng đến trang chủ hoặc trang được chuyển hướng trước đó
          const redirectPath = this.$route.query.redirect || '/';
          
          // Sử dụng window.location để tải lại trang thay vì router.push
          window.location.href = redirectPath;
        } catch (error) {
          this.errorMessage = error.message || 'Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập.';
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .login-view {
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
  
  .form-checkbox {
    margin-bottom: 20px;
  }
  
  .form-checkbox label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .form-checkbox input {
    margin-right: 8px;
  }
  
  .form-checkbox span {
    font-size: 14px;
    color: #555;
  }
  
  .login-button {
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
  
  .login-button:hover:not(:disabled) {
    background-color: #004e8c;
  }
  
  .login-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .auth-footer {
    padding: 16px 24px 24px;
    text-align: center;
    border-top: 1px solid #eee;
  }
  
  .forgot-password-link {
    color: #0066b3;
    font-size: 14px;
    text-decoration: none;
  }
  
  .forgot-password-link:hover {
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