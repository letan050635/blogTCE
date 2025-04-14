<!-- components/layout/TheHeader.vue -->
<template>
  <header class="header">
    <div class="container header-container">
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/images/logo.png" alt="Logo" width="100%" height="50" />
        </router-link>
      </div>
      
      <div class="header-right">
        <div class="search-container">
          <SearchBar />
        </div>
        
        <div class="login-container">
          <LoginButton />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import SearchBar from '../common/SearchBar.vue'
import LoginButton from '../auth/LoginButton.vue'

export default {
  name: 'TheHeader',
  components: {
    SearchBar,
    LoginButton
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

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-container {
  width: 400px;
}

.login-container {
  min-width: 100px;
  display: flex;
  justify-content: flex-end;
}

@media screen and (max-width: 968px) {
  .search-container {
    width: 300px;
  }
}

@media screen and (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .header-right {
    width: 100%;
    flex-direction: column;
  }
  
  .search-container {
    width: 100%;
  }
  
  .login-container {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>