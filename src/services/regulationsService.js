import apiClient from './apiClient';

export default {
  /**
   * Lấy danh sách quy định
   * @param {Object} params - Tham số lọc và phân trang
   * @returns {Promise<Object>} - Promise trả về danh sách quy định và thông tin phân trang
   */
  getRegulations(params = {}) {
    return apiClient.get('/regulations', { params })
      .then(response => response.data)
      .catch(error => {
        console.error('Error in getRegulations:', error);
        throw error;
      });
  },
  
  /**
   * Lấy danh sách quy định quan trọng
   * @param {number} limit - Số lượng quy định tối đa
   * @returns {Promise<Object>} - Promise trả về danh sách quy định quan trọng
   */
  getImportantRegulations(limit = 5) {
    return apiClient.get('/regulations/important', { params: { limit } })
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching important regulations:', error);
        throw error;
      });
  },
  
  /**
   * Lấy chi tiết một quy định
   * @param {number} id - ID của quy định
   * @returns {Promise<Object>} - Promise trả về thông tin chi tiết quy định
   */
  getRegulationById(id) {
    return apiClient.get(`/regulations/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error fetching regulation ${id}:`, error);
        throw error;
      });
  },
  
  /**
   * Tạo quy định mới (chỉ admin)
   * @param {Object} regulationData - Dữ liệu quy định mới
   * @returns {Promise<Object>} - Promise trả về quy định đã tạo
   */
  createRegulation(regulationData) {
    return apiClient.post('/regulations', regulationData)
      .then(response => response.data)
      .catch(error => {
        console.error('Error creating regulation:', error);
        throw error;
      });
  },
  
  /**
   * Cập nhật quy định (chỉ admin)
   * @param {number} id - ID của quy định
   * @param {Object} regulationData - Dữ liệu cần cập nhật
   * @returns {Promise<Object>} - Promise trả về quy định đã cập nhật
   */
  updateRegulation(id, regulationData) {
    return apiClient.put(`/regulations/${id}`, regulationData)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error updating regulation ${id}:`, error);
        throw error;
      });
  },
  
  /**
   * Xóa quy định (chỉ admin)
   * @param {number} id - ID của quy định
   * @returns {Promise<Object>} - Promise trả về kết quả xóa
   */
  deleteRegulation(id) {
    return apiClient.delete(`/regulations/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error deleting regulation ${id}:`, error);
        throw error;
      });
  },
  
  /**
   * Cập nhật trạng thái đọc của quy định
   * @param {number} id - ID của quy định
   * @param {boolean} read - Trạng thái đọc (true = đã đọc, false = chưa đọc)
   * @returns {Promise<Object>} - Promise trả về kết quả cập nhật
   */
  updateReadStatus(id, read) {
    return apiClient.put(`/regulations/${id}/read-status`, { read })
      .then(response => response.data)
      .catch(error => {
        console.error(`Error updating read status for regulation ${id}:`, error);
        throw error;
      });
  },
  
  /**
   * Đánh dấu tất cả quy định là đã đọc
   * @returns {Promise<Object>} - Promise trả về kết quả cập nhật
   */
  markAllAsRead() {
    return apiClient.put('/regulations/mark-all-read')
      .then(response => response.data)
      .catch(error => {
        console.error('Error marking all regulations as read:', error);
        throw error;
      });
  }
};