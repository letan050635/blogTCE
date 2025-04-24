import apiClient from './apiClient';

export default {
  /**
   * Lấy danh sách quy định
   * @param {Object} params - Tham số lọc và phân trang
   * @returns {Promise<Object>} - Promise trả về danh sách quy định và thông tin phân trang
   */
  getRegulations(params = {}) {
    return apiClient.get('/regulations', { params })
      .then(response => response.data);
  },
  
  /**
   * Lấy danh sách quy định quan trọng
   * @param {number} limit - Số lượng quy định tối đa
   * @returns {Promise<Object>} - Promise trả về danh sách quy định quan trọng
   */
  getImportantRegulations(limit = 5) {
    return apiClient.get('/regulations/important', { params: { limit } })
      .then(response => response.data);
  },
  
  /**
   * Lấy chi tiết một quy định
   * @param {number} id - ID của quy định
   * @returns {Promise<Object>} - Promise trả về thông tin chi tiết quy định
   */
  getRegulationById(id) {
    return apiClient.get(`/regulations/${id}`)
      .then(response => response.data);
  },
  
  /**
   * Tạo quy định mới (chỉ admin)
   * @param {Object} regulationData - Dữ liệu quy định mới
   * @returns {Promise<Object>} - Promise trả về quy định đã tạo
   */
  createRegulation(regulationData) {
    return apiClient.post('/regulations', regulationData)
      .then(response => response.data);
  },
  
  /**
   * Cập nhật quy định (chỉ admin)
   * @param {number} id - ID của quy định
   * @param {Object} regulationData - Dữ liệu cần cập nhật
   * @returns {Promise<Object>} - Promise trả về quy định đã cập nhật
   */
  updateRegulation(id, regulationData) {
    return apiClient.put(`/regulations/${id}`, regulationData)
      .then(response => response.data);
  },
  
  /**
   * Xóa quy định (chỉ admin)
   * @param {number} id - ID của quy định
   * @returns {Promise<Object>} - Promise trả về kết quả xóa
   */
  deleteRegulation(id) {
    return apiClient.delete(`/regulations/${id}`)
      .then(response => response.data);
  },
  
  /**
   * Cập nhật trạng thái đọc của quy định
   * @param {number} id - ID của quy định
   * @param {boolean} read - Trạng thái đọc (true = đã đọc, false = chưa đọc)
   * @returns {Promise<Object>} - Promise trả về kết quả cập nhật
   */
  updateReadStatus(id, read) {
    return apiClient.put(`/regulations/${id}/read-status`, { read })
      .then(response => response.data);
  },
  
  /**
   * Đánh dấu tất cả quy định là đã đọc
   * @returns {Promise<Object>} - Promise trả về kết quả cập nhật
   */
  markAllAsRead() {
    return apiClient.put('/regulations/mark-all-read')
      .then(response => response.data);
  }
};