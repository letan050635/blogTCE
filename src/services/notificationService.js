import apiClient from './apiClient';

export default {
  /**
   * Lấy danh sách thông báo với các tham số lọc và phân trang
   * @param {Object} params - Các tham số lọc và phân trang
   * @returns {Promise<Object>} - Promise trả về danh sách thông báo và thông tin phân trang
   */
  getNotifications(params = {}) {
    return apiClient.get('/notifications', { params })
      .then(response => response.data)
      .catch(error => {
        console.error('Error in getNotifications:', error);
        throw error;
      });
  },
  
  /**
   * Lấy chi tiết một thông báo
   * @param {number} id - ID của thông báo
   * @returns {Promise<Object>} - Promise trả về thông tin chi tiết thông báo
   */
  getNotificationById(id) {
    return apiClient.get(`/notifications/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error fetching notification ${id}:`, error);
        throw error;
      });
  },
  
  /**
   * Tạo thông báo mới (yêu cầu quyền admin)
   * @param {Object} notificationData - Dữ liệu thông báo mới
   * @returns {Promise<Object>} - Promise trả về thông báo đã tạo
   */
  createNotification(notificationData) {
    return apiClient.post('/notifications', notificationData)
      .then(response => response.data)
      .catch(error => {
        console.error('Error creating notification:', error);
        throw error;
      });
  },
  
  /**
   * Cập nhật thông báo (yêu cầu quyền admin)
   * @param {number} id - ID của thông báo
   * @param {Object} notificationData - Dữ liệu cần cập nhật
   * @returns {Promise<Object>} - Promise trả về thông báo đã cập nhật
   */
  updateNotification(id, notificationData) {
    return apiClient.put(`/notifications/${id}`, notificationData)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error updating notification ${id}:`, error);
        throw error;
      });
  },
  
  /**
   * Xóa thông báo (yêu cầu quyền admin)
   * @param {number} id - ID của thông báo
   * @returns {Promise<Object>} - Promise trả về kết quả xóa
   */
  deleteNotification(id) {
    return apiClient.delete(`/notifications/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error deleting notification ${id}:`, error);
        throw error;
      });
  },
  
  /**
   * Cập nhật trạng thái đọc của thông báo
   * @param {number} id - ID của thông báo
   * @param {boolean} read - Trạng thái đọc (true = đã đọc, false = chưa đọc)
   * @returns {Promise<Object>} - Promise trả về kết quả cập nhật
   */
  updateReadStatus(id, read) {
    return apiClient.put(`/notifications/${id}/read-status`, { read })
      .then(response => response.data)
      .catch(error => {
        console.error(`Error updating read status for notification ${id}:`, error);
        throw error;
      });
  },
  
  /**
   * Đánh dấu tất cả thông báo là đã đọc
   * @returns {Promise<Object>} - Promise trả về kết quả cập nhật
   */
  markAllAsRead() {
    return apiClient.put('/notifications/mark-all-read')
      .then(response => response.data)
      .catch(error => {
        console.error('Error marking all notifications as read:', error);
        throw error;
      });
  }
};