<template>
  <AdminLayout>
    <div class="dashboard">
      <div class="dashboard-header">
        <h1 class="page-title">Tổng quan hệ thống</h1>
        
        <!-- Thêm nút cấu hình hiển thị -->
        <button @click="showSettings = !showSettings" class="settings-button">
          <i class="icon-settings">⚙️</i>
          Cấu hình
        </button>
      </div>
      
      <!-- Panel cấu hình hiển thị -->
      <div v-if="showSettings" class="settings-panel">
        <h3>Chọn phần hiển thị</h3>
        <div class="settings-options">
          <label class="setting-option">
            <input type="checkbox" v-model="visibleSections.stats">
            Hiển thị tổng quan
          </label>
          <label class="setting-option">
            <input type="checkbox" v-model="visibleSections.notifications">
            Hiển thị thông báo mới nhất
          </label>
          <label class="setting-option">
            <input type="checkbox" v-model="visibleSections.importantNotifications">
            Hiển thị thông báo quan trọng
          </label>
          <label class="setting-option">
            <input type="checkbox" v-model="visibleSections.newRegulations">
            Hiển thị quy định mới
          </label>
          <label class="setting-option">
            <input type="checkbox" v-model="visibleSections.importantRegulations">
            Hiển thị quy định quan trọng
          </label>
          <label class="setting-option">
            <input type="checkbox" v-model="visibleSections.users">
            Hiển thị danh sách người dùng mới
          </label>
        </div>
      </div>
      
      <!-- Tổng quan -->
      <div v-if="visibleSections.stats" class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon notification-icon">
            <i class="icon">📢</i>
          </div>
          <div class="stat-content">
            <h3>Thông báo</h3>
            <p class="stat-value">{{ stats.notificationsCount }}</p>
            <p class="stat-description">Tổng số thông báo</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon regulation-icon">
            <i class="icon">📋</i>
          </div>
          <div class="stat-content">
            <h3>Quy định</h3>
            <p class="stat-value">{{ stats.regulationsCount }}</p>
            <p class="stat-description">Tổng số quy định</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon user-icon">
            <i class="icon">👥</i>
          </div>
          <div class="stat-content">
            <h3>Người dùng</h3>
            <p class="stat-value">{{ stats.usersCount }}</p>
            <p class="stat-description">Tổng số người dùng</p>
          </div>
        </div>
      </div>
      
      <div class="dashboard-content">
        <!-- Thông báo mới nhất -->
        <div v-if="visibleSections.notifications" class="dashboard-section">
          <div class="section-header">
            <h2>Thông báo mới nhất</h2>
            <router-link to="/admin/notifications" class="view-all-link">
              Xem tất cả
            </router-link>
          </div>
          
          <div class="data-list" v-if="!isLoading">
            <div v-if="recentNotifications.length === 0" class="no-data">
              Không có thông báo nào.
            </div>
            <table v-else class="data-table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Ngày đăng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="notification in recentNotifications" :key="notification.id">
                  <td>{{ notification.title }}</td>
                  <td>{{ notification.date }}</td>
                  <td>
                    <span 
                      class="status-badge" 
                      :class="notification.isNew ? 'status-new' : 'status-normal'"
                    >
                      {{ notification.isNew ? 'Mới' : 'Thường' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="loading-indicator">
            <div class="spinner"></div>
          </div>
        </div>
        
        <!-- Thông báo quan trọng -->
        <div v-if="visibleSections.importantNotifications" class="dashboard-section">
          <div class="section-header">
            <h2>Thông báo quan trọng</h2>
            <router-link to="/admin/notifications" class="view-all-link">
              Xem tất cả
            </router-link>
          </div>
          
          <div class="data-list" v-if="!isLoading">
            <div v-if="importantNotifications.length === 0" class="no-data">
              Không có thông báo quan trọng nào.
            </div>
            <table v-else class="data-table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Ngày đăng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="notification in importantNotifications" :key="notification.id">
                  <td>{{ notification.title }}</td>
                  <td>{{ notification.date }}</td>
                  <td>
                    <span class="status-badge status-important">
                      Quan trọng
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="loading-indicator">
            <div class="spinner"></div>
          </div>
        </div>
        
        <!-- Quy định mới -->
        <div v-if="visibleSections.newRegulations" class="dashboard-section">
          <div class="section-header">
            <h2>Quy định mới</h2>
            <router-link to="/admin/regulations" class="view-all-link">
              Xem tất cả
            </router-link>
          </div>
          
          <div class="data-list" v-if="!isLoading">
            <div v-if="newRegulations.length === 0" class="no-data">
              Không có quy định mới nào.
            </div>
            <table v-else class="data-table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Ngày đăng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="regulation in newRegulations" :key="regulation.id">
                  <td>{{ regulation.title }}</td>
                  <td>{{ regulation.date }}</td>
                  <td>
                    <span class="status-badge status-new">
                      Mới
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="loading-indicator">
            <div class="spinner"></div>
          </div>
        </div>
        
        <!-- Quy định quan trọng -->
        <div v-if="visibleSections.importantRegulations" class="dashboard-section">
          <div class="section-header">
            <h2>Quy định quan trọng</h2>
            <router-link to="/admin/regulations" class="view-all-link">
              Xem tất cả
            </router-link>
          </div>
          
          <div class="data-list" v-if="!isLoading">
            <div v-if="importantRegulations.length === 0" class="no-data">
              Không có quy định quan trọng nào.
            </div>
            <table v-else class="data-table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Ngày đăng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="regulation in importantRegulations" :key="regulation.id">
                  <td>{{ regulation.title }}</td>
                  <td>{{ regulation.date }}</td>
                  <td>
                    <span class="status-badge status-important">
                      Quan trọng
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="loading-indicator">
            <div class="spinner"></div>
          </div>
        </div>
        
        <!-- Danh sách người dùng mới -->
        <div v-if="visibleSections.users" class="dashboard-section">
          <div class="section-header">
            <h2>Người dùng mới đăng ký</h2>
            <router-link to="/admin/users" class="view-all-link">
              Xem tất cả
            </router-link>
          </div>
          
          <div class="data-list" v-if="!isLoading">
            <div v-if="recentUsers.length === 0" class="no-data">
              Không có người dùng mới.
            </div>
            <table v-else class="data-table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Phòng ban</th>
                  <th>Vai trò</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in recentUsers" :key="user.id">
                  <td>{{ user.fullName }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.department || 'N/A' }}</td>
                  <td>
                    <span 
                      class="status-badge" 
                      :class="user.role === 'admin' ? 'status-admin' : 'status-user'"
                    >
                      {{ user.role === 'admin' ? 'Admin' : 'User' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="loading-indicator">
            <div class="spinner"></div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue';
import AdminLayout from '@/components/admin/AdminLayout.vue';
import notificationService from '@/services/notificationService';
import regulationsService from '@/services/regulationsService';
import authService from '@/services/authService';

export default {
  name: 'DashboardView',
  components: {
    AdminLayout
  },
  setup() {
    const isLoading = ref(true);
    const recentNotifications = ref([]);
    const importantNotifications = ref([]);
    const newRegulations = ref([]);
    const importantRegulations = ref([]);
    const recentUsers = ref([]);
    const showSettings = ref(false);
    
    const stats = reactive({
      notificationsCount: 0,
      regulationsCount: 0,
      usersCount: 0
    });
    
    // Lấy cấu hình hiển thị từ localStorage hoặc mặc định hiển thị tất cả
    const visibleSections = reactive({
      stats: localStorage.getItem('dashboard_stats') !== 'false',
      notifications: localStorage.getItem('dashboard_notifications') !== 'false',
      importantNotifications: localStorage.getItem('dashboard_important_notifications') !== 'false',
      newRegulations: localStorage.getItem('dashboard_new_regulations') !== 'false',
      importantRegulations: localStorage.getItem('dashboard_important_regulations') !== 'false',
      users: localStorage.getItem('dashboard_users') !== 'false'
    });
    
    // Lưu cấu hình vào localStorage khi thay đổi
    watch(visibleSections, (newVal) => {
      localStorage.setItem('dashboard_stats', newVal.stats);
      localStorage.setItem('dashboard_notifications', newVal.notifications);
      localStorage.setItem('dashboard_important_notifications', newVal.importantNotifications);
      localStorage.setItem('dashboard_new_regulations', newVal.newRegulations);
      localStorage.setItem('dashboard_important_regulations', newVal.importantRegulations);
      localStorage.setItem('dashboard_users', newVal.users);
    });
    
    const fetchDashboardData = async () => {
      isLoading.value = true;
      
      try {
        const notificationsResult = await notificationService.getNotifications({
          page: 1,
          limit: 10
        });
        
        recentNotifications.value = notificationsResult.data.slice(0, 5);
        importantNotifications.value = notificationsResult.data
          .filter(n => n.isImportant)
          .slice(0, 5);
        stats.notificationsCount = notificationsResult.pagination.total;
        
        const regulationsResult = await regulationsService.getRegulations({
          page: 1,
          limit: 10
        });
        
        // Filter regulations
        newRegulations.value = regulationsResult.data
          .filter(r => r.isNew)
          .slice(0, 5);
        importantRegulations.value = regulationsResult.data
          .filter(r => r.isImportant)
          .slice(0, 5);
        stats.regulationsCount = regulationsResult.pagination.total;
        
        // Fetch recent users
        try {
          const usersResult = await authService.getUsers({ 
            page: 1, 
            limit: 5 
          });
          recentUsers.value = usersResult.data;
          stats.usersCount = usersResult.pagination.total;
        } catch (error) {
          console.warn('Could not fetch users:', error);
          recentUsers.value = [];
          stats.usersCount = 0;
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    onMounted(() => {
      fetchDashboardData();
    });
    
    return {
      isLoading,
      recentNotifications,
      importantNotifications,
      newRegulations,
      importantRegulations,
      recentUsers,
      stats,
      showSettings,
      visibleSections
    };
  }
}
</script>

<style scoped>
.dashboard {
  padding-bottom: 30px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.settings-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.settings-button:hover {
  background-color: #e0e0e0;
}

.icon-settings {
  font-size: 16px;
}

.settings-panel {
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.settings-panel h3 {
  margin: 0 0 15px;
  font-size: 16px;
  color: #333;
}

.settings-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.setting-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  padding: 5px;
}

.setting-option:hover {
  background-color: #f0f0f0;
  border-radius: 4px;
}

.setting-option input[type="checkbox"] {
  margin-right: 8px;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 20px;
  font-size: 24px;
  color: white;
}

.stat-icon .icon {
  font-size: 28px;
}

.notification-icon {
  background-color: #2196F3;
}

.regulation-icon {
  background-color: #FF7F00;
}

.user-icon {
  background-color: #4CAF50;
}

.stat-content h3 {
  margin: 0 0 5px;
  font-size: 16px;
  color: #666;
}

.stat-value {
  margin: 0 0 5px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.stat-description {
  margin: 0;
  font-size: 14px;
  color: #888;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
}

.dashboard-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.view-all-link {
  color: #0066b3;
  font-size: 14px;
  text-decoration: none;
}

.view-all-link:hover {
  text-decoration: underline;
}

.data-list {
  padding: 0 0 10px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 20px;
  text-align: left;
  border-bottom: 1px solid #f5f5f5;
}

.data-table th {
  font-weight: 500;
  color: #333;
  background-color: #f9f9f9;
}

.data-table tbody tr:hover {
  background-color: #f5f5f5;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-new {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-normal {
  background-color: #f5f5f5;
  color: #757575;
}

.status-important {
  background-color: #ffebee;
  color: #c62828;
}

.status-admin {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-user {
  background-color: #f5f5f5;
  color: #757575;
}

.no-data {
  padding: 20px;
  text-align: center;
  color: #888;
  font-style: italic;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0066b3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media screen and (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .data-table th,
  .data-table td {
    padding: 10px 15px;
  }
  
  .settings-options {
    grid-template-columns: 1fr;
  }
}
</style>