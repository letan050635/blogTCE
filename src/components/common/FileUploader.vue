<template>
  <div class="file-uploader">
    <div class="upload-container">
      <label :for="inputId" class="upload-button">
        <span class="upload-icon">+</span>
        {{ buttonText }}
      </label>
      <input 
        :id="inputId" 
        ref="fileInput"
        type="file" 
        multiple 
        :accept="accept" 
        @change="handleFileChange" 
        class="file-input"
        :disabled="disabled"
      />
    </div>
    
    <div v-if="files.length > 0" class="file-list">
      <div v-for="(file, index) in files" :key="`${file.name}-${index}`" class="file-item">
        <div class="file-info">
          <div class="file-name">{{ file.name }}</div>
          <div class="file-size">{{ formatFileSize(file.size) }}</div>
        </div>
        <button 
          type="button" 
          class="remove-file" 
          @click="removeFile(index)"
          :disabled="disabled"
        >
          &times;
        </button>
      </div>
    </div>
    
    <div v-if="error" class="upload-error">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileUploader',
  props: {
    buttonText: {
      type: String,
      default: 'Chọn file để tải lên'
    },
    accept: {
      type: String,
      default: '*/*'
    },
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024 // 5MB by default
    },
    maxFiles: {
      type: Number,
      default: 5
    },
    inputId: {
      type: String,
      default: () => `file-upload-${Date.now()}` // Generate unique ID
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      files: [],
      error: null
    };
  },
  methods: {
    handleFileChange(event) {
      this.error = null;
      const newFiles = Array.from(event.target.files);
      
      // Reset file list cũ trước khi thêm mới để tránh duplicate
      this.files = [];
      
      // Kiểm tra số lượng file
      if (newFiles.length > this.maxFiles) {
        this.error = `Chỉ được phép tải lên tối đa ${this.maxFiles} file`;
        event.target.value = '';
        return;
      }
      
      // Kiểm tra duplicate file names trong batch hiện tại
      const fileNames = new Set();
      for (const file of newFiles) {
        if (fileNames.has(file.name)) {
          this.error = `File trùng lặp trong lần chọn: ${file.name}`;
          event.target.value = '';
          return;
        }
        fileNames.add(file.name);
      }
      
      // Kiểm tra kích thước và loại file
      const validFiles = [];
      
      for (const file of newFiles) {
        if (file.size > this.maxSize) {
          this.error = `File "${file.name}" vượt quá kích thước cho phép (${this.formatFileSize(this.maxSize)})`;
          event.target.value = '';
          return;
        }
        
        if (this.accept !== '*/*' && !this.isFileTypeAllowed(file)) {
          this.error = `File "${file.name}" không đúng định dạng cho phép`;
          event.target.value = '';
          return;
        }
        
        validFiles.push(file);
      }
      
      // Thêm files vào danh sách
      this.files = validFiles;
      
      // Emit event CHỈ MỘT LẦN với tất cả files
      this.$emit('files-changed', this.files);
      
      // Reset input value để có thể chọn lại cùng file
      event.target.value = '';
    },
    
    isFileTypeAllowed(file) {
      if (this.accept === '*/*') return true;
      
      const fileType = file.type;
      const acceptTypes = this.accept.split(',').map(type => type.trim());
      
      return acceptTypes.some(type => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return fileType.startsWith(category + '/');
        }
        return type === fileType;
      });
    },
    
    removeFile(index) {
      this.files.splice(index, 1);
      this.$emit('files-changed', this.files);
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    clearFiles() {
      this.files = [];
      this.error = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
      this.$emit('files-changed', this.files);
    }
  },
  beforeUnmount() {
    // Cleanup khi component bị destroy
    this.clearFiles();
  }
}
</script>

<style scoped>
.file-uploader {
  margin-bottom: 20px;
}

.upload-container {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.upload-button {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.upload-button:hover {
  background-color: #e9e9e9;
  border-color: #aaa;
}

.upload-icon {
  font-size: 18px;
  margin-right: 8px;
}

.file-input {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
}

.file-list {
  margin-top: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.file-item:last-child {
  border-bottom: none;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

.remove-file {
  background: none;
  border: none;
  color: #f44336;
  font-size: 18px;
  cursor: pointer;
  padding: 0 5px;
}

.remove-file:hover {
  color: #d32f2f;
}

.remove-file:disabled {
  color: #ffccbc;
  cursor: not-allowed;
}

.upload-error {
  margin-top: 8px;
  color: #f44336;
  font-size: 12px;
}
</style>