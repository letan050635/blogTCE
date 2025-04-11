<!-- components/common/PaginationControl.vue -->
<template>
    <div class="pagination-container" v-if="totalPages > 1">
      <div class="pagination-controls">
        <button 
          class="pagination-button" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          &laquo;
        </button>
        
        <button 
          v-for="page in displayedPages" 
          :key="page"
          class="pagination-button" 
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        
        <button 
          class="pagination-button" 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          &raquo;
        </button>
      </div>
      
      <div class="pagination-info">
        {{ startItem }}-{{ endItem }} / {{ totalItems }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PaginationControl',
    props: {
      currentPage: {
        type: Number,
        required: true
      },
      totalItems: {
        type: Number,
        required: true
      },
      itemsPerPage: {
        type: Number,
        default: 5
      },
      visiblePages: {
        type: Number,
        default: 5
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
      },
      displayedPages() {
        const halfVisible = Math.floor(this.visiblePages / 2);
        let start = Math.max(this.currentPage - halfVisible, 1);
        let end = Math.min(start + this.visiblePages - 1, this.totalPages);
        
        // Điều chỉnh start nếu cần thiết
        if (end - start + 1 < this.visiblePages) {
          start = Math.max(end - this.visiblePages + 1, 1);
        }
        
        const pages = [];
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        return pages;
      },
      startItem() {
        return (this.currentPage - 1) * this.itemsPerPage + 1;
      },
      endItem() {
        return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
      }
    },
    methods: {
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.$emit('page-changed', page);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    padding: 10px 0;
    border-top: 1px solid #eee;
  }
  
  .pagination-controls {
    display: flex;
    align-items: center;
  }
  
  .pagination-button {
    background-color: #fff;
    border: 1px solid #ddd;
    color: #0066b3;
    padding: 6px 12px;
    margin: 0 3px;
    cursor: pointer;
    border-radius: 3px;
    font-size: 14px;
    transition: all 0.2s;
  }
  
  .pagination-button:hover:not(:disabled) {
    background-color: #f0f0f0;
  }
  
  .pagination-button.active {
    background-color: #0066b3;
    color: #fff;
    border-color: #0066b3;
  }
  
  .pagination-button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  
  .pagination-info {
    font-size: 13px;
    color: #666;
  }
  
  @media screen and (max-width: 768px) {
    .pagination-container {
      flex-direction: column;
      gap: 10px;
    }
    
    .pagination-info {
      order: -1;
    }
  }
  </style>