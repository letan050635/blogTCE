<!-- modules/blogspot/BlogspotTipsList.vue -->
<template>
    <div class="tips-container">
      <div class="tips-header">
        <h2>Tin ghim 1</h2>
      </div>
      
      <div class="tips-content">
        <BlogspotTipItem 
          v-for="(tip, index) in tips" 
          :key="index"
          :tip="tip"
        />
      </div>
    </div>
  </template>
  
  <script>
  import BlogspotTipItem from './BlogspotTipItem.vue'
  
  export default {
    name: 'BlogspotTipsList',
    components: {
      BlogspotTipItem
    },
    data() {
      return {
        tips: [
          {
            id: 1,
            title: 'Tin ghim 1',
            path: '/blogspot/menu-phu-co-dinh-mobile'
          },
          {
            id: 2,
            title: 'Tin ghim 2',
            path: '/blogspot/nut-cuon-trang-css'
          },
          {
            id: 3,
            title: 'Tin ghim 3',
            path: '/blogspot/toi-uu-giao-dien-chuan-seo'
          }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .tips-container {
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
  }
  
  .tips-header {
    background-color: #ff5722;
    color: #fff;
    padding: 10px 15px;
  }
  
  .tips-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }
  
  .tips-content {
    padding: 10px 0;
  }
  </style>