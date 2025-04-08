<!-- components/TabHeader.vue - Component thanh tab ngang -->
<template>
    <div class="tabs-header">
      <div 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="tab-item"
        :class="{ 'active': activeTab === index }"
        @click="onTabClick(index)"
      >
        {{ tab.title }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TabHeader',
    props: {
      tabs: {
        type: Array,
        required: true
      },
      activeTab: {
        type: Number,
        default: 0
      }
    },
    methods: {
      onTabClick(index) {
        this.$emit('tab-change', index);
      }
    }
  }
  </script>
  
  <style scoped>
  .tabs-header {
    display: flex;
    width: 100%;
    background-color: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  
  .tab-item {
    flex: 1;
    padding: 12px 20px;
    text-align: center;
    cursor: pointer;
    font-weight: 500;
    color: #666;
    transition: all 0.3s ease;
    background-color: #e0e0e0;
    border-right: 1px solid #f5f5f5;
  }
  
  .tab-item:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  
  .tab-item:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-right: none;
  }
  
  .tab-item:nth-child(1) {
    background-color: #e0e0e0;
  }
  
  .tab-item:nth-child(2) {
    background-color: #d0d0d0;
  }
  
  .tab-item:nth-child(3) {
    background-color: #c0c0c0;
  }
  
  .tab-item:nth-child(4) {
    background-color: #b0b0b0;
  }
  
  .tab-item:hover {
    background-color: #dcdcdc;
  }
  
  .tab-item.active {
    position: relative;
    color: #333;
    font-weight: bold;
  }
  
  .tab-item.active:nth-child(1) {
    background-color: #e8e8e8;
  }
  
  .tab-item.active:nth-child(2) {
    background-color: #d8d8d8;
  }
  
  .tab-item.active:nth-child(3) {
    background-color: #c8c8c8;
  }
  
  .tab-item.active:nth-child(4) {
    background-color: #b8b8b8;
  }
  
  .tab-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #5a5a5a;
  }
  </style>