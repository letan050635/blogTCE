<!-- views/admin/RegulationsManagementView.vue -->
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
        :submitDisabled="isSubmitting"
        :submitText="'Lưu quy định'"
        :loadingText="'Đang lưu...'"
        @close="closeFormDialog"
        @submit="saveRegulation"
      >
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
        
        <!-- Thêm phần upload file -->
        <div class="form-group">
          <label>File đính kèm</label>
          <FileUploader
            buttonText="Chọn file để tải lên"
            accept="*/*"
            :disabled="isSubmitting"
            @files-changed="handleFilesChanged"
          />
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
// eslint-disable-next-line no-unused-vars
import { ref, reactive, onMounted } from 'vue';
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
import axios from 'axios';

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
      useHtml: true
    };
    
    const columns = [
      { field: 'id', label: '#', width: '50px' },
      { field: 'title', label: 'Tiêu đề' },
      { field: 'date', label: 'Ngày đăng', width: '120px' },
      { field: 'isNew', label: 'Mới', width: '80px' },
      { field: 'isImportant', label: 'Quan trọng', width: '80px' },
      { field: 'hasAttachment', label: 'File', width: '80px' },
      { field: 'actions', label: 'Thao tác', width: '150px' }
    ];
    
    const selectedFiles = ref([]);
    
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
      openAddForm,
      openEditForm: baseOpenEditForm,
      closeDialog: closeFormDialog,
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
    
    const fetchRegulations = async () => {
      await fetchData();
    };
    
    // Xử lý khi file thay đổi
    const handleFilesChanged = (files) => {
      selectedFiles.value = files;
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
      editData.updateDate = editData.updateDate ? formatDate(editData.updateDate) : '';
      
      // Reset danh sách file
      selectedFiles.value = [];
      
      baseOpenEditForm(editData);
    };
    
    const saveRegulation = async () => {
      try {
        // Format dates for API
        const regulationData = { ...formData };
        
        // Loại bỏ thời gian từ date nếu có
        if (regulationData.date && regulationData.date.includes('T')) {
          regulationData.date = regulationData.date.split('T')[0];
        }
        if (regulationData.updateDate && regulationData.updateDate.includes('T')) {
          regulationData.updateDate = regulationData.updateDate.split('T')[0];
        }
        
        const result = await submitForm(regulationData);
        
        // Sau khi lưu quy định, upload file nếu có
        if (selectedFiles.value.length > 0) {
          const fileFormData = new FormData();
          fileFormData.append('relatedType', 'regulation');
          fileFormData.append('relatedId', isEditing.value ? formData.id : result.regulation.id);
          
          selectedFiles.value.forEach(file => {
            fileFormData.append('files', file);
          });
          
          await axios.post('/api/files/upload', fileFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
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
      fetchRegulations,
      changePage,
      handleSearch,
      openAddForm,
      openEditForm,
      closeFormDialog,
      saveRegulation,
      confirmDelete,
      closeDeleteDialog,
      deleteRegulation,
      handleFilesChanged
    };
  }
}
</script>

<style scoped>
@import '@/assets/styles/admin.css';
@import '@/assets/styles/form.css';
</style>