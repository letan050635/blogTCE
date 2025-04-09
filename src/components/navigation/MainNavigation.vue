<template>
  <nav class="main-navigation">
    <div class="container">
      <ul class="nav-list">
        <li 
          v-for="(item, index) in navItems" 
          :key="index" 
          class="nav-item"
          :class="{ active: currentPath === item.path }"
        >
          <router-link :to="item.path">{{ item.name }}</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'MainNavigation',
  data() {
    return {
      navItems: [
        { name: 'Home', path: '/' }, 
        { name: 'Blogspot', path: '/blogspot' },
        { name: 'Wordpress', path: '/wordpress' },
        { name: 'SEO', path: '/seo' }
      ],
      currentPath: '/'
    }
  },
  created() {
    this.currentPath = this.$route ? this.$route.path : '/'
  },
  watch: {
    '$route'(to) {
      this.currentPath = to.path
    }
  }
}
</script>

<style scoped>
.main-navigation {
  background-color: #FF7F00;
  padding: 0;
}

.container {
  width: 100%;
  padding: 0 20px;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
}

.nav-item a {
  display: block;
  padding: 15px 20px;
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s;
}

.nav-item a:hover,
.nav-item.active a {
  background-color: rgba(255, 255, 255, 0.1);
}

@media screen and (max-width: 768px) {
  .nav-list {
    flex-direction: column;
  }
}
</style>