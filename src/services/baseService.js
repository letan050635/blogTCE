import apiClient from './apiClient';

export default function createBaseService(basePath) {
  return {
    /**
     * Lấy danh sách với phân trang
     * @param {Object} params - Tham số lọc và phân trang
     * @returns {Promise<Object>} - Promise trả về danh sách và thông tin phân trang
     */
    getList(params = {}) {
      return apiClient.get(basePath, { params })
        .then(response => response.data)
        .catch(error => {
          console.error(`Error in getList (${basePath}):`, error);
          throw error;
        });
    },
    
    /**
     * Lấy chi tiết một item
     * @param {number} id - ID của item
     * @returns {Promise<Object>} - Promise trả về thông tin chi tiết
     */
    getById(id) {
      return apiClient.get(`${basePath}/${id}`)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error fetching item ${id} (${basePath}):`, error);
          throw error;
        });
    },
    
    /**
     * Tạo item mới
     * @param {Object} data - Dữ liệu item mới
     * @returns {Promise<Object>} - Promise trả về item đã tạo
     */
    create(data) {
      return apiClient.post(basePath, data)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error creating item (${basePath}):`, error);
          throw error;
        });
    },
    
    /**
     * Cập nhật item
     * @param {number} id - ID của item
     * @param {Object} data - Dữ liệu cần cập nhật
     * @returns {Promise<Object>} - Promise trả về item đã cập nhật
     */
    update(id, data) {
      return apiClient.put(`${basePath}/${id}`, data)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error updating item ${id} (${basePath}):`, error);
          throw error;
        });
    },
    
    /**
     * Xóa item
     * @param {number} id - ID của item
     * @returns {Promise<Object>} - Promise trả về kết quả xóa
     */
    delete(id) {
      return apiClient.delete(`${basePath}/${id}`)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error deleting item ${id} (${basePath}):`, error);
          throw error;
        });
    },
    
    /**
     * Cập nhật trạng thái đọc
     * @param {number} id - ID của item
     * @param {boolean} read - Trạng thái đọc (true = đã đọc, false = chưa đọc)
     * @returns {Promise<Object>} - Promise trả về kết quả cập nhật
     */
    updateReadStatus(id, read) {
      return apiClient.put(`${basePath}/${id}/read-status`, { read })
        .then(response => response.data)
        .catch(error => {
          console.error(`Error updating read status for item ${id} (${basePath}):`, error);
          throw error;
        });
    },
    
    /**
     * Đánh dấu tất cả là đã đọc
     * @returns {Promise<Object>} - Promise trả về kết quả cập nhật
     */
    markAllAsRead() {
      return apiClient.put(`${basePath}/mark-all-read`)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error marking all items as read (${basePath}):`, error);
          throw error;
        });
    }
  };
}