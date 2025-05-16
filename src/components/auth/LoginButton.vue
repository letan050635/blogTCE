<template>
  <div class="login-button-container">
    <div v-if="!isLoggedIn" class="login-actions">
      <router-link to="/login" class="login-link">Đăng nhập</router-link>
    </div>
    
    <div v-else class="user-info-dropdown">
      <div class="user-info" @click="toggleDropdown">
        <span class="user-name">{{ user.fullName }}</span>
        <span class="dropdown-arrow">▼</span>
      </div>
      
      <div v-if="showDropdown" class="dropdown-menu">
        <div class="dropdown-header">
          <span class="user-email">{{ user.email }}</span>
        </div>
        <div class="dropdown-divider"></div>
        <router-link to="/profile" class="dropdown-item">Thông tin cá nhân</router-link>
        <router-link to="/change-password" class="dropdown-item">Đổi mật khẩu</router-link>
        <div class="dropdown-divider"></div>
        <button @click="logout" class="dropdown-item logout-button">Đăng xuất</button>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '@/services/authService';

export default {
  name: 'LoginButton',
  data() {
    return {
      isLoggedIn: false,
      user: {},
      showDropdown: false,
      checkInterval: null
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    
    handleClickOutside(event) {
      const dropdown = document.querySelector('.user-info-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        this.showDropdown = false;
      }
    },
    
    logout() {
      authService.logout();
      window.location.href = '/';
    },
    
    checkLoginStatus() {
      // eslint-disable-next-line no-unused-vars
      const wasLoggedIn = this.isLoggedIn;
      this.isLoggedIn = authService.isLoggedIn();
      
      if (this.isLoggedIn) {
        this.user = authService.getCurrentUser() || {};
      } else {
        this.user = {};
      }
    }
  },
  created() {
    this.checkLoginStatus();
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    
    this.checkInterval = setInterval(() => {
      this.checkLoginStatus();
    }, 2000);
    
    window.addEventListener('load', this.checkLoginStatus);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('load', this.checkLoginStatus);
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  },
  watch: {
    $route() {
      this.checkLoginStatus();
    }
  }
}
</script>

<style scoped>
.login-button-container {
  position: relative;
}

.login-actions {
  display: flex;
  align-items: center;
}

.login-link {
  background-color: #FF7F00;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.login-link:hover {
  background-color: #ff6b00;
}

.user-info-dropdown {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: #f1f1f1;
}

.user-name {
  font-weight: 500;
  margin-right: 5px;
}

.dropdown-arrow {
  font-size: 10px;
  color: #666;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 5px;
  animation: fadeIn 0.2s ease;
}

.dropdown-header {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.user-email {
  font-size: 13px;
  color: #666;
  word-break: break-all;
}

.dropdown-divider {
  height: 1px;
  background-color: #eee;
  margin: 0;
}

.dropdown-item {
  display: block;
  padding: 10px 16px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.logout-button {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  color: #d32f2f;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media screen and (max-width: 768px) {
  .dropdown-menu {
    width: 180px;
  }
}
</style>