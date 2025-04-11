<!-- modules/notifications/NotificationSearch.vue -->
<template>
  <div class="notification-search">
    <form @submit.prevent="submitSearch">
      <div class="search-input-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          class="search-input" 
          placeholder="Tìm kiếm thông báo..." 
          :disabled="disabled"
        />
        <button 
          v-if="searchQuery" 
          type="button"
          class="clear-search" 
          @click="clearSearch"
          :disabled="disabled"
        >
          &times;
        </button>
        <span class="search-icon">🔍</span>
      </div>
    </form>
    
    <div class="search-options" v-if="showOptions">
      <div class="search-option">
        <label>
          <input 
            type="checkbox" 
            v-model="searchInContent" 
            :disabled="disabled"
          >
          Tìm trong nội dung
        </label>
      </div>
      
      <div class="search-date-range">
        <div class="date-input">
          <label>Từ:</label>
          <input 
            type="date" 
            v-model="fromDate" 
            :disabled="disabled"
          >
        </div>
        <div class="date-input">
          <label>Đến:</label>
          <input 
            type="date" 
            v-model="toDate" 
            :disabled="disabled"
          >
        </div>
      </div>
    </div>
    
    <button 
      class="toggle-options-button" 
      @click="toggleOptions"
      :disabled="disabled"
    >
      {{ showOptions ? 'Ẩn tùy chọn' : 'Tùy chọn tìm kiếm' }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'NotificationSearch',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchQuery: '',
      searchInContent: false,
      fromDate: '',
      toDate: '',
      showOptions: false
    }
  },
  methods: {
    submitSearch() {
      // Không xử lý nếu đang disabled
      if (this.disabled) return;
      
      this.$emit('search', {
        query: this.searchQuery,
        searchInContent: this.searchInContent,
        fromDate: this.fromDate,
        toDate: this.toDate
      });
    },
    clearSearch() {
      if (this.disabled) return;
      
      this.searchQuery = '';
      // Gửi sự kiện tìm kiếm khi xóa để reset về ban đầu
      this.submitSearch();
    },
    toggleOptions() {
      if (this.disabled) return;
      
      this.showOptions = !this.showOptions;
    },
    reset() {
      this.searchQuery = '';
      this.searchInContent = false;
      this.fromDate = '';
      this.toDate = '';
      this.showOptions = false;
    }
  }
}
</script>

<style scoped>
.notification-search {
  padding: 15px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px 35px 10px 35px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 15px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus:not(:disabled) {
  outline: none;
  border-color: #0066b3;
  box-shadow: 0 0 0 2px rgba(0, 102, 179, 0.2);
}

.search-input:disabled {
  background-color: #f1f1f1;
  cursor: not-allowed;
}

.search-icon {
  position: absolute;
  left: 10px;
  color: #666;
  font-size: 16px;
  opacity: 0.8;
}

.clear-search {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.clear-search:hover:not(:disabled) {
  color: #666;
}

.clear-search:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-options-button {
  margin-top: 10px;
  background: none;
  border: none;
  color: #0066b3;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}

.toggle-options-button:disabled {
  color: #999;
  cursor: not-allowed;
}

.search-options {
  margin-top: 15px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 5px;
  animation: slideDown 0.3s ease;
}

.search-option {
  margin-bottom: 10px;
}

.search-option label {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}

.search-option input[type="checkbox"] {
  margin-right: 8px;
}

.search-option input[type="checkbox"]:disabled + span {
  color: #999;
}

.search-date-range {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.date-input {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.date-input label {
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.date-input input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.date-input input:disabled {
  background-color: #f1f1f1;
  cursor: not-allowed;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media screen and (max-width: 768px) {
  .search-date-range {
    flex-direction: column;
    gap: 10px;
  }
}
</style>