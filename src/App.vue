<template>
  <div id="app">
    <TheHeader />
    <MainNavigation />
    <!-- Nội dung chính -->
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
    <ScrollToTopButton />
    <!-- Footer -->
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from './components/layout/TheHeader'
import MainNavigation from './components/navigation/MainNavigation.vue'
import NotificationsList from './modules/notifications/NotificationsList'
import BlogspotTipsList from './modules/blogspot/BlogspotTipsList.vue'
import WordPressTipsList from './modules/wordpress/WordPressTipsList.vue'
import ScrollToTopButton from './components/navigation/ScrollToTopButton.vue'
import TheFooter from './components/layout/TheFooter.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    MainNavigation,
    NotificationsList,
    BlogspotTipsList,
    WordPressTipsList,
    ScrollToTopButton,
    TheFooter
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #ddeaf1;
}

#app {
  width: 100%;
  min-height: 100vh;
} 

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.main-content {
  flex: 1;
  background-color: #d6dfe2;
  border-radius: 5px;
  padding: 15px;
}

.sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media screen and (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
}
</style>