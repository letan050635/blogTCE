import apiClient from './apiClient';

export default {
  /**
   * Lấy danh sách thông báo
   * @param {Object} params - Tham số lọc và phân trang
   * @returns {Promise<Object>} - Promise trả về danh sách thông báo và thông tin phân trang
   */
  getNotifications(params = {}) {
    return apiClient.get('/notifications', { params })
      .then(response => response.data);
  },
  
  /**
   * Lấy chi tiết một thông báo
   * @param {number} id - ID của thông báo
   * @returns {Promise<Object>} - Promise trả về thông tin chi tiết thông báo
   */
  getNotificationById(id) {
    return apiClient.get(`/notifications/${id}`)
      .then(response => response.data);
  },
  
  /**
   * Tạo thông báo mới (chỉ admin)
   * @param {Object} notificationData - Dữ liệu thông báo mới
   * @returns {Promise<Object>} - Promise trả về thông báo đã tạo
   */
  createNotification(notificationData) {
    return apiClient.post('/notifications', notificationData)
      .then(response => response.data);
  },
  
  /**
   * Cập nhật thông báo (chỉ admin)
   * @param {number} id - ID của thông báo
   * @param {Object} notificationData - Dữ liệu cần cập nhật
   * @returns {Promise<Object>} - Promise trả về thông báo đã cập nhật
   */
  updateNotification(id, notificationData) {
    return apiClient.put(`/notifications/${id}`, notificationData)
      .then(response => response.data);
  },
  
  /**
   * Xóa thông báo (chỉ admin)
   * @param {number} id - ID của thông báo
   * @returns {Promise<Object>} - Promise trả về kết quả xóa
   */
  deleteNotification(id) {
    return apiClient.delete(`/notifications/${id}`)
      .then(response => response.data);
  },
  
  /**
   * Cập nhật trạng thái đọc của thông báo
   * @param {number} id - ID của thông báo
   * @param {boolean} read - Trạng thái đọc (true = đã đọc, false = chưa đọc)
   * @returns {Promise<Object>} - Promise trả về kết quả cập nhật
   */
  updateReadStatus(id, read) {
    return apiClient.put(`/notifications/${id}/read-status`, { read })
      .then(response => response.data);
  },
  
  /**
   * Đánh dấu tất cả thông báo là đã đọc
   * @returns {Promise<Object>} - Promise trả về kết quả cập nhật
   */
  markAllAsRead() {
    return apiClient.put('/notifications/mark-all-read')
      .then(response => response.data);
  }
};