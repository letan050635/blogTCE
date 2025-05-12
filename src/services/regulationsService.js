import createBaseService from './baseService';
import apiClient from './apiClient';

const baseService = createBaseService('/regulations');

export default {
  ...baseService,
  
  /**
   * Lấy danh sách quy định
   * @param {Object} params - Tham số lọc và phân trang
   * @returns {Promise<Object>} - Promise trả về danh sách quy định và thông tin phân trang
   */
  getRegulations(params = {}) {
    return baseService.getList(params);
  },
  
  /**
   * Lấy chi tiết một quy định
   * @param {number} id - ID của quy định
   * @returns {Promise<Object>} - Promise trả về thông tin chi tiết quy định
   */
  getRegulationById(id) {
    return baseService.getById(id);
  },
  
  /**
   * Lấy danh sách quy định quan trọng
   * @param {number} limit - Số lượng quy định tối đa
   * @returns {Promise<Object>} - Promise trả về danh sách quy định quan trọng
   */
  getImportantRegulations(limit = 5) {
    return baseService.getList({ isImportant: true, limit });
  },
  
  /**
   * Tạo quy định mới
   * @param {Object} regulationData - Dữ liệu quy định mới
   * @returns {Promise<Object>} - Promise trả về quy định đã tạo
   */
  createRegulation(regulationData) {
    return baseService.create(regulationData);
  },
  
  /**
   * Cập nhật quy định
   * @param {number} id - ID của quy định
   * @param {Object} regulationData - Dữ liệu cần cập nhật
   * @returns {Promise<Object>} - Promise trả về quy định đã cập nhật
   */
  updateRegulation(id, regulationData) {
    return baseService.update(id, regulationData);
  },
  
  /**
   * Xóa quy định
   * @param {number} id - ID của quy định
   * @returns {Promise<Object>} - Promise trả về kết quả xóa
   */
  deleteRegulation(id) {
    return baseService.delete(id);
  },

  /**
   * Upload file đính kèm cho quy định
   * @param {number} regulationId - ID của quy định
   * @param {Array} files - Danh sách file cần upload
   * @param {Function} progressCallback - Callback theo dõi tiến trình upload
   * @returns {Promise<Object>} - Promise trả về kết quả upload
   */
  uploadAttachments: async (regulationId, files, progressCallback = null) => {
    try {
      const formData = new FormData();
      formData.append('relatedType', 'regulation');
      formData.append('relatedId', regulationId);
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const config = {
        headers: {
          // Không cần chỉ định Content-Type khi gửi FormData
          // apiClient sẽ tự động xử lý
        }
      };
      
      // Thêm theo dõi tiến trình nếu có callback
      if (progressCallback && typeof progressCallback === 'function') {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          progressCallback(percentCompleted);
        };
      }
      
      const response = await apiClient.post('/files/upload', formData, config);
      return response.data;
    } catch (error) {
      console.error('Error uploading attachments:', error);
      throw error;
    }
  },
  
  /**
   * Lấy danh sách file đính kèm của quy định
   * @param {number} regulationId - ID của quy định
   * @returns {Promise<Array>} - Promise trả về danh sách file đính kèm
   */
  getAttachments: async (regulationId) => {
    try {
      const response = await apiClient.get(`/files/regulation/${regulationId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting attachments:', error);
      throw error;
    }
  },
  
  /**
   * Xóa file đính kèm
   * @param {number} fileId - ID của file
   * @returns {Promise<Object>} - Promise trả về kết quả xóa
   */
  deleteAttachment: async (fileId) => {
    try {
      const response = await apiClient.delete(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      throw error;
    }
  }
};