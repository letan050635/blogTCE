<template>
  <div id="app">
    <TheHeader />
    <MainNavigation />
    <!-- Nội dung chính -->
    <div class="main-container">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
    <ScrollToTopButton />
    <!-- Footer -->
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from './components/layout/TheHeader'
import MainNavigation from './components/navigation/MainNavigation.vue'
import ScrollToTopButton from './components/navigation/ScrollToTopButton.vue'
import TheFooter from './components/layout/TheFooter.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    MainNavigation,
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
  display: flex;
  flex-direction: column;
} 

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
  width: 100%;
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

/* Phản hồi khi nhấn vào các phần tử tương tác */
button, a {
  transition: all 0.2s ease;
}

button:active, a:active {
  transform: scale(0.98);
}

/* CSS cho form */
input, select, textarea {
  font-family: inherit;
}

/* Tạo khoảng trống phía dưới để footer luôn nằm ở cuối trang */
.main-container {
  flex: 1;
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