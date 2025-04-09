<!-- modules/notifications/NotificationsList.vue -->
<template>
    <div class="notifications-container">
      <div class="notifications-header">
        <h2>Thông báo chung</h2>
      </div>
      
      <div class="notifications-content">
        <notificationItem 
          v-for="(notification, index) in notifications" 
          :key="index"
          :notification="notification"
        />
      </div>
    </div>
  </template>
  
  <script>
  import NotificationItem from './NotificationItem'
  
  export default {
    name: 'NotificationsList',
    components: {
      NotificationItem: NotificationItem
    },
    data() {
      return {
        notifications: [
          {
            id: 1,
            title: 'Nội dung 1',
            date: '04/04/2025',
            isNew: true
          },
          {
            id: 2,
            title: 'Nội dung 2',
            date: '02/04/2025',
            updateDate: '02/04/2025',
            isNew: true
          },
          {
            id: 3,
            title: 'Nội dung 3',
            date: '27/03/2025',
            updateDate: '27/03/2025',
            isNew: true
          },
          {
            id: 4,
            title: 'Nội dung 4',
            date: '20/03/2025',
            isNew: false
          },
          {
            id: 5,
            title: 'Nội dung 5',
            date: '15/03/2025',
            isNew: false
          }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .notifications-container {
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
  }
  
  .notifications-header {
    background-color: #0066b3;
    color: #fff;
    padding: 10px 15px;
  }
  
  .notifications-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }
  
  .notifications-content {
    padding: 10px 0;
  }
  </style>