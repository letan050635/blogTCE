<!-- src/views/HomeView.vue -->
<template>
  <div class="home-view">
    <div class="container">
      <div class="content-wrapper">
        <!-- Phần nội dung chính bên trái -->
        <div class="main-content">
          <NotificationsList />
        </div>
        <!-- Sidebar bên phải -->
        <div class="sidebar">
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import NotificationsList from '@/modules/notifications/NotificationsList'

export default {
  name: 'HomeView',
  components: {
    NotificationsList,
  }
}
</script>

<style scoped>
/* Sử dụng lại các styles từ App.vue */
</style>