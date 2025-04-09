<!-- components/common/SearchBar.vue -->
<template>
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        :placeholder="placeholder" 
        class="search-input"
      />
      <button type="button" class="search-button" @click="handleSearch">
        <span>🔍</span>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchBar',
    props: {
      placeholder: {
        type: String,
        default: 'Tìm kiếm...'
      }
    },
    data() {
      return {
        searchQuery: ''
      }
    },
    methods: {
      handleSearch() {
        this.$emit('search', this.searchQuery)
        // Thực hiện tìm kiếm ở đây
        console.log('Searching for:', this.searchQuery)
      }
    }
  }
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: hidden;
  }
  
  .search-input {
    flex-grow: 1;
    height: 100%;
    padding: 0 15px;
    border: none;
    font-size: 14px;
    outline: none;
  }
  
  .search-button {
    width: 50px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #333;
    border: none;
    cursor: pointer;
    color: #fff;
    font-size: 16px;
  }
  
  .search-button:hover {
    background-color: #444;
  }
  </style>