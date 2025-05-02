<!-- views/admin/UsersManagementView.vue -->
<template>
  <AdminLayout>
    <div class="users-management">
      <div class="page-header">
        <h1>Quản lý người dùng</h1>
        <button @click="openAddForm" class="add-button">+ Thêm người dùng mới</button>
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
          placeholder="Tìm kiếm người dùng..." 
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
              <th>Họ tên</th>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Phòng ban</th>
              <th style="width: 80px">Vai trò</th>
              <th style="width: 150px">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.fullName }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.department || '--' }}</td>
              <td>
                <span 
                  class="status-badge" 
                  :class="user.role === 'admin' ? 'status-admin' : 'status-user'"
                >
                  {{ user.role === 'admin' ? 'Admin' : 'User' }}
                </span>
              </td>
              <td class="actions">
                <button 
                  @click="openEditForm(user)" 
                  class="edit-button" 
                  title="Sửa"
                >
                  Sửa
                </button>
                <button 
                  @click="confirmDelete(user)" 
                  class="delete-button" 
                  title="Xóa"
                  :disabled="user.role === 'admin'"
                >
                  Xóa
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="7" class="no-data">Không có dữ liệu</td>
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
      
      <!-- Dialog thêm/sửa người dùng -->
      <div v-if="showFormDialog" class="dialog-overlay" @click="closeFormDialog">
        <div class="dialog-content" @click.stop>
          <div class="dialog-header">
            <h2>{{ isEditing ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới' }}</h2>
            <button @click="closeFormDialog" class="close-button">&times;</button>
          </div>
          
          <form @submit.prevent="saveUser" class="user-form">
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
            
            <div class="form-actions">
              <button type="button" @click="closeFormDialog" class="cancel-button">Hủy</button>
              <button type="submit" class="save-button" :disabled="isSubmitting">
                <span v-if="isSubmitting">Đang lưu...</span>
                <span v-else>Lưu người dùng</span>
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
            <p>Bạn có chắc chắn muốn xóa người dùng <strong>"{{ selectedUser.fullName }}"</strong>?</p>
            <p class="warning">Hành động này không thể hoàn tác!</p>
          </div>
          
          <div class="dialog-actions">
            <button @click="closeDeleteDialog" class="cancel-button">Hủy</button>
            <button @click="deleteUser" class="delete-button" :disabled="isSubmitting">
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
import authService from '@/services/authService';

export default {
  name: 'UsersManagementView',
  components: {
    AdminLayout
  },
  setup() {
    // State
    const users = ref([]);
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
      username: '',
      email: '',
      password: '',
      fullName: '',
      department: '',
      position: '',
      phone: '',
      isAdmin: false
    });
    
    // Delete dialog state
    const showDeleteDialog = ref(false);
    const selectedUser = ref({});
    
    // Fetch users
    const fetchUsers = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      
      try {
        // Thử sử dụng getUsers có thể gặp lỗi, thêm xử lý lỗi rõ ràng
        const result = await authService.getUsers({
          page: currentPage.value,
          limit: 10
        });
        
        // Kiểm tra định dạng dữ liệu trả về
        if (result && result.data) {
          users.value = result.data;
          totalPages.value = result.pagination ? result.pagination.totalPages : 1;
          
          // If current page is greater than total pages, reset to page 1
          if (currentPage.value > totalPages.value && totalPages.value > 0) {
            currentPage.value = 1;
            fetchUsers();
          }
        } else {
          // Nếu không có dữ liệu đúng định dạng
          console.error('Invalid data format:', result);
          errorMessage.value = 'Định dạng dữ liệu không hợp lệ. Vui lòng kiểm tra API.';
          users.value = [];
          totalPages.value = 1;
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        errorMessage.value = `Không thể tải danh sách người dùng: ${error.message || 'Lỗi không xác định'}`;
        users.value = [];
        totalPages.value = 1;
      } finally {
        isLoading.value = false;
      }
    };
    
    // Handle pagination
    const changePage = (page) => {
      currentPage.value = page;
      fetchUsers();
    };
    
    // Handle search
    const handleSearch = () => {
      // Debounce search
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      
      searchTimeout.value = setTimeout(() => {
        currentPage.value = 1; // Reset to first page
        fetchUsers();
      }, 300);
    };
    
    // Form functions
    const resetForm = () => {
      formData.id = null;
      formData.username = '';
      formData.email = '';
      formData.password = '';
      formData.fullName = '';
      formData.department = '';
      formData.position = '';
      formData.phone = '';
      formData.isAdmin = false;
    };
    
    const openAddForm = () => {
      resetForm();
      isEditing.value = false;
      showFormDialog.value = true;
    };
    
    const openEditForm = (user) => {
      isEditing.value = true;
      
      // Fill form with user data
      formData.id = user.id;
      formData.username = user.username;
      formData.email = user.email;
      formData.fullName = user.fullName;
      formData.department = user.department || '';
      formData.position = user.position || '';
      formData.phone = user.phone || '';
      formData.isAdmin = user.role === 'admin';
      
      showFormDialog.value = true;
    };
    
    const closeFormDialog = () => {
      showFormDialog.value = false;
    };
    
    const saveUser = async () => {
      isSubmitting.value = true;
      errorMessage.value = '';
      successMessage.value = '';
      
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
          await authService.register(userData);
          successMessage.value = 'Thêm người dùng mới thành công!';
        } else {
          // Không gửi username và email khi cập nhật
          delete userData.username;
          delete userData.email;
          
          // Sử dụng updateUser thay vì updateUserProfile
          await authService.updateUser(formData.id, userData);
          successMessage.value = 'Cập nhật thông tin người dùng thành công!';
        }
        
        // Close dialog and refresh list
        closeFormDialog();
        fetchUsers();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);
      } catch (error) {
        console.error('Error saving user:', error);
        errorMessage.value = error.message || 'Không thể lưu thông tin người dùng. Vui lòng thử lại.';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    // Delete functions
    const confirmDelete = (user) => {
      if (user.role === 'admin') return; // Không cho phép xóa admin
      
      selectedUser.value = user;
      showDeleteDialog.value = true;
    };
    
    const closeDeleteDialog = () => {
      showDeleteDialog.value = false;
    };
    
    const deleteUser = async () => {
      isSubmitting.value = true;
      errorMessage.value = '';
      successMessage.value = '';
      
      try {
        await authService.deleteUser(selectedUser.value.id);
        
        // Close dialog and refresh list
        closeDeleteDialog();
        fetchUsers();
        
        successMessage.value = 'Xóa người dùng thành công!';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);
      } catch (error) {
        console.error('Error deleting user:', error);
        errorMessage.value = error.message || 'Không thể xóa người dùng. Vui lòng thử lại.';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    // Lifecycle hooks
    onMounted(() => {
      fetchUsers();
    });
    
    return {
      users,
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
.users-management {
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

.status-admin {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-user {
  background-color: #f5f5f5;
  color: #757575;
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
  width: 600px;
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
.user-form {
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
.form-group input[type="email"],
.form-group input[type="password"],
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

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-checkbox {
  display: flex;
  align-items: center;
}

.form-checkbox input[type="checkbox"] {
  margin-right: 8px;
}

.form-checkbox label {
  display: inline;
  margin-bottom: 0;
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