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
          <BlogspotTipsList />
          <WordPressTipsList />
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import NotificationsList from '@/modules/notifications/NotificationsList'
import BlogspotTipsList from '@/modules/blogspot/BlogspotTipsList.vue'
import WordPressTipsList from '@/modules/wordpress/WordPressTipsList.vue'

export default {
  name: 'HomeView',
  components: {
    NotificationsList,
    BlogspotTipsList,
    WordPressTipsList
  }
}
</script>

<style scoped>
/* Sử dụng lại các styles từ App.vue */
</style>