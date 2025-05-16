import apiClient from './apiClient';

export default function createBaseService(basePath) {
  return {
    getList(params = {}) {
      return apiClient.get(basePath, { params })
        .then(response => response.data)
        .catch(error => {
          console.error(`Error in getList (${basePath}):`, error);
          throw error;
        });
    },
    
    getById(id) {
      return apiClient.get(`${basePath}/${id}`)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error fetching item ${id} (${basePath}):`, error);
          throw error;
        });
    },
    
    create(data) {
      return apiClient.post(basePath, data)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error creating item (${basePath}):`, error);
          throw error;
        });
    },
    
    update(id, data) {
      return apiClient.put(`${basePath}/${id}`, data)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error updating item ${id} (${basePath}):`, error);
          throw error;
        });
    },
    
    delete(id) {
      return apiClient.delete(`${basePath}/${id}`)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error deleting item ${id} (${basePath}):`, error);
          throw error;
        });
    },
    
    updateReadStatus(id, read) {
      return apiClient.put(`${basePath}/${id}/read-status`, { read })
        .then(response => response.data)
        .catch(error => {
          console.error(`Error updating read status for item ${id} (${basePath}):`, error);
          throw error;
        });
    },
    
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