<!-- /src/modules/notifications/NotificationsList.vue (cải tiến) -->
<template>
  <div class="notifications-container">
    <div class="notifications-header">
      <h2>Thông báo chung</h2>
    </div>
    
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
    
    <LoadingSpinner v-if="isLoading" message="Đang tải thông báo..." />
    
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
    
    <PaginationControl 
      v-if="!isLoading && totalPages > 1"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :itemsPerPage="itemsPerPage"
      @page-changed="changePage"
    />
    
    <NotificationPopup 
      :notification="selectedNotification" 
      :isOpen="isPopupOpen"
      @close="closeNotificationPopup"
      @mark-read="markAsRead"
    />
    
    <AlertMessage 
      v-if="error" 
      :message="error" 
      type="error" 
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import NotificationItem from './NotificationItem';
import NotificationPopup from './NotificationPopup';
import NotificationSearch from './NotificationSearch';
import PaginationControl from '@/components/common/PaginationControl.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';
import notificationService from '@/services/notificationService.js';
import useList from '@/composables/useList';

export default {
  name: 'NotificationsList',
  components: {
    NotificationItem,
    NotificationPopup,
    NotificationSearch,
    PaginationControl,
    LoadingSpinner,
    AlertMessage
  },
  setup() {
    const isPopupOpen = ref(false);
    const selectedNotification = ref({});
    const currentFilter = ref('all');
    const itemsPerPage = ref(5);
    const searchCriteria = ref({
      query: '',
      searchInContent: false,
      fromDate: '',
      toDate: ''
    });
    const error = ref(null);
    
    const {
      isLoading,
      data: notifications,
      currentPage,
      totalPages,
      totalItems,
      fetchData
    } = useList(notificationService.getNotifications, {
      defaultPageSize: itemsPerPage.value
    });
    
    const hasUnreadNotifications = computed(() => {
      return notifications.value.some(notification => !notification.read);
    });
    
    const filterText = computed(() => {
      switch (currentFilter.value) {
        case 'read':
          return 'đã đọc';
        case 'unread':
          return 'chưa đọc';
        default:
          return '';
      }
    });
    
    const fetchNotifications = async () => {
      try {
        const params = {
          page: currentPage.value,
          limit: itemsPerPage.value,
          filter: currentFilter.value === 'all' ? null : currentFilter.value,
          search: searchCriteria.value.query || null
        };
        
        if (searchCriteria.value.fromDate) {
          params.fromDate = searchCriteria.value.fromDate;
        }
        
        if (searchCriteria.value.toDate) {
          params.toDate = searchCriteria.value.toDate;
        }
        
        if (searchCriteria.value.searchInContent) {
          params.searchInContent = true;
        }
        
        await fetchData(params);
        error.value = null;
      } catch (err) {
        error.value = 'Đã xảy ra lỗi khi tải thông báo. ' + err.message;
        console.error('Error fetching notifications:', err);
      }
    };
    
    const openNotificationPopup = (notification) => {
      selectedNotification.value = notification;
      isPopupOpen.value = true;
      document.body.classList.add('popup-open');
      
      // Tự động đánh dấu là đã đọc khi mở popup
      if (!notification.read) {
        markAsRead(notification.id);
      }
    };
    
    const closeNotificationPopup = () => {
      isPopupOpen.value = false;
      document.body.classList.remove('popup-open');
    };
    
    const markAsRead = async (notificationId) => {
      isLoading.value = true;
      
      try {
        await notificationService.updateReadStatus(notificationId, true);
        
        const notification = notifications.value.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
        }
        
        // Nếu đang lọc theo trạng thái đọc, cập nhật lại danh sách
        if (currentFilter.value !== 'all') {
          fetchNotifications();
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    const toggleReadStatus = async (notificationId) => {
      const notification = notifications.value.find(n => n.id === notificationId);
      if (!notification) return;
      
      const newReadStatus = !notification.read;
      isLoading.value = true;
      
      try {
        await notificationService.updateReadStatus(notificationId, newReadStatus);
        notification.read = newReadStatus;
        
        if (currentFilter.value !== 'all') {
          fetchNotifications();
        }
      } catch (err) {
        console.error('Error toggling notification read status:', err);
      } finally {
        isLoading.value = false;
      }
    };
    
    const changePage = (page) => {
      if (currentPage.value !== page) {
        currentPage.value = page;
        fetchNotifications();
      }
    };
    
    const handleSearch = (searchParams) => {
      searchCriteria.value = { ...searchParams };
      currentPage.value = 1;
      fetchNotifications();
    };
    
    watch(currentFilter, () => {
      currentPage.value = 1;
      fetchNotifications();
    });
    
    onMounted(() => {
      fetchNotifications();
    });
    
    return {
      isLoading,
      notifications,
      isPopupOpen,
      selectedNotification,
      currentFilter,
      currentPage,
      itemsPerPage,
      totalPages,
      totalItems,
      error,
      hasUnreadNotifications,
      filterText,
      openNotificationPopup,
      closeNotificationPopup,
      markAsRead,
      toggleReadStatus,
      changePage,
      handleSearch
    };
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

@media screen and (max-width: 768px) {
  .notifications-header {
    flex-direction: column;
    align-items: flex-start;
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