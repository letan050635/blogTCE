<!-- modules/notifications/NotificationsList.vue -->
<template>
  <div class="notifications-container">
    <div class="notifications-header">
      <h2>Thông báo chung</h2>
      <div class="notifications-actions">
        <button 
          class="mark-all-button" 
          @click="markAllAsRead" 
          v-if="hasUnreadNotifications"
          title="Đánh dấu tất cả là đã đọc"
          :disabled="isLoading"
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>
    </div>
    
    <!-- Phần tìm kiếm -->
    <NotificationSearch 
      @search="handleSearch"
      :disabled="isLoading"
    />
    
    <div class="notifications-toolbar">
      <div class="notifications-filter">
        <select v-model="currentFilter" class="filter-select" :disabled="isLoading">
          <option value="all">Tất cả thông báo</option>
          <option value="unread">Chưa đọc</option>
          <option value="read">Đã đọc</option>
        </select>
      </div>
      <div class="notifications-count">
        {{ totalItems }} thông báo {{ filterText }}
      </div>
    </div>
    
    <!-- Loading spinner -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải thông báo...</p>
    </div>
    
    <!-- Danh sách thông báo -->
    <div v-else class="notifications-content">
      <NotificationItem 
        v-for="notification in notifications" 
        :key="notification.id"
        :notification="notification"
        @open-popup="openNotificationPopup"
        @toggle-read="toggleReadStatus"
      />
      
      <div v-if="notifications.length === 0" class="no-notifications">
        Không tìm thấy thông báo {{ filterText }}
      </div>
    </div>
    
    <!-- Phân trang -->
    <PaginationControl 
      v-if="!isLoading && totalPages > 1"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :itemsPerPage="itemsPerPage"
      @page-changed="changePage"
    />
    
    <!-- Popup thông báo -->
    <NotificationPopup 
      :notification="selectedNotification" 
      :isOpen="isPopupOpen"
      @close="closeNotificationPopup"
      @mark-read="markAsRead"
    />
    
    <!-- Thông báo lỗi -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchNotifications" class="retry-button">Thử lại</button>
    </div>
  </div>
</template>

<script>
import NotificationItem from './NotificationItem'
import NotificationPopup from './NotificationPopup'
import NotificationSearch from './NotificationSearch'
import PaginationControl from '@/components/common/PaginationControl.vue'
import notificationService from '@/services/notificationService.js'

export default {
  name: 'NotificationsList',
  components: {
    NotificationItem,
    NotificationPopup,
    NotificationSearch,
    PaginationControl
  },
  data() {
    return {
      isPopupOpen: false,
      selectedNotification: {},
      currentFilter: 'all',
      currentPage: 1,
      itemsPerPage: 5,
      searchCriteria: {
        query: '',
        searchInContent: false,
        fromDate: '',
        toDate: ''
      },
      notifications: [],
      totalItems: 0,
      totalPages: 0,
      isLoading: false,
      error: null
    }
  },
  computed: {
    hasUnreadNotifications() {
      return this.notifications.some(notification => !notification.read);
    },
    filterText() {
      switch (this.currentFilter) {
        case 'read':
          return 'đã đọc';
        case 'unread':
          return 'chưa đọc';
        default:
          return '';
      }
    }
  },
  methods: {
    /**
     * Lấy danh sách thông báo từ service
     */
    fetchNotifications() {
      this.isLoading = true;
      this.error = null;
      
      // Chuẩn bị tham số
      const params = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        filter: this.currentFilter === 'all' ? null : this.currentFilter,
        search: this.searchCriteria.query || null
      };
      
      // Thêm tham số tìm kiếm nâng cao
      if (this.searchCriteria.fromDate) {
        params.fromDate = this.searchCriteria.fromDate;
      }
      
      if (this.searchCriteria.toDate) {
        params.toDate = this.searchCriteria.toDate;
      }
      
      if (this.searchCriteria.searchInContent) {
        params.searchInContent = true;
      }
      
      // Gọi service
      notificationService.getNotifications(params)
        .then(response => {
          this.notifications = response.data;
          this.totalItems = response.pagination.total;
          this.totalPages = response.pagination.totalPages;
          
          // Nếu trang hiện tại lớn hơn tổng số trang, reset về trang 1
          if (this.totalPages > 0 && this.currentPage > this.totalPages) {
            this.currentPage = 1;
            this.fetchNotifications();
          }
        })
        .catch(error => {
          this.error = 'Đã xảy ra lỗi khi tải thông báo. ' + error.message;
          console.error('Error fetching notifications:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    
    /**
     * Mở popup hiển thị chi tiết thông báo
     */
    openNotificationPopup(notification) {
      this.selectedNotification = notification;
      this.isPopupOpen = true;
      // Thêm class để ngăn cuộn trang khi popup đang mở
      document.body.classList.add('popup-open');
    },
    
    /**
     * Đóng popup thông báo
     */
    closeNotificationPopup() {
      this.isPopupOpen = false;
      // Xóa class để cho phép cuộn trang trở lại bình thường
      document.body.classList.remove('popup-open');
    },
    
    /**
     * Đánh dấu thông báo đã đọc
     */
    markAsRead(notificationId) {
      this.isLoading = true;
      
      notificationService.updateReadStatus(notificationId, true)
        .then(() => {
          // Cập nhật UI
          const notification = this.notifications.find(n => n.id === notificationId);
          if (notification) {
            notification.read = true;
          }
          
          // Đóng popup
          this.closeNotificationPopup();
          
          // Tải lại danh sách nếu đang lọc theo trạng thái đọc
          if (this.currentFilter !== 'all') {
            this.fetchNotifications();
          }
        })
        .catch(error => {
          console.error('Error marking notification as read:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    
    /**
     * Chuyển đổi trạng thái đọc của thông báo
     */
    toggleReadStatus(notificationId) {
      // Tìm thông báo trong danh sách
      const notification = this.notifications.find(n => n.id === notificationId);
      if (!notification) return;
      
      const newReadStatus = !notification.read;
      this.isLoading = true;
      
      notificationService.updateReadStatus(notificationId, newReadStatus)
        .then(() => {
          // Cập nhật UI
          notification.read = newReadStatus;
          
          // Tải lại danh sách nếu đang lọc theo trạng thái đọc
          if (this.currentFilter !== 'all') {
            this.fetchNotifications();
          }
        })
        .catch(error => {
          console.error('Error toggling notification read status:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    
    /**
     * Đánh dấu tất cả thông báo là đã đọc
     */
    markAllAsRead() {
      this.isLoading = true;
      
      notificationService.markAllAsRead()
        .then(() => {
          // Cập nhật UI
          this.notifications.forEach(notification => {
            notification.read = true;
          });
          
          // Tải lại danh sách nếu đang lọc theo trạng thái đọc
          if (this.currentFilter !== 'all') {
            this.fetchNotifications();
          }
        })
        .catch(error => {
          console.error('Error marking all notifications as read:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    
    /**
     * Chuyển trang
     */
    changePage(page) {
      if (this.currentPage !== page) {
        this.currentPage = page;
        this.fetchNotifications();
      }
    },
    
    /**
     * Xử lý tìm kiếm
     */
    handleSearch(searchParams) {
      this.searchCriteria = { ...searchParams };
      // Reset về trang đầu tiên khi tìm kiếm
      this.currentPage = 1;
      this.fetchNotifications();
    }
  },
  watch: {
    // Tải lại dữ liệu khi thay đổi bộ lọc
    currentFilter() {
      this.currentPage = 1;
      this.fetchNotifications();
    }
  },
  mounted() {
    // Tải danh sách thông báo khi component được tạo
    this.fetchNotifications();
  }
}
</script>

<style scoped>
.notifications-container {
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.notifications-header {
  background-color: #0066b3;
  color: #fff;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notifications-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.notifications-actions {
  display: flex;
}

.mark-all-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.mark-all-button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.3);
}

.mark-all-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.notifications-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.filter-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

.filter-select:disabled {
  background-color: #f1f1f1;
  cursor: not-allowed;
}

.notifications-count {
  font-size: 13px;
  color: #666;
}

.notifications-content {
  padding: 0;
  max-height: 600px;
  overflow-y: auto;
}

.no-notifications {
  padding: 20px;
  text-align: center;
  color: #777;
  font-style: italic;
}

/* Loading spinner */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  background-color: #f9f9f9;
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

/* Error message */
.error-message {
  padding: 20px;
  background-color: #ffebee;
  color: #d32f2f;
  text-align: center;
  border-top: 1px solid #ffcdd2;
}

.retry-button {
  margin-top: 10px;
  background-color: #0066b3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #004e8c;
}

@media screen and (max-width: 768px) {
  .notifications-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .notifications-actions {
    margin-top: 10px;
    width: 100%;
  }
  
  .mark-all-button {
    width: 100%;
    text-align: center;
    padding: 8px;
  }
  
  .notifications-toolbar {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .filter-select {
    width: 100%;
  }
}
</style>

<style>
/* Ngăn cuộn trang khi popup đang mở */
body.popup-open {
  overflow: hidden;
}

/* Tùy chỉnh thanh cuộn cho notifications-content */
.notifications-content::-webkit-scrollbar {
  width: 6px;
}

.notifications-content::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

.notifications-content::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.notifications-content::-webkit-scrollbar-thumb:hover {
  background-color: #aaa;
}
</style>