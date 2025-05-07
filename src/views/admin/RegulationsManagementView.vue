<!-- views/admin/RegulationsManagementView.vue -->
<template>
  <AdminLayout>
    <div class="regulations-management">
      <div class="page-header">
        <h1>Quản lý quy định</h1>
        <button @click="openAddForm" class="add-button">+ Thêm quy định mới</button>
      </div>
      
      <!-- Thông báo lỗi/thành công -->
      <div v-if="successMessage" class="alert success">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert error">
        {{ errorMessage }}
      </div>
      
      <!-- Tìm kiếm -->
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm quy định..." 
          class="search-input"
          @input="handleSearch"
        />
      </div>
      
      <!-- Loading trạng thái -->
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
      
      <!-- Bảng dữ liệu -->
      <div v-else class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 50px">#</th>
              <th>Tiêu đề</th>
              <th style="width: 120px">Ngày đăng</th>
              <th style="width: 80px">Mới</th>
              <th style="width: 80px">Quan trọng</th>
              <th style="width: 150px">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="regulation in regulations" :key="regulation.id">
              <td>{{ regulation.id }}</td>
              <td>{{ regulation.title }}</td>
              <td>{{ regulation.date }}</td>
              <td>
                <span 
                  class="status-badge" 
                  :class="regulation.isNew ? 'status-active' : 'status-inactive'"
                >
                  {{ regulation.isNew ? 'Có' : 'Không' }}
                </span>
              </td>
              <td>
                <span 
                  class="status-badge" 
                  :class="regulation.isImportant ? 'status-important' : 'status-inactive'"
                >
                  {{ regulation.isImportant ? 'Có' : 'Không' }}
                </span>
              </td>
              <td class="actions">
                <button 
                  @click="openEditForm(regulation)" 
                  class="edit-button" 
                  title="Sửa"
                >
                  Sửa
                </button>
                <button 
                  @click="confirmDelete(regulation)" 
                  class="delete-button" 
                  title="Xóa"
                >
                  Xóa
                </button>
              </td>
            </tr>
            <tr v-if="regulations.length === 0">
              <td colspan="6" class="no-data">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Phân trang -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            class="pagination-button" 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Trước
          </button>
          
          <span class="page-info">Trang {{ currentPage }}/{{ totalPages }}</span>
          
          <button 
            class="pagination-button" 
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Sau
          </button>
        </div>
      </div>
      
      <!-- Dialog thêm/sửa quy định -->
      <div v-if="showFormDialog" class="dialog-overlay" @click="closeFormDialog">
        <div class="dialog-content" @click.stop>
          <div class="dialog-header">
            <h2>{{ isEditing ? 'Sửa quy định' : 'Thêm quy định mới' }}</h2>
            <button @click="closeFormDialog" class="close-button">&times;</button>
          </div>
          
          <form @submit.prevent="saveRegulation" class="regulation-form">
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
                placeholder="Nhập mô tả ngắn"
              />
            </div>
            
            <div class="form-group">
              <label for="content">Nội dung <span class="required">*</span></label>
              <textarea 
                id="content" 
                v-model="formData.content" 
                rows="10" 
                required
                placeholder="Nhập nội dung quy định"
              ></textarea>
            </div>
            
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
                />
              </div>
            </div>
            
            <div class="form-row checkbox-group">
              <div class="form-group form-checkbox">
                <input 
                  type="checkbox" 
                  id="isNew" 
                  v-model="formData.isNew" 
                />
                <label for="isNew">Đánh dấu là mới</label>
              </div>
              
              <div class="form-group form-checkbox">
                <input 
                  type="checkbox" 
                  id="isImportant" 
                  v-model="formData.isImportant" 
                />
                <label for="isImportant">Đánh dấu là quan trọng</label>
              </div>
              
              <div class="form-group form-checkbox">
                <input 
                  type="checkbox" 
                  id="useHtml" 
                  v-model="formData.useHtml" 
                />
                <label for="useHtml">Sử dụng HTML</label>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" @click="closeFormDialog" class="cancel-button">Hủy</button>
              <button type="submit" class="save-button" :disabled="isSubmitting">
                <span v-if="isSubmitting">Đang lưu...</span>
                <span v-else>Lưu quy định</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Dialog xác nhận xóa -->
      <div v-if="showDeleteDialog" class="dialog-overlay" @click="closeDeleteDialog">
        <div class="dialog-content delete-dialog" @click.stop>
          <div class="dialog-header">
            <h2>Xác nhận xóa</h2>
            <button @click="closeDeleteDialog" class="close-button">&times;</button>
          </div>
          
          <div class="dialog-body">
            <p>Bạn có chắc chắn muốn xóa quy định <strong>"{{ selectedRegulation.title }}"</strong>?</p>
            <p class="warning">Hành động này không thể hoàn tác!</p>
          </div>
          
          <div class="dialog-actions">
            <button @click="closeDeleteDialog" class="cancel-button">Hủy</button>
            <button @click="deleteRegulation" class="delete-button" :disabled="isSubmitting">
              <span v-if="isSubmitting">Đang xóa...</span>
              <span v-else>Xóa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import AdminLayout from '@/components/admin/AdminLayout.vue';
import regulationsService from '@/services/regulationsService';

export default {
  name: 'RegulationsManagementView',
  components: {
    AdminLayout
  },
  setup() {
    // State
    const regulations = ref([]);
    const isLoading = ref(true);
    const errorMessage = ref('');
    const successMessage = ref('');
    const currentPage = ref(1);
    const totalPages = ref(1);
    const searchQuery = ref('');
    const searchTimeout = ref(null);
    
    // Form state
    const showFormDialog = ref(false);
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const formData = reactive({
      id: null,
      title: '',
      brief: '',
      content: '',
      date: new Date().toISOString().substr(0, 10),
      updateDate: '',
      isNew: true,
      isImportant: false,
      useHtml: true
    });
    
    // Delete dialog state
    const showDeleteDialog = ref(false);
    const selectedRegulation = ref({});
    
    // Utility function to format dates
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
    
    // Format dates for API
    const formatDateForApi = (dateStr) => {
      if (!dateStr) return null;
      return dateStr; // API expects YYYY-MM-DD
    };
    
    // Fetch regulations
    const fetchRegulations = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      
      try {
        const result = await regulationsService.getRegulations({
          page: currentPage.value,
          limit: 10,
          search: searchQuery.value || undefined
        });
        
        // Validate response data
        if (result && result.data) {
          regulations.value = result.data;
          totalPages.value = result.pagination ? result.pagination.totalPages : 1;
          
          // If current page is greater than total pages, reset to page 1
          if (currentPage.value > totalPages.value && totalPages.value > 0) {
            currentPage.value = 1;
            fetchRegulations();
          }
        } else {
          console.error('Invalid data format:', result);
          errorMessage.value = 'Định dạng dữ liệu không hợp lệ';
          regulations.value = [];
          totalPages.value = 1;
        }
      } catch (error) {
        console.error('Error fetching regulations:', error);
        errorMessage.value = `Không thể tải danh sách quy định: ${error.message || 'Vui lòng thử lại sau'}`;
        regulations.value = [];
        totalPages.value = 1;
      } finally {
        isLoading.value = false;
      }
    };
    
    // Handle pagination
    const changePage = (page) => {
      currentPage.value = page;
      fetchRegulations();
    };
    
    // Handle search
    const handleSearch = () => {
      // Debounce search
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      
      searchTimeout.value = setTimeout(() => {
        currentPage.value = 1; // Reset to first page
        fetchRegulations();
      }, 300);
    };
    
    // Form functions
    const resetForm = () => {
      formData.id = null;
      formData.title = '';
      formData.brief = '';
      formData.content = '';
      formData.date = new Date().toISOString().substr(0, 10);
      formData.updateDate = '';
      formData.isNew = true;
      formData.isImportant = false;
      formData.useHtml = true;
    };
    
    const openAddForm = () => {
      resetForm();
      isEditing.value = false;
      showFormDialog.value = true;
    };
    
    const openEditForm = (regulation) => {
      isEditing.value = true;
      
      // Fill form with regulation data
      formData.id = regulation.id;
      formData.title = regulation.title || '';
      formData.brief = regulation.brief || '';
      formData.content = regulation.content || '';
      formData.date = formatDate(regulation.date);
      formData.updateDate = regulation.updateDate ? formatDate(regulation.updateDate) : '';
      formData.isNew = !!regulation.isNew;
      formData.isImportant = !!regulation.isImportant;
      formData.useHtml = regulation.useHtml !== false; // Default to true if not specified
      
      showFormDialog.value = true;
    };
    
    const closeFormDialog = () => {
      showFormDialog.value = false;
    };
    
    const saveRegulation = async () => {
      isSubmitting.value = true;
      errorMessage.value = '';
      successMessage.value = '';
      
      try {
        const regulationData = {
          title: formData.title,
          brief: formData.brief || '',
          content: formData.content,
          date: formatDateForApi(formData.date),
          updateDate: formData.updateDate ? formatDateForApi(formData.updateDate) : null,
          isNew: formData.isNew,
          isImportant: formData.isImportant,
          useHtml: formData.useHtml
        };
        
        if (isEditing.value) {
          // Update existing regulation
          await regulationsService.updateRegulation(formData.id, regulationData);
          successMessage.value = 'Cập nhật quy định thành công!';
        } else {
          // Create new regulation
          await regulationsService.createRegulation(regulationData);
          successMessage.value = 'Thêm quy định mới thành công!';
        }
        
        // Close dialog and refresh list
        closeFormDialog();
        fetchRegulations();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);
      } catch (error) {
        console.error('Error saving regulation:', error);
        errorMessage.value = `Không thể lưu quy định: ${error.message || 'Vui lòng thử lại'}`;
      } finally {
        isSubmitting.value = false;
      }
    };
    
    // Delete functions
    const confirmDelete = (regulation) => {
      selectedRegulation.value = regulation;
      showDeleteDialog.value = true;
    };
    
    const closeDeleteDialog = () => {
      showDeleteDialog.value = false;
    };
    
    const deleteRegulation = async () => {
      isSubmitting.value = true;
      errorMessage.value = '';
      successMessage.value = '';
      
      try {
        await regulationsService.deleteRegulation(selectedRegulation.value.id);
        
        // Close dialog and refresh list
        closeDeleteDialog();
        fetchRegulations();
        
        successMessage.value = 'Xóa quy định thành công!';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);
      } catch (error) {
        console.error('Error deleting regulation:', error);
        errorMessage.value = `Không thể xóa quy định: ${error.message || 'Vui lòng thử lại'}`;
      } finally {
        isSubmitting.value = false;
      }
    };
    
    // Lifecycle hooks
    onMounted(() => {
      fetchRegulations();
    });
    
    return {
      regulations,
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
      selectedRegulation,
      fetchRegulations,
      changePage,
      handleSearch,
      openAddForm,
      openEditForm,
      closeFormDialog,
      saveRegulation,
      confirmDelete,
      closeDeleteDialog,
      deleteRegulation
    };
  }
}
</script>

<style scoped>
.regulations-management {
  position: relative;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.add-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #3e8e41;
}

.alert {
  padding: 10px 15px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.alert.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.alert.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.search-container {
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #0066b3;
  box-shadow: 0 0 0 2px rgba(0, 102, 179, 0.1);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066b3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.data-table-container {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: 500;
  color: #333;
}

.data-table tbody tr:hover {
  background-color: #f9f9f9;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-inactive {
  background-color: #f5f5f5;
  color: #757575;
}

.status-important {
  background-color: #ffebee;
  color: #c62828;
}

.actions {
  display: flex;
  gap: 5px;
}

.edit-button,
.delete-button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button {
  background-color: #0066b3;
  color: white;
}

.edit-button:hover {
  background-color: #004e8c;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover:not(:disabled) {
  background-color: #d32f2f;
}

.delete-button:disabled {
  background-color: #ffccbc;
  cursor: not-allowed;
}

.no-data {
  text-align: center;
  color: #888;
  font-style: italic;
  padding: 20px 0;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #f0f0f0;
}

.pagination-button {
  padding: 5px 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-button:disabled {
  background-color: #f0f0f0;
  color: #bbb;
  cursor: not-allowed;
}

.pagination-button:not(:disabled):hover {
  background-color: #e0e0e0;
}

.page-info {
  color: #666;
  font-size: 14px;
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
  max-width: 80%;
  width: 80vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: dialog-fade-in 0.2s;
}

.delete-dialog {
  width: 400px;
}

@keyframes dialog-fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.dialog-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
}

.dialog-body {
  padding: 20px;
}

.dialog-body .warning {
  color: #f44336;
  font-weight: 500;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

/* Form styles */
.regulation-form {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0066b3;
  box-shadow: 0 0 0 2px rgba(0, 102, 179, 0.1);
}

.form-checkbox {
  display: flex;
  align-items: center;
}

.form-checkbox input[type="checkbox"] {
  margin-right: 8px;
}

.checkbox-group {
  gap: 30px;
}

.required {
  color: #f44336;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button,
.save-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.save-button {
  background-color: #0066b3;
  color: white;
  border: none;
}

.save-button:hover:not(:disabled) {
  background-color: #004e8c;
}

.save-button:disabled {
  background-color: #b0bec5;
  cursor: not-allowed;
}

@media screen and (max-width: 768px) {
  .dialog-content {
    max-width: 95%;
    width: 95%;
  }
  
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .edit-button, 
  .delete-button {
    width: 100%;
  }
}
</style>