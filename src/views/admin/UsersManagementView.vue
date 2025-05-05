<template>
  <AdminLayout>
    <div class="users-management">
      <div class="page-header">
        <h1>Quản lý người dùng</h1>
        <button @click="openAddForm" class="add-button">+ Thêm người dùng mới</button>
      </div>
      
      <AlertMessage v-if="successMessage" :message="successMessage" type="success" />
      <AlertMessage v-if="errorMessage" :message="errorMessage" type="error" />
      
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm người dùng..." 
          class="search-input"
          @input="handleSearch"
        />
      </div>
      
      <LoadingSpinner v-if="isLoading" />
      
      <DataTable
        v-else
        :columns="columns"
        :data="users"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-change="changePage"
      >
        <template #role="{ row }">
          <StatusBadge
            :type="row.role === 'admin' ? 'admin' : 'user'"
            :text="row.role === 'admin' ? 'Admin' : 'User'"
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
              :disabled="row.role === 'admin'"
            >
              Xóa
            </button>
          </div>
        </template>
      </DataTable>
      
      <DialogForm
        :show="showFormDialog"
        :title="isEditing ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'"
        :submitDisabled="isSubmitting"
        :submitText="'Lưu người dùng'"
        :loadingText="'Đang lưu...'"
        @close="closeFormDialog"
        @submit="saveUser"
      >
        <div class="form-group">
          <label for="username">Tên đăng nhập <span class="required">*</span></label>
          <input 
            type="text" 
            id="username" 
            v-model="formData.username" 
            required
            placeholder="Nhập tên đăng nhập"
            :disabled="isEditing"
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email <span class="required">*</span></label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            required
            placeholder="Nhập email"
            :disabled="isEditing"
          />
        </div>
        
        <div class="form-group" v-if="!isEditing">
          <label for="password">Mật khẩu <span class="required">*</span></label>
          <input 
            type="password" 
            id="password" 
            v-model="formData.password" 
            required
            placeholder="Nhập mật khẩu"
          />
        </div>
        
        <div class="form-group">
          <label for="fullName">Họ và tên <span class="required">*</span></label>
          <input 
            type="text" 
            id="fullName" 
            v-model="formData.fullName" 
            required
            placeholder="Nhập họ và tên"
          />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="department">Phòng ban</label>
            <input 
              type="text" 
              id="department" 
              v-model="formData.department" 
              placeholder="Nhập phòng ban"
            />
          </div>
          
          <div class="form-group">
            <label for="position">Chức vụ</label>
            <input 
              type="text" 
              id="position" 
              v-model="formData.position" 
              placeholder="Nhập chức vụ"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="phone">Số điện thoại</label>
          <input 
            type="text" 
            id="phone" 
            v-model="formData.phone" 
            placeholder="Nhập số điện thoại"
          />
        </div>
        
        <div class="form-group form-checkbox">
          <input 
            type="checkbox" 
            id="isAdmin" 
            v-model="formData.isAdmin" 
          />
          <label for="isAdmin">Phân quyền Admin</label>
        </div>
      </DialogForm>
      
      <DialogConfirm
        :show="showDeleteDialog"
        title="Xác nhận xóa"
        :message="`Bạn có chắc chắn muốn xóa người dùng '${selectedUser?.fullName || ''}'?`"
        warningText="Hành động này không thể hoàn tác!"
        confirmText="Xóa"
        :confirmDisabled="isDeleting"
        loadingText="Đang xóa..."
        @close="closeDeleteDialog"
        @confirm="deleteUser"
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

import authService from '@/services/authService';
import useList from '@/composables/useList';
import useFormDialog from '@/composables/useFormDialog';
import useDeleteDialog from '@/composables/useDeleteDialog';
// eslint-disable-next-line no-unused-vars
import useMessage from '@/composables/useMessage';

export default {
  name: 'UsersManagementView',
  components: {
    AdminLayout,
    DataTable,
    StatusBadge,
    LoadingSpinner,
    AlertMessage,
    DialogForm,
    DialogConfirm
  },
  setup() {
    const initialFormData = {
      id: null,
      username: '',
      email: '',
      password: '',
      fullName: '',
      department: '',
      position: '',
      phone: '',
      isAdmin: false
    };
    
    const columns = [
      { field: 'id', label: '#', width: '50px' },
      { field: 'fullName', label: 'Họ tên' },
      { field: 'username', label: 'Tên đăng nhập' },
      { field: 'email', label: 'Email' },
      { field: 'department', label: 'Phòng ban' },
      { field: 'role', label: 'Vai trò', width: '80px' },
      { field: 'actions', label: 'Thao tác', width: '150px' }
    ];
    
    const {
      isLoading,
      data: users,
      currentPage,
      totalPages,
      searchQuery,
      errorMessage,
      successMessage,
      fetchData,
      handleSearch,
      changePage,
      showSuccessMessage
    } = useList(authService.getUsers);
    
    const {
      showDialog: showFormDialog,
      isEditing,
      isSubmitting,
      formData,
      openAddForm,
      openEditForm,
      closeDialog: closeFormDialog,
      submitForm
    } = useFormDialog(initialFormData, {
      create: authService.register,
      update: authService.updateUser
    });
    
    const {
      showDeleteDialog,
      isDeleting,
      selectedItem: selectedUser,
      confirmDelete,
      closeDeleteDialog,
      deleteItem
    } = useDeleteDialog(authService.deleteUser);
    
    const fetchUsers = async () => {
      await fetchData();
    };
    
    const saveUser = async () => {
      try {
        const userData = {
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          department: formData.department || null,
          position: formData.position || null,
          phone: formData.phone || null,
          role: formData.isAdmin ? 'admin' : 'user'
        };
        
        if (!isEditing.value) {
          userData.password = formData.password;
        } else {
          // Không gửi username và email khi cập nhật
          delete userData.username;
          delete userData.email;
        }
        
        await submitForm(async () => {
          await fetchUsers();
          showSuccessMessage(
            isEditing.value 
              ? 'Cập nhật thông tin người dùng thành công!' 
              : 'Thêm người dùng mới thành công!'
          );
        });
      } catch (error) {
        console.error('Error saving user:', error);
        errorMessage.value = error.message || 'Không thể lưu thông tin người dùng. Vui lòng thử lại.';
      }
    };
    
    const deleteUser = async () => {
      try {
        await deleteItem(async () => {
          await fetchUsers();
          showSuccessMessage('Xóa người dùng thành công!');
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        errorMessage.value = error.message || 'Không thể xóa người dùng. Vui lòng thử lại.';
      }
    };
    
    onMounted(() => {
      fetchUsers();
    });
    
    return {
      users,
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
      selectedUser,
      fetchUsers,
      changePage,
      handleSearch,
      openAddForm,
      openEditForm,
      closeFormDialog,
      saveUser,
      confirmDelete,
      closeDeleteDialog,
      deleteUser
    };
  }
}
</script>

<style scoped>
/* Loại bỏ CSS trong file và nhập từ file styles */
@import '@/assets/styles/admin.css';
@import '@/assets/styles/form.css';
</style>