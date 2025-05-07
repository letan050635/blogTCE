<template>
    <div class="file-upload">
      <div class="upload-container">
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleFileChange" 
          class="file-input"
          :accept="acceptedTypes"
          :disabled="disabled"
        />
        <button 
          type="button" 
          class="select-button" 
          @click="selectFile"
          :disabled="disabled"
        >
          {{ buttonText }}
        </button>
        <span v-if="selectedFile" class="file-name">{{ selectedFile.name }}</span>
      </div>
      
      <div v-if="error" class="upload-error">
        {{ error }}
      </div>
      
      <div v-if="isUploading" class="upload-progress">
        <div class="spinner"></div>
        <span>Đang tải lên...</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FileUpload',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      buttonText: {
        type: String,
        default: 'Chọn file'
      },
      acceptedTypes: {
        type: String,
        default: "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
      }
    },
    data() {
      return {
        selectedFile: null,
        error: null,
        isUploading: false
      }
    },
    methods: {
      selectFile() {
        this.$refs.fileInput.click();
      },
      handleFileChange(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Kiểm tra kích thước file (10MB)
        if (file.size > 10 * 1024 * 1024) {
          this.error = 'File quá lớn. Kích thước tối đa là 10MB.';
          this.selectedFile = null;
          this.$refs.fileInput.value = '';
          return;
        }
        
        this.error = null;
        this.selectedFile = file;
        this.$emit('file-selected', file);
      },
      async uploadFile(relatedType, relatedId) {
        if (!this.selectedFile) {
          this.error = 'Vui lòng chọn file trước khi tải lên';
          return null;
        }
        
        this.isUploading = true;
        this.error = null;
        
        try {
          const formData = new FormData();
          formData.append('file', this.selectedFile);
          formData.append('relatedType', relatedType);
          formData.append('relatedId', relatedId);
          
          const response = await this.$http.post('/api/files/upload', formData);
          return response.data.file;
        } catch (error) {
          console.error('Error uploading file:', error);
          this.error = error.response?.data?.message || 'Lỗi khi tải file lên';
          return null;
        } finally {
          this.isUploading = false;
        }
      },
      reset() {
        this.selectedFile = null;
        this.error = null;
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .file-upload {
    margin-bottom: 15px;
  }
  
  .upload-container {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .file-input {
    display: none;
  }
  
  .select-button {
    background-color: #0066b3;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }
  
  .select-button:hover:not(:disabled) {
    background-color: #004e8c;
  }
  
  .select-button:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
  }
  
  .file-name {
    margin-left: 10px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  
  .upload-error {
    color: #d32f2f;
    font-size: 12px;
    margin-top: 5px;
  }
  
  .upload-progress {
    display: flex;
    align-items: center;
    margin-top: 5px;
  }
  
  .spinner {
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
  </style>