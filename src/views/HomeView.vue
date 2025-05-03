<!-- src/views/HomeView.vue -->
<template>
  <div class="home-view">
    <div class="container">
      <div class="content-wrapper">
        <!-- Phần nội dung chính bên trái -->
        <div class="main-content">
          <NotificationsList />
        </div>

        <!-- Sidebar bên phải - thông báo quan trọng -->
        <div class="sidebar">
          <div class="sidebar-widget">
            <h3>Thông báo quan trọng</h3>
            <ul class="important-notifications">
              <li
                v-for="notification in importantNotifications"
                :key="notification.id"
              >
                <a href="#" @click.prevent="openNotification(notification)">
                  {{ notification.title }}
                  <span v-if="notification.isNew" class="badge new-badge"
                    >Mới</span
                  >
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Popup xem thông báo -->
    <NotificationPopup
      :notification="selectedNotification"
      :isOpen="isPopupOpen"
      @close="closeNotificationPopup"
      @mark-read="markAsRead"
    />
  </div>
</template>
  
<script>
import NotificationsList from "@/modules/notifications/NotificationsList";
import NotificationPopup from "@/modules/notifications/NotificationPopup";
import notificationService from "@/services/notificationService";

export default {
  name: "HomeView",
  components: {
    NotificationsList,
    NotificationPopup,
  },
  data() {
    return {
      importantNotifications: [],
      isPopupOpen: false,
      selectedNotification: {},
    };
  },
  methods: {
    fetchImportantNotifications() {
      notificationService
        .getNotifications({
          page: 1,
          limit: 5,
          filter: 'all'
        })
        .then((response) => {
          this.importantNotifications = response.data
            .filter(notification => notification.isImportant)
            .slice(0, 5);
        })
        .catch((error) => {
          console.error("Error fetching important notifications:", error);
        });
    },

    openNotification(notification) {
      notificationService
        .getNotificationById(notification.id)
        .then((detailedNotification) => {
          this.selectedNotification = detailedNotification;
          this.isPopupOpen = true;
          // Thêm class để ngăn cuộn trang khi popup đang mở
          document.body.classList.add("popup-open");
        })
        .catch((error) => {
          console.error("Error fetching notification details:", error);
        });
    },

    /**
     * Đóng popup thông báo
     */
    closeNotificationPopup() {
      this.isPopupOpen = false;
      // Xóa class để cho phép cuộn trang trở lại bình thường
      document.body.classList.remove("popup-open");
    },

    /**
     * Đánh dấu thông báo đã đọc
     */
    markAsRead(notificationId) {
      notificationService
        .updateReadStatus(notificationId, true)
        .then(() => {
          // Cập nhật UI
          if (this.selectedNotification.id === notificationId) {
            this.selectedNotification.read = true;
          }

          // Đóng popup
          this.closeNotificationPopup();

          // Làm mới danh sách thông báo quan trọng
          this.fetchImportantNotifications();
        })
        .catch((error) => {
          console.error("Error marking notification as read:", error);
        });
    },
  },
  mounted() {
    // Lấy danh sách thông báo quan trọng khi component được tạo
    this.fetchImportantNotifications();
  },
};
</script>

<style scoped>
.home-view {
  margin: 20px 0;
}

.sidebar-widget {
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.sidebar-widget h3 {
  background-color: #ff5722;
  color: #fff;
  margin: 0;
  padding: 12px 15px;
  font-size: 16px;
  font-weight: 500;
}

.important-notifications {
  list-style: none;
  padding: 0;
  margin: 0;
}

.important-notifications li {
  border-bottom: 1px solid #eee;
}

.important-notifications li:last-child {
  border-bottom: none;
}

.important-notifications a {
  display: block;
  padding: 12px 15px;
  color: #0066b3;
  text-decoration: none;
  transition: background-color 0.2s;
  font-size: 14px;
  position: relative;
}

.important-notifications a:hover {
  background-color: #f5f5f5;
  color: #ff5722;
}

.badge {
  display: inline-block;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 3px;
  margin-left: 5px;
  vertical-align: middle;
}

.new-badge {
  background-color: #ff5722;
  color: #fff;
}

@media screen and (max-width: 768px) {
  .sidebar-widget {
    margin-top: 20px;
  }
}
</style>