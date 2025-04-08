<!-- components/TopMenu.vue - Component menu ngang phía trên -->
<template>
    <div class="top-menu">
      <div 
        class="top-menu-item" 
        v-for="i in 4" 
        :key="i"
        @click="selectMenuItem(i)"
        :class="{ 'active': selectedItem === i }"
      ></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TopMenu',
    data() {
      return {
        selectedItem: 1
      }
    },
    methods: {
      selectMenuItem(index) {
        this.selectedItem = index;
      }
    }
  }
  </script>
  
  <style scoped>
  .top-menu {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .top-menu-item {
    height: 30px;
    flex: 1;
    background-color: #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .top-menu-item:hover {
    background-color: #d0d0d0;
  }
  
  .top-menu-item.active {
    background-color: #c0c0c0;
  }
  </style>