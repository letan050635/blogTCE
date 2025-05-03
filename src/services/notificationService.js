import apiClient from "./apiClient";

export default {
  getNotifications(params = {}) {
    return apiClient
      .get("/notifications", { params })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error in getNotifications:", error);
        throw error;
      });
  },


  getNotificationById(id) {
    return apiClient
      .get(`/notifications/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(`Error fetching notification ${id}:`, error);
        throw error;
      });
  },


  createNotification(notificationData) {
    return apiClient
      .post("/notifications", notificationData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error creating notification:", error);
        throw error;
      });
  },

  updateNotification(id, notificationData) {
    return apiClient
      .put(`/notifications/${id}`, notificationData)
      .then((response) => response.data)
      .catch((error) => {
        console.error(`Error updating notification ${id}:`, error);
        throw error;
      });
  },

  deleteNotification(id) {
    return apiClient
      .delete(`/notifications/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(`Error deleting notification ${id}:`, error);
        throw error;
      });
  },

  updateReadStatus(id, read) {
    return apiClient
      .put(`/notifications/${id}/read-status`, { read })
      .then((response) => response.data)
      .catch((error) => {
        console.error(
          `Error updating read status for notification ${id}:`,
          error
        );
        throw error;
      });
  },

  getImportantNotifications(limit = 5) {
    return apiClient
      .get("/notifications/important", { params: { limit } })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching important notifications:", error);
        throw error;
      });
  },
  
  markAllAsRead() {
    return apiClient
      .put("/notifications/mark-all-read")
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error marking all notifications as read:", error);
        throw error;
      });
  },
};
