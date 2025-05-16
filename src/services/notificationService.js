import createBaseService from './baseService';
import apiClient from './apiClient';

const baseService = createBaseService('/notifications');

export default {
  ...baseService,
  
  getNotifications(params = {}) {
    return baseService.getList(params);
  },
  
  getNotificationById(id) {
    return baseService.getById(id);
  },
  
  getImportantNotifications(limit = 5) {
    return baseService.getList({ isImportant: true, limit });
  },
  
  createNotification(notificationData) {
    return baseService.create(notificationData);
  },
  
  updateNotification(id, notificationData) {
    return baseService.update(id, notificationData);
  },
  
  deleteNotification(id) {
    return baseService.delete(id);
  },
  
  uploadAttachments: async (notificationId, files, progressCallback = null) => {
    try {
      const formData = new FormData();
      formData.append('relatedType', 'notification');
      formData.append('relatedId', notificationId);
      
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
  
  getAttachments: async (notificationId) => {
    try {
      const response = await apiClient.get(`/files/notification/${notificationId}`);
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