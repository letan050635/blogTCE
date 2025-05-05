<!-- src/views/RegulationsView.vue -->
<template>
  <div class="regulations-view">
    <div class="container">
      <div class="content-wrapper">
        <!-- Phần nội dung chính -->
        <div class="main-content">
          <RegulationsList />
        </div>
        <!-- Sidebar bên phải - chỉ giữ lại phần quy định quan trọng -->
        <div class="sidebar">
          <div class="sidebar-widget">
            <h3>Quy định quan trọng</h3>
            <ul class="important-regulations">
              <li
                v-for="regulation in importantRegulations"
                :key="regulation.id"
              >
                <a href="#" @click.prevent="openRegulation(regulation)">
                  {{ regulation.title }}
                  <span v-if="regulation.isNew" class="badge new-badge"
                    >Mới</span
                  >
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Popup xem quy định -->
    <RegulationPopup
      :regulation="selectedRegulation"
      :isOpen="isPopupOpen"
      @close="closeRegulationPopup"
      @mark-read="markAsRead"
    />
  </div>
</template>
  
  <script>
import RegulationsList from "@/modules/regulations/RegulationsList.vue";
import RegulationPopup from "@/modules/regulations/RegulationPopup.vue";
import regulationsService from "@/services/regulationsService";

export default {
  name: "RegulationsView",
  components: {
    RegulationsList,
    RegulationPopup,
  },
  data() {
    return {
      importantRegulations: [],
      isPopupOpen: false,
      selectedRegulation: {},
    };
  },
  methods: {
    fetchImportantRegulations() {
      regulationsService
        .getRegulations()
        .then((response) => {
          this.importantRegulations = response.data
            .filter((regulation) => regulation.isImportant)
            .slice(0, 5);
        })
        .catch((error) => {
          console.error("Error fetching important regulations:", error);
        });
    },

    openRegulation(regulation) {
      regulationsService
        .getRegulationById(regulation.id)
        .then((detailedRegulation) => {
          this.selectedRegulation = detailedRegulation;
          this.isPopupOpen = true;
          // Thêm class để ngăn cuộn trang khi popup đang mở
          document.body.classList.add("popup-open");

          // Tự động đánh dấu là đã đọc nếu chưa đọc
          if (!detailedRegulation.read && this.$store.getters.isLoggedIn) {
            this.markAsRead(regulation.id);
          }
        })
        .catch((error) => {
          console.error("Error fetching regulation details:", error);
        });
    },

    closeRegulationPopup() {
      this.isPopupOpen = false;
      // Xóa class để cho phép cuộn trang trở lại bình thường
      document.body.classList.remove("popup-open");
    },

    /**
     * Đánh dấu quy định đã đọc
     */
    markAsRead(regulationId) {
      regulationsService
        .updateReadStatus(regulationId, true)
        .then(() => {
          // Cập nhật UI
          if (this.selectedRegulation.id === regulationId) {
            this.selectedRegulation.read = true;
          }

          // Đóng popup
          this.closeRegulationPopup();

          // Làm mới danh sách quy định quan trọng
          this.fetchImportantRegulations();
        })
        .catch((error) => {
          console.error("Error marking regulation as read:", error);
        });
    },
  },
  mounted() {
    // Lấy danh sách quy định quan trọng khi component được tạo
    this.fetchImportantRegulations();
  },
};
</script>
  
  <style scoped>
.regulations-view {
  margin: 20px 0;
}

.sidebar-widget {
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.sidebar-widget h3 {
  background-color: #ff7f00;
  color: #fff;
  margin: 0;
  padding: 12px 15px;
  font-size: 16px;
  font-weight: 500;
}

.important-regulations {
  list-style: none;
  padding: 0;
  margin: 0;
}

.important-regulations li {
  border-bottom: 1px solid #eee;
}

.important-regulations li:last-child {
  border-bottom: none;
}

.important-regulations a {
  display: block;
  padding: 12px 15px;
  color: #0066b3;
  text-decoration: none;
  transition: background-color 0.2s;
  font-size: 14px;
  position: relative;
}

.important-regulations a:hover {
  background-color: #f5f5f5;
  color: #ff7f00;
}

.badge {
  display: inline-block;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 3px;
  margin-left: 5px;
  vertical-align: middle;
}

.new-badge {
  background-color: #ff5722;
  color: #fff;
}

.guide-content {
  padding: 15px;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

.guide-content p {
  margin: 0 0 10px;
}

.guide-content ol {
  margin: 0 0 15px;
  padding-left: 20px;
}

.guide-content li {
  margin-bottom: 8px;
}

.guide-content strong {
  color: #333;
}

@media screen and (max-width: 768px) {
  .sidebar-widget {
    margin-top: 20px;
  }
}
</style>