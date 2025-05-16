import createBaseService from './baseService';
import apiClient from './apiClient';

const baseService = createBaseService('/regulations');

export default {
  ...baseService,
  getRegulations(params = {}) {
    return baseService.getList(params);
  },
  
  getRegulationById(id) {
    return baseService.getById(id);
  },
  
  getImportantRegulations(limit = 5) {
    return baseService.getList({ isImportant: true, limit });
  },
  
  createRegulation(regulationData) {
    return baseService.create(regulationData);
  },
  
  updateRegulation(id, regulationData) {
    return baseService.update(id, regulationData);
  },
  
  deleteRegulation(id) {
    return baseService.delete(id);
  },

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
  
  getAttachments: async (regulationId) => {
    try {
      const response = await apiClient.get(`/files/regulation/${regulationId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting attachments:', error);
      throw error;
    }
  },
  
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