<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="container header-container">
        <div class="logo">
          <router-link to="/admin">
            <h2>TCE-EMS Admin</h2>
          </router-link>
        </div>
        
        <div class="admin-user-info">
          <span v-if="user">{{ user.fullName }}</span>
          <button @click="logout" class="logout-button">Đăng xuất</button>
        </div>
      </div>
    </header>
    
    <div class="admin-container">
      <aside class="admin-sidebar">
        <nav class="admin-nav">
          <ul>
            <li>
              <router-link to="/admin/dashboard">Tổng quan</router-link>
            </li>
            <li>
              <router-link to="/admin/notifications">Quản lý thông báo</router-link>
            </li>
            <li>
              <router-link to="/admin/regulations">Quản lý quy định</router-link>
            </li>
            <li>
              <router-link to="/admin/users">Quản lý người dùng</router-link>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main class="admin-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
import authService from '@/services/authService';

export default {
  name: 'AdminLayout',
  data() {
    return {
      user: null
    };
  },
  created() {
    this.user = authService.getCurrentAdmin();
    if (!this.user || this.user.role !== 'admin') {
      this.$router.push('/admin/login');
    }
  },
  methods: {
    logout() {
      authService.logoutAdmin();
      this.$router.push('/admin/login');
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-header {
  background-color: #263238;
  color: white;
  padding: 10px 0;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  text-decoration: none;
  color: white;
}

.logo h2 {
  margin: 0;
  font-size: 20px;
}

.admin-user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-button {
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.admin-container {
  display: flex;
  flex: 1;
}

.admin-sidebar {
  width: 240px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
}

.admin-nav ul {
  list-style: none;
  padding: 20px 0;
  margin: 0;
}

.admin-nav li {
  margin-bottom: 5px;
}

.admin-nav a {
  display: block;
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
}

.admin-nav a.router-link-active {
  background-color: rgba(0, 102, 179, 0.1);
  color: #0066b3;
  font-weight: 500;
  border-left: 3px solid #0066b3;
}

.admin-nav a:hover:not(.router-link-active) {
  background-color: rgba(0, 0, 0, 0.05);
}

.admin-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

@media screen and (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }
  
  .admin-nav ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
  }
  
  .admin-nav li {
    margin: 0;
  }
  
  .admin-nav a {
    padding: 10px 15px;
  }
}
</style>