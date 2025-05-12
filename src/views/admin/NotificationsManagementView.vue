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
        :data="notifications"
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
        @submit="saveNotification"
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
          <textarea
            id="content"
            v-model="formData.content"
            rows="10"
            required
            placeholder="Nhập nội dung thông báo"
          ></textarea>
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

          <div class="form-group form-checkbox">
            <input type="checkbox" id="useHtml" v-model="formData.useHtml" />
            <label for="useHtml">Sử dụng HTML</label>
          </div>
        </div>

        <!-- Thêm phần upload file -->
        <div class="form-group">
          <label>File đính kèm</label>
          <FileUploader
            buttonText="Chọn file để tải lên"
            accept="*/*"
            :disabled="isSubmitting || isUploading"
            @files-changed="handleFilesChanged"
            ref="fileUploader"
          />
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
import { ref, onMounted } from "vue";
import AdminLayout from "@/components/admin/AdminLayout.vue";
import DataTable from "@/components/common/DataTable.vue";
import StatusBadge from "@/components/common/StatusBadge.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import AlertMessage from "@/components/common/AlertMessage.vue";
import DialogForm from "@/components/common/DialogForm.vue";
import DialogConfirm from "@/components/common/DialogConfirm.vue";
import FileUploader from "@/components/common/FileUploader.vue";
import AttachmentsList from "@/components/common/AttachmentsList.vue";

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
      useHtml: false,
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
      openAddForm,
      openEditForm: baseOpenEditForm,
      closeDialog: closeFormDialog,
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

    // Xử lý khi file thay đổi
    const handleFilesChanged = (files) => {
      selectedFiles.value = files;
    };

    // Upload file với hiển thị tiến trình
    const uploadFiles = async (notificationId) => {
      if (selectedFiles.value.length === 0) return;
      
      isUploading.value = true;
      uploadProgress.value = 0;
      
      try {
        // Sử dụng service upload với callback theo dõi tiến trình
        await notificationService.uploadAttachments(
          notificationId, 
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
      }
    };

    // Mở form sửa với xử lý đặc biệt cho dates
    const openEditForm = (notification) => {
      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        // Check if already in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          return dateStr;
        }
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const parts = dateStr.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
      };

      // Clone notification để có thể chỉnh sửa trước khi truyền vào
      const editData = { ...notification };
      editData.date = formatDate(editData.date);
      editData.updateDate = editData.updateDate
        ? formatDate(editData.updateDate)
        : "";

      // Reset danh sách file
      selectedFiles.value = [];

      baseOpenEditForm(editData);
    };

    const saveNotification = async () => {
      try {
        // Format dates for API
        const notificationData = { ...formData };
        
        // Loại bỏ thời gian từ date nếu có
        if (notificationData.date && notificationData.date.includes("T")) {
          notificationData.date = notificationData.date.split("T")[0];
        }
        if (notificationData.updateDate && notificationData.updateDate.includes("T")) {
          notificationData.updateDate = notificationData.updateDate.split("T")[0];
        }
        
        // Lưu thông báo trước để lấy ID
        const result = await submitForm();
        
        // Lấy ID từ kết quả trả về
        const notificationId = isEditing.value ? formData.id : result.notification.id;
        
        // Sau khi lưu thông báo, upload file nếu có
        if (selectedFiles.value.length > 0) {
          try {
            await uploadFiles(notificationId);
          } catch (uploadError) {
            errorMessage.value = `Lưu thông báo thành công nhưng có lỗi khi tải file: ${uploadError.message}`;
            await fetchNotifications();
            return;
          }
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
      saveNotification,
      confirmDelete,
      closeDeleteDialog,
      deleteNotification,
      handleFilesChanged,
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
</style>