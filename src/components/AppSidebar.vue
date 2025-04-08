<template>
    <div class="sidebar">
      <!-- Phần profile -->
      <ProfileSection />
      
      <!-- Phần menu chính -->
      <div class="square-menu-item"></div>
      
      <!-- Search bar -->
      <div class="search-bar"></div>
      
      <!-- Danh sách menu -->
      <MenuList />
    </div>
  </template>
  
  <script>
  import ProfileSection from './ProfileSection.vue'
  import MenuList from './MenuList.vue'
  
  export default {
    name: 'AppSidebar',
    components: {
      ProfileSection,
      MenuList
    }
  }
  </script>
  
  <style scoped>
  .sidebar {
    width: 270px;
    background-color: white;
    border-right: 1px solid #e0e0e0;
    padding: 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .square-menu-item {
    height: 40px;
    width: 40px;
    background-color: #e0e0e0;
    margin-bottom: 15px;
  }
  
  .search-bar {
    height: 38px;
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 4px;
    margin-bottom: 15px;
  }
  </style>