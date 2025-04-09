<!-- modules/wordpress/WordPressTipItem.vue -->
<template>
    <div class="tip-item">
      <router-link :to="tip.path" class="tip-link">
        {{ tip.title }}
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'WordPressTipItem',
    props: {
      tip: {
        type: Object,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .tip-item {
    padding: 10px 15px;
  }
  
  .tip-link {
    display: block;
    color: #0066b3;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }
  
  .tip-link:hover {
    color: #21759b;
    text-decoration: underline;
  }
  </style>