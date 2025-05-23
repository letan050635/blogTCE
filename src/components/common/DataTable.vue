<template>
    <div class="data-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="(column, index) in columns" :key="index" :style="{ width: column.width || 'auto' }" @click="$emit('sort', column.field)" style="cursor:pointer; user-select:none;">
              {{ column.label }}
              <span v-if="sortBy === column.field">
                <span v-if="sortOrder === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in data" :key="rowIndex">
            <td v-for="(column, colIndex) in columns" :key="colIndex">
              <slot :name="column.field" :row="row" :index="rowIndex">
                {{ row[column.field] }}
              </slot>
            </td>
          </tr>
          <tr v-if="data.length === 0">
            <td :colspan="columns.length" class="no-data">
              <slot name="no-data">Không có dữ liệu</slot>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="showPagination && totalPages > 1" class="pagination">
        <button 
          class="pagination-button" 
          :disabled="currentPage === 1"
          @click="$emit('page-change', currentPage - 1)"
        >
          Trước
        </button>
        
        <span class="page-info">Trang {{ currentPage }}/{{ totalPages }}</span>
        
        <button 
          class="pagination-button" 
          :disabled="currentPage === totalPages"
          @click="$emit('page-change', currentPage + 1)"
        >
          Sau
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DataTable',
    props: {
      columns: {
        type: Array,
        required: true
      },
      data: {
        type: Array,
        default: () => []
      },
      currentPage: {
        type: Number,
        default: 1
      },
      totalPages: {
        type: Number,
        default: 1
      },
      showPagination: {
        type: Boolean,
        default: true
      },
      sortBy: {
        type: String,
        default: ''
      },
      sortOrder: {
        type: String,
        default: 'asc'
      }
    }
  }
  </script>
  
  <style scoped>
  .data-table-container {
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .data-table th,
  .data-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .data-table th {
    background-color: #f5f5f5;
    font-weight: 500;
    color: #333;
  }
  
  .data-table tbody tr:hover {
    background-color: #f9f9f9;
  }
  
  .no-data {
    text-align: center;
    color: #888;
    font-style: italic;
    padding: 20px 0;
  }
  
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-top: 1px solid #f0f0f0;
  }
  
  .pagination-button {
    padding: 5px 10px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .pagination-button:disabled {
    background-color: #f0f0f0;
    color: #bbb;
    cursor: not-allowed;
  }
  
  .pagination-button:not(:disabled):hover {
    background-color: #e0e0e0;
  }
  
  .page-info {
    color: #666;
    font-size: 14px;
  }
  </style>