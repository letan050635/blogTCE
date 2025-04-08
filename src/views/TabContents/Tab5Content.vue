<!-- components/TabContents/Tab5Content.vue - Nội dung Tab 5 -->
<template>
    <div class="tab-content-container">
      <h2 class="tab-heading">Nội dung Tab 5</h2>
      <p class="tab-description">Tab 5 hiển thị bảng dữ liệu và tác vụ</p>
      
      <div class="table-actions">
        <div class="table-search">
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
        
        <div class="table-tools">
          <button class="tool-button">
            <span class="icon">↓</span> Xuất dữ liệu
          </button>
          <button class="tool-button primary">
            <span class="icon">+</span> Thêm mới
          </button>
        </div>
      </div>
      
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th class="checkbox-column">
                <input type="checkbox" />
              </th>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th class="action-column">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 5" :key="i">
              <td class="checkbox-column">
                <input type="checkbox" />
              </td>
              <td>#{{ 1000 + i }}</td>
              <td>Người dùng {{ i }}</td>
              <td>user{{ i }}@example.com</td>
              <td>
                <span :class="['role-badge', i % 2 === 0 ? 'admin' : 'user']">
                  {{ i % 2 === 0 ? 'Admin' : 'User' }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', i % 3 === 0 ? 'inactive' : 'active']">
                  {{ i % 3 === 0 ? 'Không hoạt động' : 'Hoạt động' }}
                </span>
              </td>
              <td>{{ new Date(2023, i-1, i*3).toLocaleDateString() }}</td>
              <td class="action-column">
                <div class="action-buttons">
                  <button class="action-button edit">✎</button>
                  <button class="action-button delete">×</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="table-pagination">
        <div class="pagination-info">Hiển thị 1-5 trên tổng số 25 mục</div>
        <div class="pagination-controls">
          <button class="page-control" disabled>&laquo;</button>
          <button class="page-control active">1</button>
          <button class="page-control">2</button>
          <button class="page-control">3</button>
          <button class="page-control">4</button>
          <button class="page-control">5</button>
          <button class="page-control">&raquo;</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Tab5Content'
  }
  </script>
  
  <style scoped>
  .tab-content-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .tab-heading {
    font-size: 1.5rem;
    margin-bottom: 5px;
    color: #333;
  }
  
  .tab-description {
    color: #666;
    margin-bottom: 20px;
  }
  
  .table-actions {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  .table-search input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 250px;
  }
  
  .table-tools {
    display: flex;
    gap: 10px;
  }
  
  .tool-button {
    display: flex;
    align-items: center;
    padding: 8px 15px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .tool-button.primary {
    background-color: #1890ff;
    border-color: #1890ff;
    color: white;
  }
  
  .icon {
    margin-right: 5px;
  }
  
  .data-table-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
    border-bottom: 1px solid #eee;
  }
  
  .data-table th {
    background-color: #f9f9f9;
    font-weight: 500;
  }
  
  .checkbox-column {
    width: 40px;
    text-align: center;
  }
  
  .action-column {
    width: 100px;
    text-align: center;
  }
  
  .role-badge,
  .status-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.85rem;
  }
  
  .role-badge.admin {
    background-color: #e6f7ff;
    color: #1890ff;
  }
  
  .role-badge.user {
    background-color: #f6ffed;
    color: #52c41a;
  }
  
  .status-badge.active {
    background-color: #f6ffed;
    color: #52c41a;
  }
  
  .status-badge.inactive {
    background-color: #fff1f0;
    color: #f5222d;
  }
  
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  
  .action-button.edit {
    background-color: #e6f7ff;
    color: #1890ff;
  }
  
  .action-button.delete {
    background-color: #fff1f0;
    color: #f5222d;
  }
  
  .table-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: white;
    border-top: 1px solid #eee;
  }
  
  .pagination-info {
    color: #666;
  }
  
  .pagination-controls {
    display: flex;
    gap: 5px;
  }
  
  .page-control {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #d9d9d9;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .page-control:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
  
  .page-control.active {
    border-color: #1890ff;
    background-color: #1890ff;
    color: white;
  }
  
  .page-control:disabled {
    color: #d9d9d9;
    cursor: not-allowed;
  }
  </style>