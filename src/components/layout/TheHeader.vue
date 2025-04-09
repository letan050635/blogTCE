<!-- components/layout/TheHeader.vue -->
<template>
    <header class="header">
      <div class="container header-container">
        <div class="logo">
          <router-link to="/">
            <img src="@/assets/images/logo.png" alt="Logo" width="100%" height="50" />
          </router-link>
        </div>
        
        <div class="search-container">
          <SearchBar />
        </div>
      </div>
    </header>
  </template>
  
  <script>
  import SearchBar from '../common/SearchBar.vue'
  
  export default {
    name: 'TheHeader',
    components: {
      SearchBar
    }
  }
  </script>
  
  <style scoped>
  .header {
    background-color: #fff;
    padding: 15px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    display: flex;
    align-items: center;
  }
  

  
  .logo a {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: #FF5722;
  }
  
  .logo h1 {
    font-size: 36px;
    font-weight: bold;
    margin: 0;
    line-height: 1;
  }
  
  .logo span {
    font-size: 14px;
    margin-top: 2px;
  }
  
  .search-container {
    width: 500px;
  }
  
  @media screen and (max-width: 768px) {
    .header-container {
      flex-direction: column;
      gap: 15px;
    }
    
    .search-container {
      width: 100%;
    }
  }
  </style>