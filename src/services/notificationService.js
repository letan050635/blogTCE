import createBaseService from './baseService';
import apiClient from './apiClient';

const baseService = createBaseService('/notifications');

export default {
  ...baseService,
  
  /**
   * Lấy danh sách thông báo
   * @param {Object} params - Tham số lọc và phân trang
   * @returns {Promise<Object>} - Promise trả về danh sách thông báo và thông tin phân trang
   */
  getNotifications(params = {}) {
    return baseService.getList(params);
  },
  
  /**
   * Lấy chi tiết một thông báo
   * @param {number} id - ID của thông báo
   * @returns {Promise<Object>} - Promise trả về thông tin chi tiết thông báo
   */
  getNotificationById(id) {
    return baseService.getById(id);
  },
  
  /**
   * Lấy danh sách thông báo quan trọng
   * @param {number} limit - Số lượng thông báo tối đa
   * @returns {Promise<Object>} - Promise trả về danh sách thông báo quan trọng
   */
  getImportantNotifications(limit = 5) {
    return baseService.getList({ isImportant: true, limit });
  },
  
  /**
   * Tạo thông báo mới
   * @param {Object} notificationData - Dữ liệu thông báo mới
   * @returns {Promise<Object>} - Promise trả về thông báo đã tạo
   */
  createNotification(notificationData) {
    return baseService.create(notificationData);
  },
  
  /**
   * Cập nhật thông báo
   * @param {number} id - ID của thông báo
   * @param {Object} notificationData - Dữ liệu cần cập nhật
   * @returns {Promise<Object>} - Promise trả về thông báo đã cập nhật
   */
  updateNotification(id, notificationData) {
    return baseService.update(id, notificationData);
  },
  
  /**
   * Xóa thông báo
   * @param {number} id - ID của thông báo
   * @returns {Promise<Object>} - Promise trả về kết quả xóa
   */
  deleteNotification(id) {
    return baseService.delete(id);
  },
  
  /**
   * Upload file đính kèm cho thông báo
   * @param {number} notificationId - ID của thông báo
   * @param {Array} files - Danh sách file cần upload
   * @returns {Promise<Object>} - Promise trả về kết quả upload
   */
  uploadAttachments: async (notificationId, files) => {
    try {
      const formData = new FormData();
      formData.append('relatedType', 'notification');
      formData.append('relatedId', notificationId);
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await apiClient.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading attachments:', error);
      throw error;
    }
  },
  
  /**
   * Lấy danh sách file đính kèm của thông báo
   * @param {number} notificationId - ID của thông báo
   * @returns {Promise<Array>} - Promise trả về danh sách file đính kèm
   */
  getAttachments: async (notificationId) => {
    try {
      const response = await apiClient.get(`/api/files/notification/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting attachments:', error);
      throw error;
    }
  }
};