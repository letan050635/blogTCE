<!-- components/TabContents/Tab3Content.vue - Nội dung Tab 3 -->
<template>
    <div class="tab-content-container">
      <h2 class="tab-heading">Nội dung Tab 3</h2>
      <p class="tab-description">Tab 3 hiển thị biểu đồ phân tích dữ liệu</p>
      
      <div class="chart-filters">
        <div class="filter-item">
          <label>Khoảng thời gian:</label>
          <select>
            <option>7 ngày qua</option>
            <option>30 ngày qua</option>
            <option>3 tháng qua</option>
            <option>1 năm qua</option>
          </select>
        </div>
        
        <div class="filter-item">
          <label>Chỉ số:</label>
          <select>
            <option>Doanh thu</option>
            <option>Lợi nhuận</option>
            <option>Người dùng mới</option>
            <option>Tất cả</option>
          </select>
        </div>
      </div>
      
      <div class="chart-container">
        <div class="chart-placeholder">
          <div class="chart-y-axis">
            <div>100%</div>
            <div>75%</div>
            <div>50%</div>
            <div>25%</div>
            <div>0%</div>
          </div>
          <div class="chart-bars">
            <div class="chart-bar" v-for="i in 7" :key="i">
              <div class="bar-value" :style="{ height: (70 - i * 5 + Math.random() * 20) + '%' }"></div>
              <div class="bar-label">Ngày {{ i }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="kpi-summary">
        <div class="kpi-card">
          <div class="kpi-title">Doanh thu</div>
          <div class="kpi-value">$12,345</div>
          <div class="kpi-trend positive">+12.3%</div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-title">Lợi nhuận</div>
          <div class="kpi-value">$5,432</div>
          <div class="kpi-trend positive">+8.7%</div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-title">Người dùng mới</div>
          <div class="kpi-value">432</div>
          <div class="kpi-trend negative">-2.5%</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Tab3Content'
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
  
  .chart-filters {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
  }
  
  .filter-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .filter-item select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
  }
  
  .chart-container {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    height: 300px;
    margin-bottom: 20px;
  }
  
  .chart-placeholder {
    display: flex;
    height: 100%;
  }
  
  .chart-y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 15px;
    color: #888;
    font-size: 0.8rem;
  }
  
  .chart-bars {
    display: flex;
    flex: 1;
    align-items: flex-end;
    justify-content: space-around;
    height: 100%;
    padding-top: 20px;
  }
  
  .chart-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40px;
  }
  
  .bar-value {
    width: 30px;
    background-color: #4caf50;
    border-radius: 4px 4px 0 0;
    margin-bottom: 10px;
  }
  
  .bar-label {
    font-size: 0.8rem;
    color: #888;
  }
  
  .kpi-summary {
    display: flex;
    gap: 20px;
  }
  
  .kpi-card {
    flex: 1;
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .kpi-title {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 5px;
  }
  
  .kpi-value {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .kpi-trend {
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .kpi-trend.positive {
    color: #4caf50;
  }
  
  .kpi-trend.negative {
    color: #f44336;
  }
  </style>