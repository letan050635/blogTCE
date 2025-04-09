<!-- modules/wordpress/WordPressTipsList.vue -->
<template>
    <div class="tips-container">
      <div class="tips-header">
        <h2>Tin ghim 2</h2>
      </div>
      
      <div class="tips-content">
        <WordPressTipItem 
          v-for="(tip, index) in tips" 
          :key="index"
          :tip="tip"
        />
      </div>
    </div>
  </template>
  
  <script>
  import WordPressTipItem from './WordPressTipItem.vue'
  
  export default {
    name: 'WordPressTipsList',
    components: {
      WordPressTipItem
    },
    data() {
      return {
        tips: [
          {
            id: 1,
            title: 'tin ghim 1',
            path: '/wordpress/nut-cuon-trang-javascript'
          },
          {
            id: 2,
            title: 'tin ghim 2',
            path: '/wordpress/menu-phu-co-dinh-mobile'
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