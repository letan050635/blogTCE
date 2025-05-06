<!-- modules/regulations/RegulationsList.vue -->
<template>
  <div class="regulations-container">
    <div class="regulations-header">
      <h2>Nội quy, quy định</h2>
    </div>

    <div class="regulations-toolbar">
      <div class="regulations-filter">
        <select
          v-model="currentFilter"
          class="filter-select"
          :disabled="isLoading"
        >
          <option value="all">Tất cả quy định</option>
          <option value="unread">Chưa đọc</option>
          <option value="read">Đã đọc</option>
        </select>
      </div>
      <div class="regulations-count">
        {{ totalItems }} quy định {{ filterText }}
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải quy định...</p>
    </div>

    <!-- Danh sách quy định -->
    <div v-else class="regulations-content">
      <RegulationItem
        v-for="regulation in regulations"
        :key="regulation.id"
        :regulation="regulation"
        @open-popup="openRegulationPopup"
      />

      <div v-if="regulations.length === 0" class="no-regulations">
        Không tìm thấy quy định {{ filterText }}
      </div>
    </div>

    <!-- Phân trang -->
    <PaginationControl
      v-if="!isLoading && totalPages > 1"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :itemsPerPage="itemsPerPage"
      @page-changed="changePage"
    />

    <!-- Popup quy định -->
    <RegulationPopup
      :regulation="selectedRegulation"
      :isOpen="isPopupOpen"
      @close="closeRegulationPopup"
      @mark-read="markAsRead"
    />

    <!-- Thông báo lỗi -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchRegulations" class="retry-button">Thử lại</button>
    </div>
  </div>
</template>
  
<script>
import RegulationItem from "./RegulationItem";
import RegulationPopup from "./RegulationPopup";
import PaginationControl from "@/components/common/PaginationControl.vue";
import regulationsService from "@/services/regulationsService";
import authService from "@/services/authService"; // Thêm import authService

export default {
  name: "RegulationsList",
  components: {
    RegulationItem,
    RegulationPopup,
    PaginationControl,
  },
  data() {
    return {
      isPopupOpen: false,
      selectedRegulation: {},
      currentFilter: "all",
      currentPage: 1,
      itemsPerPage: 5,
      regulations: [],
      totalItems: 0,
      totalPages: 0,
      isLoading: false,
      error: null,
    };
  },
  computed: {
    filterText() {
      switch (this.currentFilter) {
        case "read":
          return "đã đọc";
        case "unread":
          return "chưa đọc";
        default:
          return "";
      }
    },
    // Thêm computed property để kiểm tra đăng nhập
    isLoggedIn() {
      return authService.isLoggedIn();
    }
  },
  methods: {
    /**
     * Lấy danh sách quy định
     */
    fetchRegulations() {
      this.isLoading = true;
      this.error = null;

      // Chuẩn bị tham số
      const params = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        filter: this.currentFilter === "all" ? null : this.currentFilter,
      };

      // Gọi service
      regulationsService
        .getRegulations(params)
        .then((response) => {
          this.regulations = response.data;
          this.totalItems = response.pagination.total;
          this.totalPages = response.pagination.totalPages;

          // Nếu trang hiện tại lớn hơn tổng số trang, reset về trang 1
          if (this.totalPages > 0 && this.currentPage > this.totalPages) {
            this.currentPage = 1;
            this.fetchRegulations();
          }
        })
        .catch((error) => {
          this.error = "Đã xảy ra lỗi khi tải quy định. Vui lòng thử lại sau.";
          console.error("Error fetching regulations:", error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    openRegulationPopup(regulation) {
      console.log("Opening regulation popup for:", regulation.id);
      
      regulationsService
        .getRegulationById(regulation.id)
        .then((detailedRegulation) => {
          this.selectedRegulation = detailedRegulation;
          this.isPopupOpen = true;
          // Thêm class để ngăn cuộn trang khi popup đang mở
          document.body.classList.add("popup-open");

          console.log("Detailed regulation:", detailedRegulation);
          console.log("Is read:", detailedRegulation.read);
          console.log("Is logged in:", this.isLoggedIn);

          // Tự động đánh dấu là đã đọc khi xem - sửa điều kiện
          if (this.isLoggedIn && !detailedRegulation.read) {
            console.log("Auto marking as read");
            this.markAsRead(detailedRegulation.id);
          }
        })
        .catch((error) => {
          console.error("Error fetching regulation details:", error);
        });
    },

    /**
     * Đóng popup quy định
     */
    closeRegulationPopup() {
      this.isPopupOpen = false;
      // Xóa class để cho phép cuộn trang trở lại bình thường
      document.body.classList.remove("popup-open");
    },

    markAsRead(regulationId) {
      console.log("Marking as read:", regulationId);
      
      if (!this.isLoggedIn) {
        console.log("Not logged in, cannot mark as read");
        return;
      }
      
      regulationsService
        .updateReadStatus(regulationId, true)
        .then(() => {
          console.log("Successfully marked as read");
          // Cập nhật UI
          const regulation = this.regulations.find(
            (r) => r.id === regulationId
          );
          if (regulation) {
            regulation.read = true;
          }
          
          // Cập nhật selectedRegulation nếu đang xem
          if (this.selectedRegulation.id === regulationId) {
            this.selectedRegulation.read = true;
          }

          // Tải lại danh sách nếu đang lọc theo trạng thái đọc
          if (this.currentFilter !== "all") {
            this.fetchRegulations();
          }
        })
        .catch((error) => {
          console.error("Error marking regulation as read:", error);
        });
    },

    /**
     * Chuyển trang
     */
    changePage(page) {
      if (this.currentPage !== page) {
        this.currentPage = page;
        this.fetchRegulations();
      }
    },
  },
  watch: {
    // Tải lại dữ liệu khi thay đổi bộ lọc
    currentFilter() {
      this.currentPage = 1;
      this.fetchRegulations();
    },
  },
  mounted() {
    // Tải danh sách quy định khi component được tạo
    this.fetchRegulations();
  },
};
</script>
  
<style scoped>
.regulations-container {
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.regulations-header {
  background-color: #0066b3;
  color: #fff;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.regulations-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.regulations-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.filter-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

.filter-select:disabled {
  background-color: #f1f1f1;
  cursor: not-allowed;
}

.regulations-count {
  font-size: 13px;
  color: #666;
}

.regulations-content {
  padding: 0;
  max-height: 600px;
  overflow-y: auto;
}

.no-regulations {
  padding: 20px;
  text-align: center;
  color: #777;
  font-style: italic;
}

/* Loading spinner */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  background-color: #f9f9f9;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff7f00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-container p {
  color: #666;
  font-size: 14px;
}

/* Error message */
.error-message {
  padding: 20px;
  background-color: #ffebee;
  color: #d32f2f;
  text-align: center;
  border-top: 1px solid #ffcdd2;
}

.retry-button {
  margin-top: 10px;
  background-color: #ff7f00;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #ff6b00;
}

@media screen and (max-width: 768px) {
  .regulations-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .regulations-toolbar {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .filter-select {
    width: 100%;
  }
}
</style>
  
<style>
/* Ngăn cuộn trang khi popup đang mở */
body.popup-open {
  overflow: hidden;
}

/* Tùy chỉnh thanh cuộn cho regulations-content */
.regulations-content::-webkit-scrollbar {
  width: 6px;
}

.regulations-content::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

.regulations-content::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.regulations-content::-webkit-scrollbar-thumb:hover {
  background-color: #aaa;
}
</style>