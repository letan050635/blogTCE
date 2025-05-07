<template>
  <div class="file-list">
    <h4 v-if="showTitle">File đính kèm</h4>

    <div v-if="files.length === 0" class="no-files">Không có file đính kèm</div>

    <ul v-else class="files-container">
      <li v-for="file in files" :key="file.id" class="file-item">
        <div class="file-info">
          <div class="file-icon">
            <template v-if="file.fileType && file.fileType.includes('image/')">
              <img
                v-if="file.thumbnailLink"
                :src="file.thumbnailLink"
                :alt="file.fileName"
                class="thumbnail"
              />
              <span v-else class="icon-placeholder">🖼️</span>
            </template>
            <template
              v-else-if="file.fileType && file.fileType.includes('pdf')"
            >
              <span class="icon-placeholder">📄</span>
            </template>
            <template
              v-else-if="
                file.fileType &&
                (file.fileType.includes('word') ||
                  file.fileType.includes('document'))
              "
            >
              <span class="icon-placeholder">📝</span>
            </template>
            <template
              v-else-if="file.fileType && file.fileType.includes('excel')"
            >
              <span class="icon-placeholder">📊</span>
            </template>
            <template
              v-else-if="
                file.fileType && file.fileType.includes('presentation')
              "
            >
              <span class="icon-placeholder">📊</span>
            </template>
            <template v-else>
              <span class="icon-placeholder">📂</span>
            </template>
          </div>

          <div class="file-details">
            <div class="file-name">{{ file.fileName }}</div>
            <div class="file-meta">
              <span>{{ formatFileSize(file.fileSize) }}</span>
              <span class="file-type">{{
                getFileTypeLabel(file.fileType)
              }}</span>
            </div>
          </div>
        </div>

        <div class="file-actions">
          <a
            :href="file.viewLink"
            target="_blank"
            class="action-button view-button"
            title="Xem file"
          >
            Xem
          </a>
          <a
            :href="file.downloadLink"
            class="action-button download-button"
            title="Tải xuống"
          >
            Tải
          </a>
          <button
            v-if="showDelete"
            @click="confirmDelete(file)"
            class="action-button delete-button"
            title="Xóa file"
          >
            Xóa
          </button>
        </div>
      </li>
    </ul>

    <!-- Dialog xác nhận xóa -->
    <div v-if="showDeleteDialog" class="dialog-overlay" @click="cancelDelete">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>Xác nhận xóa</h3>
          <button class="close-button" @click="cancelDelete">&times;</button>
        </div>
        <div class="dialog-body">
          <p>
            Bạn có chắc chắn muốn xóa file
            <strong>{{ selectedFile && selectedFile.fileName }}</strong
            >?
          </p>
          <p class="warning">Hành động này không thể hoàn tác!</p>
        </div>
        <div class="dialog-actions">
          <button class="cancel-button" @click="cancelDelete">Hủy</button>
          <button
            class="confirm-button"
            @click="deleteFile"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting">Đang xóa...</span>
            <span v-else>Xóa</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FileList",
  props: {
    files: {
      type: Array,
      default: () => [],
    },
    showDelete: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showDeleteDialog: false,
      selectedFile: null,
      isDeleting: false,
    };
  },
  methods: {
    formatFileSize(bytes) {
      if (!bytes) return "Không xác định";

      const units = ["B", "KB", "MB", "GB"];
      let size = parseInt(bytes, 10);
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }

      return `${size.toFixed(1)} ${units[unitIndex]}`;
    },

    getFileTypeLabel(mimeType) {
      if (!mimeType) return "Không xác định";

      if (mimeType.includes("image/")) {
        return "Ảnh";
      } else if (mimeType.includes("pdf")) {
        return "PDF";
      } else if (mimeType.includes("word") || mimeType.includes("document")) {
        return "Word";
      } else if (
        mimeType.includes("excel") ||
        mimeType.includes("spreadsheet")
      ) {
        return "Excel";
      } else if (
        mimeType.includes("presentation") ||
        mimeType.includes("powerpoint")
      ) {
        return "PowerPoint";
      } else if (mimeType.includes("text/")) {
        return "Văn bản";
      }

      return "File";
    },

    confirmDelete(file) {
      this.selectedFile = file;
      this.showDeleteDialog = true;
    },

    cancelDelete() {
      this.showDeleteDialog = false;
      this.selectedFile = null;
    },

    async deleteFile() {
      if (!this.selectedFile) return;

      this.isDeleting = true;

      try {
        await axios.delete(`/api/files/${this.selectedFile.id}`);

        // Thông báo thành công
        this.$emit("file-deleted", this.selectedFile);

        // Đóng dialog
        this.cancelDelete();
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Không thể xóa file. Vui lòng thử lại sau.");
      } finally {
        this.isDeleting = false;
      }
    },
  },
};
</script>

<style scoped>
.file-list {
  margin-bottom: 20px;
}

.file-list h4 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.no-files {
  color: #777;
  font-style: italic;
  padding: 10px 0;
}

.files-container {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: #f9f9f9;
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.file-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.thumbnail {
  max-width: 100%;
  max-height: 100%;
  border-radius: 3px;
}

.icon-placeholder {
  font-size: 24px;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #777;
}

.file-type {
  margin-left: 8px;
  background-color: #eee;
  padding: 2px 6px;
  border-radius: 3px;
}

.file-actions {
  display: flex;
  gap: 5px;
  margin-left: 10px;
}

.action-button {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
}

.view-button {
  background-color: #0066b3;
  color: white;
  border: none;
}

.view-button:hover {
  background-color: #004e8c;
}

.download-button {
  background-color: #4caf50;
  color: white;
  border: none;
}

.download-button:hover {
  background-color: #3e8e41;
}

.delete-button {
  background-color: #f44336;
  color: white;
  border: none;
}

.delete-button:hover:not(:disabled) {
  background-color: #d32f2f;
}

.delete-button:disabled {
  background-color: #ffccbc;
  cursor: not-allowed;
}

/* Dialog styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: white;
  border-radius: 6px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #777;
  cursor: pointer;
}

.dialog-body {
  padding: 20px;
}

.warning {
  color: #f44336;
  font-weight: 500;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid #eee;
  gap: 10px;
}

.cancel-button,
.confirm-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.confirm-button {
  background-color: #f44336;
  color: white;
  border: none;
}

.confirm-button:hover:not(:disabled) {
  background-color: #d32f2f;
}

.confirm-button:disabled {
  background-color: #ffccbc;
  cursor: not-allowed;
}

@media screen and (max-width: 768px) {
  .file-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .file-actions {
    margin-left: 0;
    margin-top: 10px;
    align-self: flex-end;
  }
}
</style>