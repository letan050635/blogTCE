<template>
  <AdminLayout>
    <div class="regulations-management">
      <div class="page-header">
        <h1>Quản lý quy định</h1>
        <button @click="openAddForm" class="add-button">+ Thêm quy định mới</button>
      </div>
      
      <AlertMessage v-if="successMessage" :message="successMessage" type="success" />
      <AlertMessage v-if="errorMessage" :message="errorMessage" type="error" />
      
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm quy định..." 
          class="search-input"
          @input="handleSearch"
        />
      </div>
      
      <LoadingSpinner v-if="isLoading" />
      
      <DataTable
        v-else
        :columns="columns"
        :data="regulations"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-change="changePage"
      >
        <template #isNew="{ row }">
          <StatusBadge
            :type="row.isNew ? 'active' : 'inactive'"
            :text="row.isNew ? 'Có' : 'Không'"
          />
        </template>
        
        <template #isImportant="{ row }">
          <StatusBadge
            :type="row.isImportant ? 'important' : 'inactive'"
            :text="row.isImportant ? 'Có' : 'Không'"
          />
        </template>
        
        <template #hasAttachment="{ row }">
          <StatusBadge
            :type="row.hasAttachment ? 'active' : 'inactive'"
            :text="row.hasAttachment ? 'Có' : 'Không'"
          />
        </template>
        
        <template #actions="{ row }">
          <div class="actions">
            <button 
              @click="openEditForm(row)" 
              class="edit-button" 
              title="Sửa"
            >
              Sửa
            </button>
            <button 
              @click="confirmDelete(row)" 
              class="delete-button" 
              title="Xóa"
            >
              Xóa
            </button>
          </div>
        </template>
      </DataTable>
      
      <DialogForm
        :show="showFormDialog"
        :title="isEditing ? 'Sửa quy định' : 'Thêm quy định mới'"
        :submitDisabled="isSubmitting || isUploading"
        :submitText="'Lưu quy định'"
        :loadingText="isUploading ? 'Đang tải file lên...' : 'Đang lưu...'"
        @close="closeFormDialog"
        @submit="debouncedSaveRegulation"
        :large="true"
        :extraLarge="true"
      >
        <div class="form-container">
          <!-- Thông tin cơ bản -->
          <div class="form-section">
            <h3 class="section-title">Thông tin cơ bản</h3>
            
            <div class="form-group">
              <label for="title">Tiêu đề <span class="required">*</span></label>
              <input 
                type="text" 
                id="title" 
                v-model="formData.title" 
                required
                placeholder="Nhập tiêu đề quy định"
              />
            </div>
            
            <div class="form-group">
              <label for="brief">Mô tả ngắn</label>
              <input 
                type="text" 
                id="brief" 
                v-model="formData.brief" 
                placeholder="Nhập mô tả ngắn (hiển thị trong danh sách)"
              />
            </div>
            
            <div class="form-group">
              <label for="content">Nội dung <span class="required">*</span></label>
              <div class="editor-toolbar">
                <button type="button" @click="insertParagraph" class="toolbar-button" title="Thêm đoạn văn mới">
                  ¶
                </button>
                <button type="button" @click="insertBold" class="toolbar-button" title="In đậm">
                  <strong>B</strong>
                </button>
                <button type="button" @click="insertItalic" class="toolbar-button" title="In nghiêng">
                  <em>I</em>
                </button>
                <button type="button" @click="insertUnderline" class="toolbar-button" title="Gạch chân">
                  <u>U</u>
                </button>
                <button type="button" @click="insertBulletList" class="toolbar-button" title="Danh sách">
                  • —
                </button>
                <button type="button" @click="clearFormat" class="toolbar-button" title="Xóa định dạng">
                  Tx
                </button>
              </div>
              <textarea 
                id="content" 
                v-model="formData.content" 
                rows="15" 
                required
                placeholder="Nhập nội dung chi tiết quy định"
                ref="contentTextarea"
                class="editor-textarea"
              ></textarea>
              <div class="editor-preview">
                <label>Xem trước:</label>
                <div v-html="previewContent" class="preview-content"></div>
              </div>
            </div>
          </div>
          
          <!-- Ngày tháng và cài đặt -->
          <div class="form-section">
            <h3 class="section-title">Ngày tháng & Cài đặt</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="date">Ngày đăng <span class="required">*</span></label>
                <input 
                  type="date" 
                  id="date" 
                  v-model="formData.date" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="updateDate">Ngày cập nhật</label>
                <input 
                  type="date" 
                  id="updateDate" 
                  v-model="formData.updateDate" 
                  disabled
                  class="disabled-input"
                />
                <small class="field-help">Tự động cập nhật khi lưu</small>
              </div>
            </div>
            
            <div class="settings-group">
              <div class="form-checkbox">
                <input 
                  type="checkbox" 
                  id="isNew" 
                  v-model="formData.isNew" 
                />
                <label for="isNew">
                  <span class="checkbox-label">Đánh dấu là mới</span>
                  <span class="checkbox-help">Hiển thị nhãn "Mới" trong danh sách</span>
                </label>
              </div>
              
              <div class="form-checkbox">
                <input 
                  type="checkbox" 
                  id="isImportant" 
                  v-model="formData.isImportant" 
                />
                <label for="isImportant">
                  <span class="checkbox-label">Đánh dấu là quan trọng</span>
                  <span class="checkbox-help">Hiển thị trong mục quan trọng</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- File đính kèm -->
          <div class="form-section">
            <h3 class="section-title">File đính kèm</h3>
            
            <div class="form-group">
              <FileUploader
                buttonText="Chọn file để tải lên"
                accept="*/*"
                :maxFiles="5"
                :disabled="isSubmitting || isUploading"
                @files-changed="handleFilesChanged"
                ref="fileUploader"
              />
              <small class="field-help">Tối đa 5 file, mỗi file không quá 5MB</small>
            </div>
            
            <!-- Hiển thị trạng thái upload file -->
            <div v-if="isUploading" class="upload-progress">
              <div class="progress-bar">
                <div 
                  class="progress-bar-inner" 
                  :style="{ width: `${uploadProgress}%` }"
                ></div>
              </div>
              <div class="progress-text">
                Đang tải file lên... {{ uploadProgress }}%
              </div>
            </div>
            
            <!-- Hiển thị danh sách file đính kèm khi chỉnh sửa -->
            <AttachmentsList
              v-if="isEditing && formData.id"
              relatedType="regulation"
              :relatedId="formData.id"
              title="File đính kèm hiện tại"
              :isAdmin="true"
              @attachment-deleted="fetchRegulations"
            />
          </div>
        </div>
      </DialogForm>
      
      <DialogConfirm
        :show="showDeleteDialog"
        title="Xác nhận xóa"
        :message="`Bạn có chắc chắn muốn xóa quy định '${selectedRegulation?.title || ''}'?`"
        warningText="Hành động này không thể hoàn tác!"
        confirmText="Xóa"
        :confirmDisabled="isDeleting"
        loadingText="Đang xóa..."
        @close="closeDeleteDialog"
        @confirm="deleteRegulation"
      />
    </div>
  </AdminLayout>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { debounce } from 'lodash';
import AdminLayout from '@/components/admin/AdminLayout.vue';
import DataTable from '@/components/common/DataTable.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';
import DialogForm from '@/components/common/DialogForm.vue';
import DialogConfirm from '@/components/common/DialogConfirm.vue';
import FileUploader from '@/components/common/FileUploader.vue';
import AttachmentsList from '@/components/common/AttachmentsList.vue';

import regulationsService from '@/services/regulationsService';
import useList from '@/composables/useList';
import useFormDialog from '@/composables/useFormDialog';
import useDeleteDialog from '@/composables/useDeleteDialog';

export default {
  name: 'RegulationsManagementView',
  components: {
    AdminLayout,
    DataTable,
    StatusBadge,
    LoadingSpinner,
    AlertMessage,
    DialogForm,
    DialogConfirm,
    FileUploader,
    AttachmentsList
  },
  setup() {
    const initialFormData = {
      id: null,
      title: '',
      brief: '',
      content: '',
      date: new Date().toISOString().substr(0, 10),
      updateDate: '',
      isNew: true,
      isImportant: false,
      useHtml: true // Luôn set true để hỗ trợ định dạng
    };
    
    const columns = [
      { field: 'id', label: '#', width: '50px' },
      { field: 'title', label: 'Tiêu đề' },
      { field: 'date', label: 'Ngày đăng', width: '120px' },
      { field: 'updateDate', label: 'Cập nhật', width: '120px' },
      { field: 'isNew', label: 'Mới', width: '80px' },
      { field: 'isImportant', label: 'Quan trọng', width: '100px' },
      { field: 'hasAttachment', label: 'File', width: '80px' },
      { field: 'actions', label: 'Thao tác', width: '150px' }
    ];
    
    const selectedFiles = ref([]);
    const fileUploader = ref(null);
    const isUploading = ref(false);
    const uploadProgress = ref(0);
    const contentTextarea = ref(null);
    
    const {
      isLoading,
      data: regulations,
      currentPage,
      totalPages,
      searchQuery,
      errorMessage,
      successMessage,
      fetchData,
      handleSearch,
      changePage,
      showSuccessMessage
    } = useList(regulationsService.getRegulations);
    
    const {
      showDialog: showFormDialog,
      isEditing,
      isSubmitting,
      formData,
      openAddForm: baseOpenAddForm,
      openEditForm: baseOpenEditForm,
      closeDialog: baseCloseDialog,
      submitForm
    } = useFormDialog(initialFormData, {
      create: regulationsService.createRegulation,
      update: regulationsService.updateRegulation
    });
    
    const {
      showDeleteDialog,
      isDeleting,
      selectedItem: selectedRegulation,
      confirmDelete,
      closeDeleteDialog,
      deleteItem
    } = useDeleteDialog(regulationsService.deleteRegulation);
    
    // Preview content computed property
    const previewContent = computed(() => {
      let content = formData.content || '';
      
      // Chuyển đổi các ký tự định dạng đơn giản sang HTML
      content = content.replace(/\n/g, '<br>');
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
      content = content.replace(/__(.*?)__/g, '<u>$1</u>');
      
      // Xử lý danh sách
      content = content.replace(/^• (.*?)$/gm, '<li>$1</li>');
      content = content.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');
      
      return content;
    });

    // Editor functions
    const insertText = (before, after) => {
      const textarea = contentTextarea.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.content;
      const selectedText = text.substring(start, end);
      
      formData.content = text.substring(0, start) + before + selectedText + after + text.substring(end);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      }, 0);
    };

    const insertParagraph = () => {
      insertText('\n\n', '');
    };

    const insertBold = () => {
      insertText('**', '**');
    };

    const insertItalic = () => {
      insertText('*', '*');
    };

    const insertUnderline = () => {
      insertText('__', '__');
    };

    const insertBulletList = () => {
      insertText('\n• ', '');
    };

    const clearFormat = () => {
      const textarea = contentTextarea.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.content;
      const selectedText = text.substring(start, end);
      
      // Remove formatting
      const cleanText = selectedText
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/^• /gm, '');
      
      formData.content = text.substring(0, start) + cleanText + text.substring(end);
    };
    
    const fetchRegulations = async () => {
      await fetchData();
    };
    
    // Mở form thêm mới với reset file và ngày cập nhật
    const openAddForm = () => {
      selectedFiles.value = [];
      if (fileUploader.value) {
        fileUploader.value.clearFiles();
      }
      baseOpenAddForm();
      // Khi thêm mới, không có ngày cập nhật
      formData.updateDate = "";
      // Luôn set useHtml = true
      formData.useHtml = true;
    };
    
    // Đóng form với cleanup
    const closeFormDialog = () => {
      selectedFiles.value = [];
      if (fileUploader.value) {
        fileUploader.value.clearFiles();
      }
      baseCloseDialog();
    };
    
    // Xử lý khi file thay đổi
    const handleFilesChanged = (files) => {
      selectedFiles.value = files;
    };
    
    // Upload file với hiển thị tiến trình
    const uploadFiles = async (regulationId) => {
      if (selectedFiles.value.length === 0) return true;
      
      isUploading.value = true;
      uploadProgress.value = 0;
      
      try {
        await regulationsService.uploadAttachments(
          regulationId, 
          selectedFiles.value,
          (progress) => {
            uploadProgress.value = progress;
          }
        );
        
        // Reset file uploader sau khi upload thành công
        if (fileUploader.value) {
          fileUploader.value.clearFiles();
        }
        selectedFiles.value = [];
        
        return true;
      } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
      } finally {
        isUploading.value = false;
        uploadProgress.value = 0;
      }
    };
    
    // Mở form sửa với xử lý đặc biệt cho dates
    const openEditForm = (regulation) => {
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        // Check if already in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          return dateStr;
        }
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
      };
      
      // Clone regulation để có thể chỉnh sửa trước khi truyền vào
      const editData = { ...regulation };
      editData.date = formatDate(editData.date);
      editData.updateDate = new Date().toISOString().substr(0, 10); // Tự động set ngày cập nhật hiện tại
      // Luôn set useHtml = true
      editData.useHtml = true;
      
      // Reset danh sách file
      selectedFiles.value = [];
      if (fileUploader.value) {
        fileUploader.value.clearFiles();
      }
      
      baseOpenEditForm(editData);
    };
    
    const saveRegulation = async () => {
      try {
        // Format dates for API
        const regulationData = { ...formData };
        
        // Khi thêm mới hoặc sửa, luôn set updateDate là ngày hiện tại
        if (isEditing.value) {
          regulationData.updateDate = new Date().toISOString().substr(0, 10);
        }
        
        // Luôn set useHtml = true
        regulationData.useHtml = true;
        
        // Loại bỏ thời gian từ date nếu có
        if (regulationData.date && regulationData.date.includes('T')) {
          regulationData.date = regulationData.date.split('T')[0];
        }
        if (regulationData.updateDate && regulationData.updateDate.includes('T')) {
          regulationData.updateDate = regulationData.updateDate.split('T')[0];
        }
        
        let regulationId;
        
        if (!isEditing.value) {
          // Tạo mới: lưu quy định trước, sau đó upload files
          const result = await submitForm();
          regulationId = result.regulation.id;
          
          // Upload files nếu có
          if (selectedFiles.value.length > 0) {
            await uploadFiles(regulationId);
          }
        } else {
          // Chỉnh sửa: lưu quy định và upload files đồng thời
          regulationId = formData.id;
          
          // Tạo các promises
          const promises = [];
          
          // Promise lưu quy định
          promises.push(submitForm());
          
          // Promise upload files nếu có
          if (selectedFiles.value.length > 0) {
            promises.push(uploadFiles(regulationId));
          }
          
          // Chờ tất cả hoàn thành
          await Promise.all(promises);
        }
        
        await fetchRegulations();
        showSuccessMessage(
          isEditing.value 
            ? 'Cập nhật quy định thành công!' 
            : 'Thêm quy định mới thành công!'
        );
      } catch (error) {
        console.error('Error saving regulation:', error);
        errorMessage.value = error.message || 'Không thể lưu quy định. Vui lòng thử lại.';
      }
    };
    
    // Debounce để tránh click nhiều lần
    const debouncedSaveRegulation = debounce(saveRegulation, 1000, {
      leading: true,
      trailing: false
    });
    
    const deleteRegulation = async () => {
      try {
        await deleteItem(async () => {
          await fetchRegulations();
          showSuccessMessage('Xóa quy định thành công!');
        });
      } catch (error) {
        console.error('Error deleting regulation:', error);
        errorMessage.value = error.message || 'Không thể xóa quy định. Vui lòng thử lại.';
      }
    };
    
    onMounted(() => {
      fetchRegulations();
    });
    
    return {
      regulations,
      columns,
      isLoading,
      errorMessage,
      successMessage,
      currentPage,
      totalPages,
      searchQuery,
      showFormDialog,
      isEditing,
      isSubmitting,
      formData,
      showDeleteDialog,
      isDeleting,
      selectedRegulation,
      selectedFiles,
      fileUploader,
      isUploading,
      uploadProgress,
      contentTextarea,
      previewContent,
      fetchRegulations,
      changePage,
      handleSearch,
      openAddForm,
      openEditForm,
      closeFormDialog,
      debouncedSaveRegulation,
      confirmDelete,
      closeDeleteDialog,
      deleteRegulation,
      handleFilesChanged,
      insertParagraph,
      insertBold,
      insertItalic,
      insertUnderline,
      insertBulletList,
      clearFormat,
    };
  }
}
</script>

<style scoped>
@import '@/assets/styles/admin.css';
@import '@/assets/styles/form.css';

.form-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  background-color: #f9f9f9;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.section-title {
  margin: 0 0 20px;
  font-size: 20px;
  color: #333;
  border-bottom: 2px solid #0066b3;
  padding-bottom: 10px;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.form-checkbox {
  display: flex;
  align-items: flex-start;
  background-color: white;
  padding: 15px 20px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
}

.form-checkbox:hover {
  border-color: #0066b3;
  box-shadow: 0 2px 4px rgba(0, 102, 179, 0.1);
}

.form-checkbox input[type="checkbox"] {
  margin-right: 12px;
  margin-top: 3px;
  cursor: pointer;
}

.form-checkbox label {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  flex: 1;
}

.checkbox-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  font-size: 16px;
}

.checkbox-help {
  font-size: 14px;
  color: #666;
}

.field-help {
  display: block;
  margin-top: 5px;
  font-size: 14px;
  color: #666;
}

.disabled-input {
  background-color: #f5f5f5 !important;
  cursor: not-allowed !important;
  color: #666 !important;
}

/* Editor styles */
.editor-toolbar {
  display: flex;
  gap: 5px;
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}

.toolbar-button {
  padding: 5px 10px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background-color: #e0e0e0;
  border-color: #999;
}

.toolbar-button:active {
  background-color: #d0d0d0;
}

.editor-textarea {
  width: 100%;
  min-height: 400px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 0 0 4px 4px;
  font-family: 'Courier New', monospace;
  font-size: 15px;
  line-height: 1.6;
  resize: vertical;
}

.editor-preview {
  margin-top: 20px;
  padding: 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.editor-preview label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #666;
}

.preview-content {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  min-height: 100px;
  line-height: 1.6;
}

.preview-content ul {
  padding-left: 20px;
}

.form-group input[type="text"],
.form-group input[type="date"] {
  width: 100%;
  padding: 12px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.upload-progress {
  margin-top: 10px;
  margin-bottom: 20px;
}

.progress-bar {
  height: 10px;
  background-color: #f1f1f1;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  background-color: #0066b3;
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .form-section {
    padding: 15px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .editor-toolbar {
    flex-wrap: wrap;
  }
}
</style>