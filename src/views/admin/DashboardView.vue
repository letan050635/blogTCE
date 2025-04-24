<!-- views/admin/DashboardView.vue -->
<template>
    <AdminLayout>
      <div class="dashboard">
        <h1 class="page-title">Tổng quan hệ thống</h1>
        
        <div class="dashboard-stats">
          <div class="stat-card">
            <div class="stat-icon notification-icon">
              <span class="material-icons">notifications</span>
            </div>
            <div class="stat-content">
              <h3>Thông báo</h3>
              <p class="stat-value">{{ stats.notificationsCount }}</p>
              <p class="stat-description">Tổng số thông báo</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon regulation-icon">
              <span class="material-icons">gavel</span>
            </div>
            <div class="stat-content">
              <h3>Quy định</h3>
              <p class="stat-value">{{ stats.regulationsCount }}</p>
              <p class="stat-description">Tổng số quy định</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon user-icon">
              <span class="material-icons">people</span>
            </div>
            <div class="stat-content">
              <h3>Người dùng</h3>
              <p class="stat-value">{{ stats.usersCount }}</p>
              <p class="stat-description">Tổng số người dùng</p>
            </div>
          </div>
        </div>
        
        <div class="dashboard-content">
          <div class="dashboard-section">
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
                        :class="notification.isNew ? 'status-active' : 'status-inactive'"
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
          
          <div class="dashboard-section">
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
        </div>
      </div>
    </AdminLayout>
  </template>
  
  <script>
  import { ref, reactive, onMounted } from 'vue';
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
      const importantRegulations = ref([]);
      
      const stats = reactive({
        notificationsCount: 0,
        regulationsCount: 0,
        usersCount: 0
      });
      
      const fetchDashboardData = async () => {
        isLoading.value = true;
        
        try {
          // Fetch recent notifications
          const notificationsResult = await notificationService.getNotifications({
            page: 1,
            limit: 5
          });
          recentNotifications.value = notificationsResult.data;
          stats.notificationsCount = notificationsResult.pagination.total;
          
          // Fetch important regulations
          const regulationsResult = await regulationsService.getRegulations({
            page: 1,
            limit: 5,
            isImportant: true
          });
          importantRegulations.value = regulationsResult.data.filter(r => r.isImportant);
          stats.regulationsCount = regulationsResult.pagination.total;
          
          // Fetch users count (if API is available)
          try {
            const usersResult = await authService.getUsers({ page: 1, limit: 1 });
            stats.usersCount = usersResult.pagination.total;
          } catch (error) {
            console.warn('Could not fetch users count:', error);
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
        importantRegulations,
        stats
      };
    }
  }
  </script>
  
  <style scoped>
  .dashboard {
    padding-bottom: 30px;
  }
  
  .page-title {
    margin: 0 0 20px;
    font-size: 24px;
    color: #333;
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
  
  .status-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .status-active {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  .status-inactive {
    background-color: #f5f5f5;
    color: #757575;
  }
  
  .status-important {
    background-color: #ffebee;
    color: #c62828;
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
    .dashboard-content {
      grid-template-columns: 1fr;
    }
    
    .data-table th,
    .data-table td {
      padding: 10px 15px;
    }
  }
  </style>