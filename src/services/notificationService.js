import apiClient from './apiClient';

export default {
  getNotifications(params = {}) {
    return apiClient.get('/notifications', { params })
      .then(response => response.data);
  },
  
  getNotificationById(id) {
    return apiClient.get(`/notifications/${id}`)
      .then(response => response.data);
  },
  
  createNotification(notificationData) {
    return apiClient.post('/notifications', notificationData)
      .then(response => response.data);
  },
  
  updateNotification(id, notificationData) {
    return apiClient.put(`/notifications/${id}`, notificationData)
      .then(response => response.data);
  },
  
  deleteNotification(id) {
    return apiClient.delete(`/notifications/${id}`)
      .then(response => response.data);
  },
  
  updateReadStatus(id, read) {
    return apiClient.put(`/notifications/${id}/read-status`, { read })
      .then(response => response.data);
  },

  
  markAllAsRead() {
    return apiClient.put('/notifications/mark-all-read')
      .then(response => response.data);
  }
};