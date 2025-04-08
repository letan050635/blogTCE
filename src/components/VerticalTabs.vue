<template>
    <div class="vertical-tabs-container">
      <div class="vertical-tabs">
        <div 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="tab-item"
          :class="{ 'active': activeTab === index }"
          @click="onTabClick(index)"
        >
          <div class="tab-number">{{ index + 1 }}</div>
          <div class="tab-content">
            <div class="tab-line long"></div>
            <div class="tab-line medium"></div>
            <div class="tab-line short"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VerticalTabs',
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
  .vertical-tabs-container {
    width: 100%;
  }
  
  .vertical-tabs {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
  }
  
  .tab-item {
    display: flex;
    align-items: flex-start;
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    transition: box-shadow 0.2s ease, transform 0.1s ease;
  }
  
  .tab-item:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .tab-item.active {
    border-left: 3px solid #1890ff;
    background-color: #f8f8f8;
  }
  
  .tab-number {
    width: 28px;
    height: 28px;
    background-color: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    color: #888;
    flex-shrink: 0;
  }
  
  .tab-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
  }
  
  .tab-line {
    height: 14px;
    background-color: #e0e0e0;
    border-radius: 2px;
  }
  
  .tab-line.long {
    width: 100%;
  }
  
  .tab-line.medium {
    width: 70%;
  }
  
  .tab-line.short {
    width: 50%;
  }
  </style>