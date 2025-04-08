<template>
    <div class="menu-list">
      <div 
        class="menu-item" 
        v-for="i in menuItems" 
        :key="i"
        @click="selectMenuItem(i)"
        :class="{ 'active': selectedItem === i }"
      ></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MenuList',
    data() {
      return {
        menuItems: 14,
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
  .menu-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .menu-item {
    height: 20px;
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .menu-item:hover {
    background-color: #d0d0d0;
  }
  
  .menu-item.active {
    background-color: #c0c0c0;
  }
  </style>