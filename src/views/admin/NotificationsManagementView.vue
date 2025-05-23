<template>
  <AdminLayout>
    <div class="notifications-management">
      <div class="page-header">
        <h1>Quản lý thông báo</h1>
        <button @click="openAddForm" class="add-button">
          + Thêm thông báo mới
        </button>
      </div>

      <AlertMessage
        v-if="successMessage"
        :message="successMessage"
        type="success"
      />
      <AlertMessage v-if="errorMessage" :message="errorMessage" type="error" />

      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm thông báo..."
          class="search-input"
          @input="handleSearch"
        />
      </div>

      <LoadingSpinner v-if="isLoading" />

      <DataTable
        v-else
        :columns="columns"
        :data="getSortedNotifications"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :sortBy="sortBy"
        :sortOrder="sortOrder"
        @page-change="changePage"
        @sort="handleSort"
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
            <button @click="openEditForm(row)" class="edit-button" title="Sửa">
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
        :title="isEditing ? 'Sửa thông báo' : 'Thêm thông báo mới'"
        :submitDisabled="isSubmitting || isUploading"
        :submitText="'Lưu thông báo'"
        :loadingText="isUploading ? 'Đang tải file lên...' : 'Đang lưu...'"
        @close="closeFormDialog"
        @submit="debouncedSaveNotification"
        large
      >
        <div class="form-group">
          <label for="title">Tiêu đề <span class="required">*</span></label>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            required
            placeholder="Nhập tiêu đề thông báo"
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
          <RichTextEditor
            v-model="formData.content"
            :min-height="400"
            placeholder="Nhập nội dung thông báo..."
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date">Ngày đăng <span class="required">*</span></label>
            <input type="date" id="date" v-model="formData.date" required />
          </div>

          <div class="form-group">
            <label for="updateDate">Ngày cập nhật</label>
            <input type="date" id="updateDate" v-model="formData.updateDate" />
          </div>
        </div>

        <div class="form-row checkbox-group">
          <div class="form-group form-checkbox">
            <input type="checkbox" id="isNew" v-model="formData.isNew" />
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
        </div>

        <!-- File upload section -->
        <div class="form-group">
          <label>File đính kèm</label>
          <FileUploader
            buttonText="Chọn file để tải lên"
            accept="*/*"
            :maxFiles="5"
            :disabled="isSubmitting || isUploading"
            @files-changed="handleFilesChanged"
            ref="fileUploader"
          />
        </div>
        
        <!-- Upload progress -->
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

        <!-- Current attachments when editing -->
        <AttachmentsList
          v-if="isEditing && formData.id"
          relatedType="notification"
          :relatedId="formData.id"
          title="File đính kèm hiện tại"
          :isAdmin="true"
          @attachment-deleted="fetchNotifications"
        />
      </DialogForm>

      <DialogConfirm
        :show="showDeleteDialog"
        title="Xác nhận xóa"
        :message="`Bạn có chắc chắn muốn xóa thông báo '${
          selectedNotification?.title || ''
        }'?`"
        warningText="Hành động này không thể hoàn tác!"
        confirmText="Xóa"
        :confirmDisabled="isDeleting"
        loadingText="Đang xóa..."
        @close="closeDeleteDialog"
        @confirm="deleteNotification"
      />
    </div>
  </AdminLayout>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { debounce } from 'lodash';
import AdminLayout from "@/components/admin/AdminLayout.vue";
import DataTable from "@/components/common/DataTable.vue";
import StatusBadge from "@/components/common/StatusBadge.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import AlertMessage from "@/components/common/AlertMessage.vue";
import DialogForm from "@/components/common/DialogForm.vue";
import DialogConfirm from "@/components/common/DialogConfirm.vue";
import FileUploader from "@/components/common/FileUploader.vue";
import AttachmentsList from "@/components/common/AttachmentsList.vue";
import RichTextEditor from "@/components/admin/RichTextEditor.vue";

import notificationService from "@/services/notificationService";
import useList from "@/composables/useList";
import useFormDialog from "@/composables/useFormDialog";
import useDeleteDialog from "@/composables/useDeleteDialog";

export default {
  name: "NotificationsManagementView",
  components: {
    AdminLayout,
    DataTable,
    StatusBadge,
    LoadingSpinner,
    AlertMessage,
    DialogForm,
    DialogConfirm,
    FileUploader,
    AttachmentsList,
    RichTextEditor
  },
  setup() {
    const initialFormData = {
      id: null,
      title: "",
      brief: "",
      content: "",
      date: new Date().toISOString().substr(0, 10),
      updateDate: "",
      isNew: true,
      isImportant: false,
      useHtml: true // Always true when using editor
    };

    const columns = [
      { field: "id", label: "#", width: "50px" },
      { field: "title", label: "Tiêu đề" },
      { field: "date", label: "Ngày đăng", width: "120px" },
      { field: "isNew", label: "Mới", width: "80px" },
      { field: "isImportant", label: "Quan trọng", width: "80px" },
      { field: "hasAttachment", label: "File", width: "80px" },
      { field: "actions", label: "Thao tác", width: "150px" },
    ];

    const selectedFiles = ref([]);
    const fileUploader = ref(null);
    const isUploading = ref(false);
    const uploadProgress = ref(0);

    const {
      isLoading,
      data: notifications,
      currentPage,
      totalPages,
      searchQuery,
      errorMessage,
      successMessage,
      fetchData,
      handleSearch,
      changePage,
      showSuccessMessage,
    } = useList(notificationService.getNotifications);

    const {
      showDialog: showFormDialog,
      isEditing,
      isSubmitting,
      formData,
      openAddForm: baseOpenAddForm,
      openEditForm: baseOpenEditForm,
      closeDialog: baseCloseDialog,
      submitForm,
    } = useFormDialog(initialFormData, {
      create: notificationService.createNotification,
      update: notificationService.updateNotification,
    });

    const {
      showDeleteDialog,
      isDeleting,
      selectedItem: selectedNotification,
      confirmDelete,
      closeDeleteDialog,
      deleteItem,
    } = useDeleteDialog(notificationService.deleteNotification);

    const fetchNotifications = async () => {
      await fetchData();
    };

    const openAddForm = () => {
      selectedFiles.value = [];
      if (fileUploader.value) {
        fileUploader.value.clearFiles();
      }
      baseOpenAddForm();
    };

    const closeFormDialog = () => {
      selectedFiles.value = [];
      if (fileUploader.value) {
        fileUploader.value.clearFiles();
      }
      baseCloseDialog();
    };

    const handleFilesChanged = (files) => {
      selectedFiles.value = files;
    };

    const uploadFiles = async (notificationId) => {
      if (selectedFiles.value.length === 0) return true;
      
      isUploading.value = true;
      uploadProgress.value = 0;
      
      try {
        await notificationService.uploadAttachments(
          notificationId, 
          selectedFiles.value,
          (progress) => {
            uploadProgress.value = progress;
          }
        );
        
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

    const openEditForm = (notification) => {
      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          return dateStr;
        }
        const parts = dateStr.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
      };
      
      const editData = { ...notification };
      editData.isNew = Boolean(editData.isNew);
      editData.isImportant = Boolean(editData.isImportant);
      editData.date = formatDate(editData.date);
      editData.updateDate = editData.updateDate ? formatDate(editData.updateDate) : '';
      
      selectedFiles.value = [];
      if (fileUploader.value) {
        fileUploader.value.clearFiles();
      }
      
      baseOpenEditForm(editData);
    };

    const saveNotification = async () => {
      try {
        // Validate content
        if (!formData.content || formData.content === '<p><br></p>') {
          errorMessage.value = 'Nội dung không được để trống';
          return;
        }

        const notificationData = { ...formData };
        // Đảm bảo các trường boolean được chuyển đổi đúng
        notificationData.isNew = Boolean(notificationData.isNew);
        notificationData.isImportant = Boolean(notificationData.isImportant);
        notificationData.useHtml = true; // Always use HTML with editor
        
        if (notificationData.date && notificationData.date.includes('T')) {
          notificationData.date = notificationData.date.split('T')[0];
        }
        if (notificationData.updateDate && notificationData.updateDate.includes('T')) {
          notificationData.updateDate = notificationData.updateDate.split('T')[0];
        }

        let notificationId;
        
        if (!isEditing.value) {
          const result = await submitForm();
          notificationId = result.notification.id;
          
          if (selectedFiles.value.length > 0) {
            await uploadFiles(notificationId);
          }
        } else {
          notificationId = formData.id;
          
          const promises = [];
          promises.push(submitForm());
          
          if (selectedFiles.value.length > 0) {
            promises.push(uploadFiles(notificationId));
          }
          
          await Promise.all(promises);
        }
        
        await fetchNotifications();
        showSuccessMessage(
          isEditing.value
            ? "Cập nhật thông báo thành công!"
            : "Thêm thông báo mới thành công!"
        );
      } catch (error) {
        console.error("Error saving notification:", error);
        errorMessage.value = error.message || "Không thể lưu thông báo. Vui lòng thử lại.";
      }
    };

    const debouncedSaveNotification = debounce(saveNotification, 1000, {
      leading: true,
      trailing: false
    });

    const deleteNotification = async () => {
      try {
        await deleteItem(async () => {
          await fetchNotifications();
          showSuccessMessage("Xóa thông báo thành công!");
        });
      } catch (error) {
        console.error("Error deleting notification:", error);
        errorMessage.value =
          error.message || "Không thể xóa thông báo. Vui lòng thử lại.";
      }
    };

    const sortBy = ref('');
    const sortOrder = ref('asc');

    const handleSort = (field) => {
      if (!['id', 'title', 'date'].includes(field)) return;
      if (sortBy.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy.value = field;
        sortOrder.value = 'asc';
      }
    };

    const getSortedNotifications = computed(() => {
      if (!sortBy.value) return notifications.value;
      return [...notifications.value].sort((a, b) => {
        let valA = a[sortBy.value];
        let valB = b[sortBy.value];
        // So sánh số hoặc ngày
        if (sortBy.value === 'id') {
          valA = Number(valA);
          valB = Number(valB);
        }
        if (sortBy.value === 'date') {
          valA = new Date(valA);
          valB = new Date(valB);
        }
        if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
      });
    });

    onMounted(() => {
      fetchNotifications();
    });

    return {
      notifications,
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
      selectedNotification,
      selectedFiles,
      fileUploader,
      isUploading,
      uploadProgress,
      fetchNotifications,
      changePage,
      handleSearch,
      openAddForm,
      openEditForm,
      closeFormDialog,
      debouncedSaveNotification,
      confirmDelete,
      closeDeleteDialog,
      deleteNotification,
      handleFilesChanged,
      sortBy,
      sortOrder,
      handleSort,
      getSortedNotifications,
    };
  },
};
</script>

<style scoped>
@import "@/assets/styles/admin.css";
@import "@/assets/styles/form.css";

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

/* Custom styles for editor form */
.dialog-form .form-group label {
  font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 500;
}

.dialog-form input,
.dialog-form textarea {
  font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}

.checkbox-group {
  flex-wrap: wrap;
  gap: 20px;
}

.form-checkbox label {
  font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}
</style>