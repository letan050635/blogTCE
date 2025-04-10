<!-- eslint-disable vue/no-unused-vars -->
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
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>
    </div>
    
    <div class="notifications-toolbar">
      <div class="notifications-filter">
        <select v-model="currentFilter" class="filter-select">
          <option value="all">Tất cả thông báo</option>
          <option value="unread">Chưa đọc</option>
          <option value="read">Đã đọc</option>
        </select>
      </div>
      <div class="notifications-count">
        {{ displayedNotifications.length }} thông báo {{ filterText }}
      </div>
    </div>
    
    <div class="notifications-content">
      <NotificationItem 
        v-for="(notification) in displayedNotifications" 
        :key="notification.id"
        :notification="notification"
        @open-popup="openNotificationPopup"
        @toggle-read="toggleReadStatus"
      />
      
      <div v-if="displayedNotifications.length === 0" class="no-notifications">
        Không có thông báo {{ filterText }}
      </div>
    </div>
    
    <NotificationPopup 
      :notification="selectedNotification" 
      :isOpen="isPopupOpen"
      @close="closeNotificationPopup"
      @mark-read="markAsRead"
    />
  </div>
</template>

<script>
import NotificationItem from './NotificationItem'
import NotificationPopup from './NotificationPopup'

export default {
  name: 'NotificationsList',
  components: {
    NotificationItem,
    NotificationPopup
  },
  data() {
    return {
      isPopupOpen: false,
      selectedNotification: {},
      currentFilter: 'all',
      notifications: [
        {
          id: 1,
          title: 'Cập nhật tính năng mới: Popup thông báo chi tiết',
          brief: 'Chúng tôi vừa cập nhật tính năng popup hiển thị chi tiết thông báo...',
          content: `<h3>Tính năng mới: Popup thông báo chi tiết</h3>
          <p>Chúng tôi vừa cập nhật và triển khai tính năng popup hiển thị chi tiết thông báo, giúp người dùng xem được toàn bộ nội dung thông báo mà không cần rời khỏi trang hiện tại.</p>
          <p>Tính năng này bao gồm:</p>
          <ul>
            <li>Hiển thị tiêu đề đầy đủ của thông báo</li>
            <li>Hiển thị chi tiết nội dung thông báo</li>
            <li>Hiển thị thông tin ngày đăng/ngày cập nhật</li>
            <li>Khả năng đánh dấu thông báo đã đọc</li>
            <li>Đóng popup bằng nút X hoặc nhấp vào vùng ngoài</li>
          </ul>
          <p>Chúng tôi hy vọng rằng tính năng mới sẽ giúp nâng cao trải nghiệm người dùng trên website TCE-EMS.COM.</p>`,
          date: '04/04/2025',
          isNew: true,
          useHtml: true,
          read: false
        },
        {
          id: 2,
          title: 'Thông báo bảo trì hệ thống ngày 05/04/2025',
          brief: 'Chúng tôi sẽ tiến hành bảo trì hệ thống vào ngày 05/04/2025...',
          content: 'Chúng tôi sẽ tiến hành bảo trì hệ thống vào ngày 05/04/2025 từ 23:00 đến 02:00 ngày 06/04/2025. Trong thời gian này, website có thể không truy cập được hoặc hoạt động không ổn định. Mong quý khách thông cảm vì sự bất tiện này. Việc bảo trì giúp cải thiện hiệu suất và bảo mật của hệ thống, mang lại trải nghiệm tốt hơn cho người dùng.',
          date: '02/04/2025',
          updateDate: '03/04/2025',
          isNew: true,
          useHtml: false,
          read: false
        },
        {
          id: 3,
          title: 'Hướng dẫn: Tối ưu template Blogspot chuẩn SEO',
          brief: 'Trong bài viết này, chúng tôi sẽ hướng dẫn cách tối ưu template Blogspot...',
          content: `<h3>Hướng dẫn tối ưu template Blogspot chuẩn SEO</h3>
          <p>Trong bài viết này, chúng tôi sẽ hướng dẫn bạn cách tối ưu template Blogspot để đạt chuẩn SEO tốt nhất cho website của bạn.</p>
          <p>Các bước chính bao gồm:</p>
          <ol>
            <li>Tối ưu cấu trúc HTML</li>
            <li>Tối ưu thẻ heading (H1, H2, H3...)</li>
            <li>Tối ưu hình ảnh</li>
            <li>Tối ưu tốc độ tải trang</li>
            <li>Cải thiện trải nghiệm người dùng trên mobile</li>
          </ol>
          <p>Hãy theo dõi blog của chúng tôi để nhận thêm những thủ thuật hữu ích khác.</p>`,
          date: '27/03/2025',
          updateDate: '28/03/2025',
          isNew: true,
          useHtml: true,
          read: false
        },
        {
          id: 4,
          title: 'Cập nhật giao diện mới cho website',
          brief: 'Chúng tôi vừa cập nhật giao diện mới cho website, mang đến trải nghiệm người dùng tốt hơn...',
          content: 'Chúng tôi vừa cập nhật giao diện mới cho website, mang đến trải nghiệm người dùng tốt hơn. Giao diện mới được thiết kế để tối ưu trên cả thiết bị desktop và mobile, với tốc độ tải trang nhanh hơn và bố cục rõ ràng hơn. Chúng tôi hy vọng bạn sẽ thích giao diện mới này!',
          date: '20/03/2025',
          isNew: false,
          useHtml: false,
          read: true
        },
        {
          id: 5,
          title: 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi',
          brief: 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi trong thời gian qua...',
          content: 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi trong thời gian qua. Chúng tôi luôn nỗ lực cải thiện dịch vụ để mang lại trải nghiệm tốt nhất cho người dùng. Mọi góp ý của bạn đều rất quý giá đối với chúng tôi.',
          date: '15/03/2025',
          isNew: false,
          useHtml: false,
          read: true
        }
      ]
    }
  },
  computed: {
    displayedNotifications() {
      switch (this.currentFilter) {
        case 'read':
          return this.notifications.filter(notification => notification.read);
        case 'unread':
          return this.notifications.filter(notification => !notification.read);
        default:
          return this.notifications;
      }
    },
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
    openNotificationPopup(notification) {
      this.selectedNotification = notification;
      this.isPopupOpen = true;
      // Thêm class để ngăn cuộn trang khi popup đang mở
      document.body.classList.add('popup-open');
    },
    closeNotificationPopup() {
      this.isPopupOpen = false;
      // Xóa class để cho phép cuộn trang trở lại bình thường
      document.body.classList.remove('popup-open');
    },
    markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        // Đóng popup sau khi đánh dấu đã đọc
        this.closeNotificationPopup();
        
        // Lưu trạng thái vào localStorage (tùy chọn)
        this.saveReadStatus();
      }
    },
    toggleReadStatus(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = !notification.read;
        
        // Lưu trạng thái vào localStorage (tùy chọn)
        this.saveReadStatus();
      }
    },
    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.read = true;
      });
      
      // Lưu trạng thái vào localStorage (tùy chọn)
      this.saveReadStatus();
    },
    saveReadStatus() {
      // Lưu trạng thái vào localStorage để duy trì giữa các phiên
      const readStatus = this.notifications.reduce((status, notification) => {
        status[notification.id] = notification.read;
        return status;
      }, {});
      
      try {
        localStorage.setItem('notifications_read_status', JSON.stringify(readStatus));
      } catch (error) {
        console.error('Failed to save read status to localStorage:', error);
      }
    },
    loadReadStatus() {
      try {
        const storedStatus = localStorage.getItem('notifications_read_status');
        if (storedStatus) {
          const readStatus = JSON.parse(storedStatus);
          
          this.notifications.forEach(notification => {
            if (readStatus[notification.id] !== undefined) {
              notification.read = readStatus[notification.id];
            }
          });
        }
      } catch (error) {
        console.error('Failed to load read status from localStorage:', error);
      }
    }
  },
  mounted() {
    // Tải trạng thái đọc từ localStorage khi component được tạo
    this.loadReadStatus();
  }
}
</script>

<style scoped>
.notifications-container {
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.mark-all-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
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