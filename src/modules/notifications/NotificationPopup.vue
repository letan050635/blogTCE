<!-- modules/notifications/NotificationPopup.vue -->
<template>
    <transition name="fade">
      <div class="notification-popup-overlay" v-if="isOpen" @click="closeOnOverlayClick">
        <transition name="slide">
          <div class="notification-popup-content" @click.stop>
            <div class="notification-popup-header">
              <h2>{{ notification.title }}</h2>
              <button class="close-button" @click="close">&times;</button>
            </div>
            
            <div class="notification-popup-body">
              <div v-if="notification.useHtml" v-html="notification.content"></div>
              <p v-else>{{ notification.content }}</p>
            </div>
            
            <div class="notification-popup-footer">
              <div class="notification-date">
                <template v-if="notification.updateDate">
                  <span>Cập nhật: {{ notification.updateDate }}</span>
                  <span>Đăng: {{ notification.date }}</span>
                </template>
                <template v-else>
                  <span>Đăng: {{ notification.date }}</span>
                </template>
              </div>
              <div class="notification-actions" v-if="!notification.read">
                <button class="mark-read-button" @click="markAsRead">Đánh dấu đã đọc</button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'NotificationPopup',
    props: {
      notification: {
        type: Object,
        required: true,
        default: () => ({
          id: 0,
          title: '',
          content: '',
          date: '',
          updateDate: null,
          useHtml: false,
          read: false
        })
      },
      isOpen: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      // Thêm phím tắt Esc để đóng popup
      document.addEventListener('keydown', this.handleKeyDown);
    },
    beforeUnmount() {
      // Dọn dẹp event listener
      document.removeEventListener('keydown', this.handleKeyDown);
    },
    methods: {
      close() {
        this.$emit('close');
      },
      closeOnOverlayClick(event) {
        if (event.target === event.currentTarget) {
          this.close();
        }
      },
      markAsRead() {
        this.$emit('mark-read', this.notification.id);
      },
      handleKeyDown(event) {
        // Đóng popup khi nhấn Esc
        if (this.isOpen && event.key === 'Escape') {
          this.close();
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .notification-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .notification-popup-content {
    background-color: #fff;
    border-radius: 5px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  .notification-popup-header {
    background-color: #0066b3;
    color: #fff;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .notification-popup-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }
  
  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    transition: transform 0.2s;
  }
  
  .close-button:hover {
    transform: scale(1.2);
  }
  
  .notification-popup-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
    line-height: 1.5;
  }
  
  .notification-popup-body p {
    margin-bottom: 15px;
  }
  
  .notification-popup-footer {
    padding: 10px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .notification-date {
    display: flex;
    flex-direction: column;
    color: #777;
    font-size: 13px;
    text-align: right;
  }
  
  .notification-date span {
    margin-bottom: 5px;
  }
  
  .notification-actions {
    display: flex;
  }
  
  .mark-read-button {
    background-color: #0066b3;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }
  
  .mark-read-button:hover {
    background-color: #004e8c;
  }
  
  /* Animations */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s;
  }
  
  .slide-enter-from,
  .slide-leave-to {
    transform: translateY(-30px);
  }
  
  @media screen and (max-width: 768px) {
    .notification-popup-content {
      width: 95%;
      max-height: 80vh;
    }
    
    .notification-popup-footer {
      flex-direction: column-reverse;
      gap: 10px;
      align-items: flex-start;
    }
    
    .notification-actions {
      width: 100%;
      margin-bottom: 10px;
    }
    
    .mark-read-button {
      width: 100%;
      padding: 10px;
    }
    
    .notification-date {
      width: 100%;
      text-align: left;
    }
  }
  
  @media screen and (max-width: 480px) {
    .notification-popup-header h2 {
      font-size: 16px;
    }
    
    .notification-popup-body {
      padding: 15px;
      font-size: 14px;
    }
  }
  </style>