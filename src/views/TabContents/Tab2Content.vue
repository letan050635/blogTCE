<!-- components/TabContents/Tab2Content.vue - Nội dung Tab 2 -->
<template>
    <div class="tab-content-container">
      <h2 class="tab-heading">Nội dung Tab 2</h2>
      <p class="tab-description">Tab 2 hiển thị danh sách sản phẩm</p>
      
      <div class="search-sort-bar">
        <div class="search-box">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." />
        </div>
        <div class="sort-dropdown">
          <select>
            <option>Sắp xếp theo tên (A-Z)</option>
            <option>Sắp xếp theo tên (Z-A)</option>
            <option>Giá: Thấp đến cao</option>
            <option>Giá: Cao đến thấp</option>
          </select>
        </div>
      </div>
      
      <div class="products-grid">
        <div class="product-card" v-for="i in 6" :key="i">
          <div class="product-image"></div>
          <div class="product-info">
            <div class="product-name">Sản phẩm {{ i }}</div>
            <div class="product-price">${{ 20 * i }}.00</div>
            <div class="product-rating">
              <span v-for="j in 5" :key="j" class="star">★</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="pagination">
        <div class="page-button active">1</div>
        <div class="page-button">2</div>
        <div class="page-button">3</div>
        <div class="page-button">...</div>
        <div class="page-button">10</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Tab2Content'
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
  
  .search-sort-bar {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .search-box {
    flex: 1;
  }
  
  .search-box input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .sort-dropdown select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .product-card {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .product-image {
    height: 150px;
    background-color: #f0f0f0;
  }
  
  .product-info {
    padding: 15px;
  }
  
  .product-name {
    font-weight: 500;
    margin-bottom: 5px;
  }
  
  .product-price {
    color: #e91e63;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .product-rating {
    color: #ffc107;
    font-size: 0.9rem;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  .page-button {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background-color: #f0f0f0;
    cursor: pointer;
  }
  
  .page-button.active {
    background-color: #007bff;
    color: white;
  }
  </style>