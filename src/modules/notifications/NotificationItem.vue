<!-- modules/notifications/NotificationItem.vue -->
<template>
    <div class="notification-item">
      <div class="notification-checkbox">
        <input type="checkbox" :checked="false" disabled>
      </div>
      
      <div class="notification-content">
        <div class="notification-title">
          <router-link :to="`/notification/${notification.id}`">
            {{ notification.title }}
          </router-link>
          
          <span v-if="notification.isNew" class="notification-badge">New</span>
        </div>
        
        <div class="notification-date">
          <template v-if="notification.updateDate">
            <span>ngày cập nhật {{ notification.updateDate }}</span>
            <span>ngày đăng {{ notification.date }}</span>
          </template>
          <template v-else>
            <span>ngày đăng {{ notification.date }}</span>
          </template>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotificationItem',
    props: {
      notification: {
        type: Object,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .notification-item {
    display: flex;
    padding: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .notification-item:last-child {
    border-bottom: none;
  }
  
  .notification-checkbox {
    margin-right: 10px;
    display: flex;
    align-items: flex-start;
    padding-top: 3px;
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-title {
    margin-bottom: 5px;
    display: flex;
    align-items: flex-start;
  }
  
  .notification-title a {
    color: #0066b3;
    text-decoration: none;
    font-weight: 500;
  }
  
  .notification-title a:hover {
    text-decoration: underline;
  }
  
  .notification-badge {
    display: inline-block;
    background-color: #ff5722;
    color: #fff;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 3px;
    margin-left: 10px;
  }
  
  .notification-date {
    display: flex;
    justify-content: flex-end;
    color: #777;
    font-size: 13px;
  }
  
  .notification-date span {
    margin-left: 15px;
  }
  </style>