<template>
  <div class="attachments-list">
    <h4 v-if="title" class="attachments-title">{{ title }}</h4>
    <div v-if="isLoading" class="loading-attachments">
      <div class="spinner-small"></div>
      <span>Đang tải file đính kèm...</span>
    </div>
    <div v-else-if="attachments.length === 0" class="no-attachments">
      {{ noAttachmentsText }}
    </div>
    <ul v-else class="attachments">
      <li v-for="attachment in attachments" :key="attachment.id" class="attachment-item">
        <div class="attachment-icon" :class="getFileTypeClass(attachment.fileType)">
          <span class="icon-text">{{ getFileTypeIcon(attachment.fileType) }}</span>
        </div>
        <div class="attachment-details">
          <div class="attachment-name">{{ attachment.fileName }}</div>
          <div class="attachment-size">{{ formatFileSize(attachment.fileSize) }}</div>
        </div>
        <div class="attachment-actions">
          <a :href="attachment.viewLink" target="_blank" class="action-button view-button" title="Xem">
            <span>👁️</span>
          </a>
          <a :href="attachment.downloadLink" class="action-button download-button" title="Tải xuống">
            <span>⬇️</span>
          </a>
          <button 
            v-if="isAdmin" 
            @click="deleteAttachment(attachment.id)" 
            class="action-button delete-button" 
            title="Xóa"
            :disabled="isDeleting === attachment.id"
          >
            <span v-if="isDeleting === attachment.id">🕓</span>
            <span v-else>🗑️</span>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import apiClient from '@/services/apiClient';

export default {
  name: 'AttachmentsList',
  props: {
    relatedType: {
      type: String,
      required: true,
      validator: (value) => ['notification', 'regulation'].includes(value)
    },
    relatedId: {
      type: [String, Number],
      required: true
    },
    title: {
      type: String,
      default: 'File đính kèm'
    },
    noAttachmentsText: {
      type: String,
      default: 'Không có file đính kèm'
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      attachments: [],
      isLoading: true,
      isDeleting: null
    };
  },
  mounted() {
    this.fetchAttachments();
  },
  watch: {
    relatedId() {
      this.fetchAttachments();
    }
  },
  methods: {
    async fetchAttachments() {
      this.isLoading = true;
      
      try {
        const response = await apiClient.get(`/files/${this.relatedType}/${this.relatedId}`);
        this.attachments = response.data;
      } catch (error) {
        console.error('Error fetching attachments:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async deleteAttachment(id) {
      if (this.isDeleting) return;
      
      this.isDeleting = id;
      
      try {
        await apiClient.delete(`/files/${id}`);
        this.attachments = this.attachments.filter(att => att.id !== id);
        this.$emit('attachment-deleted', id);
      } catch (error) {
        console.error('Error deleting attachment:', error);
      } finally {
        this.isDeleting = null;
      }
    },
    
    formatFileSize(bytes) {
      if (!bytes) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    getFileTypeClass(mimeType) {
      if (!mimeType) return 'file-other';
      
      if (mimeType.startsWith('image/')) return 'file-image';
      if (mimeType.startsWith('video/')) return 'file-video';
      if (mimeType.startsWith('audio/')) return 'file-audio';
      
      if (mimeType.includes('pdf')) return 'file-pdf';
      if (mimeType.includes('word') || mimeType.includes('document')) return 'file-doc';
      if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'file-xls';
      if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'file-ppt';
      
      return 'file-other';
    },
    
    getFileTypeIcon(mimeType) {
      if (!mimeType) return '📄';
      
      if (mimeType.startsWith('image/')) return '🖼️';
      if (mimeType.startsWith('video/')) return '🎬';
      if (mimeType.startsWith('audio/')) return '🎵';
      
      if (mimeType.includes('pdf')) return 'PDF';
      if (mimeType.includes('word') || mimeType.includes('document')) return 'DOC';
      if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'XLS';
      if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PPT';
      
      return '📄';
    }
  }
}
</script>

<style scoped>
.attachments-list {
  margin-top: 20px;
}

.attachments-title {
  margin: 0 0 10px;
  font-size: 16px;
  color: #333;
}

.loading-attachments {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #0066b3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-attachments {
  color: #888;
  font-style: italic;
  font-size: 14px;
}

.attachments {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
  transition: background-color 0.2s;
}

.attachment-item:last-child {
  border-bottom: none;
}

.attachment-item:hover {
  background-color: #f0f0f0;
}

.attachment-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
  font-weight: 500;
  font-size: 14px;
}

.file-image { background-color: #4CAF50; }
.file-video { background-color: #9C27B0; }
.file-audio { background-color: #2196F3; }
.file-pdf { background-color: #F44336; }
.file-doc { background-color: #2196F3; }
.file-xls { background-color: #4CAF50; }
.file-ppt { background-color: #FF5722; }
.file-other { background-color: #607D8B; }

.attachment-details {
  flex: 1;
  min-width: 0;
}

.attachment-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
  margin-bottom: 2px;
}

.attachment-size {
  font-size: 12px;
  color: #888;
}

.attachment-actions {
  display: flex;
  gap: 5px;
}

.action-button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  text-decoration: none;
}

.view-button:hover {
  color: #0066b3;
}

.download-button:hover {
  color: #4CAF50;
}

.delete-button:hover:not(:disabled) {
  color: #F44336;
}

.delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>