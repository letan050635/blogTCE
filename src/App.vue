<!-- App.vue - File chính kết hợp các component -->
<template>
  <div class="app-container">
    <!-- Sidebar bên trái -->
    <Sidebar />
    
    <!-- Phần nội dung chính bên phải -->
    <MainContent />
  </div>
</template>

<script>
import Sidebar from './components/AppSidebar.vue'
import MainContent from './components/MainContent.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    MainContent
  }
}
</script>

<style>
.app-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}
</style>