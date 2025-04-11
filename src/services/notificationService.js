// services/notificationService.js

// Danh sách thông báo mẫu
const sampleNotifications = [
  {
    id: 1,
    title: 'Ví dụ 1',
    brief: 'Mô tả ngắn 1',
    content: 'Nội dung chi tiết 1',
    date: '04/04/2025',
    isNew: true,
    useHtml: false
  },
  {
    id: 2,
    title: 'Ví dụ 2',
    brief: 'Mô tả ngắn 2',
    content: 'Nội dung chi tiết 2',
    date: '03/04/2025',
    isNew: true,
    useHtml: false
  },
  {
    id: 3,
    title: 'Ví dụ 3',
    brief: 'Mô tả ngắn 3',
    content: 'Nội dung chi tiết 3',
    date: '02/04/2025',
    isNew: true,
    useHtml: false
  },
  {
    id: 4,
    title: 'Ví dụ 4',
    brief: 'Mô tả ngắn 4',
    content: 'Nội dung chi tiết 4',
    date: '01/04/2025',
    isNew: false,
    useHtml: false
  },
  {
    id: 5,
    title: 'Ví dụ 5',
    brief: 'Mô tả ngắn 5',
    content: 'Nội dung chi tiết 5',
    date: '30/03/2025',
    isNew: false,
    useHtml: false
  },
  {
    id: 6,
    title: 'Ví dụ 6',
    brief: 'Mô tả ngắn 6',
    content: 'Nội dung chi tiết 6',
    date: '29/03/2025',
    isNew: false,
    useHtml: false
  },
  {
    id: 7,
    title: 'Ví dụ 7',
    brief: 'Mô tả ngắn 7',
    content: 'Nội dung chi tiết 7',
    date: '28/03/2025',
    isNew: false,
    useHtml: false
  },
  {
    id: 8,
    title: 'Ví dụ 8',
    brief: 'Mô tả ngắn 8',
    content: 'Nội dung chi tiết 8',
    date: '27/03/2025',
    isNew: false,
    useHtml: false
  },
  {
    id: 9,
    title: 'Ví dụ 9',
    brief: 'Mô tả ngắn 9',
    content: 'Nội dung chi tiết 9',
    date: '26/03/2025',
    isNew: false,
    useHtml: false
  },
  {
    id: 10,
    title: 'Ví dụ 10',
    brief: 'Mô tả ngắn 10',
    content: 'Nội dung chi tiết 10',
    date: '25/03/2025',
    isNew: false,
    useHtml: false
  },
  {
    id: 11,
    title: 'Demo 11',
    brief: 'Mô tả ngắn 11',
    content: 'how to use html',
    date: '04/03/2025',
    isNew: true,
    useHtml: false
  }
];


export default {
  /**
   * Lấy danh sách thông báo
   * @param {Object} params - Tham số lọc và phân trang
   * @returns {Promise<Object>} - Promise trả về danh sách thông báo và thông tin phân trang
   */
  getNotifications(params = {}) {
    // Mô phỏng API call với delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const { page = 1, limit = 10, filter, search } = params;
        
        // Lọc thông báo theo filter (nếu có)
        let filteredNotifications = [...sampleNotifications];
        
        if (filter === 'read') {
          // Lấy trạng thái đã đọc từ localStorage
          const readStatus = this.getReadStatus();
          filteredNotifications = filteredNotifications.filter(
            notification => readStatus[notification.id] === true
          );
        } else if (filter === 'unread') {
          // Lấy trạng thái đã đọc từ localStorage
          const readStatus = this.getReadStatus();
          filteredNotifications = filteredNotifications.filter(
            notification => readStatus[notification.id] !== true
          );
        }
        
        // Tìm kiếm
        if (search) {
          const query = search.toLowerCase();
          filteredNotifications = filteredNotifications.filter(notification =>
            notification.title.toLowerCase().includes(query) ||
            notification.brief.toLowerCase().includes(query) ||
            notification.content.toLowerCase().includes(query)
          );
        }
        
        // Tính toán phân trang
        const total = filteredNotifications.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
        
        // Thêm trạng thái đã đọc từ localStorage
        const readStatus = this.getReadStatus();
        const notificationsWithReadStatus = paginatedNotifications.map(notification => ({
          ...notification,
          read: readStatus[notification.id] === true
        }));
        
        resolve({
          data: notificationsWithReadStatus,
          pagination: {
            total,
            totalPages,
            currentPage: page,
            limit
          }
        });
      }, 300); // Giả lập delay mạng 300ms
    });
  },
  
  /**
   * Lấy chi tiết một thông báo
   * @param {number} id - ID của thông báo
   * @returns {Promise<Object>} - Promise trả về thông tin chi tiết thông báo
   */
  getNotificationById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const notification = sampleNotifications.find(n => n.id === id);
        
        if (notification) {
          const readStatus = this.getReadStatus();
          resolve({
            ...notification,
            read: readStatus[notification.id] === true
          });
        } else {
          reject(new Error('Không tìm thấy thông báo'));
        }
      }, 200);
    });
  },
  
  /**
   * Cập nhật trạng thái đọc của thông báo
   * @param {number} id - ID của thông báo
   * @param {boolean} read - Trạng thái đọc (true = đã đọc, false = chưa đọc)
   * @returns {Promise<Object>} - Promise trả về thông báo đã cập nhật
   */
  updateReadStatus(id, read) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Lưu trạng thái vào localStorage
        const readStatus = this.getReadStatus();
        readStatus[id] = read;
        this.saveReadStatus(readStatus);
        
        const notification = sampleNotifications.find(n => n.id === parseInt(id));
        if (notification) {
          resolve({
            ...notification,
            read
          });
        } else {
          resolve(null);
        }
      }, 200);
    });
  },
  
  /**
   * Đánh dấu tất cả thông báo là đã đọc
   * @returns {Promise<boolean>} - Promise trả về true nếu thành công
   */
  markAllAsRead() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const readStatus = {};
        sampleNotifications.forEach(notification => {
          readStatus[notification.id] = true;
        });
        
        this.saveReadStatus(readStatus);
        resolve(true);
      }, 300);
    });
  },
  
  /**
   * Lấy trạng thái đã đọc từ localStorage
   * @returns {Object} - Object chứa trạng thái đã đọc
   */
  getReadStatus() {
    try {
      const storedStatus = localStorage.getItem('notifications_read_status');
      return storedStatus ? JSON.parse(storedStatus) : {};
    } catch (error) {
      console.error('Failed to load read status from localStorage:', error);
      return {};
    }
  },
  
  /**
   * Lưu trạng thái đã đọc vào localStorage
   * @param {Object} readStatus - Object chứa trạng thái đã đọc
   */
  saveReadStatus(readStatus) {
    try {
      localStorage.setItem('notifications_read_status', JSON.stringify(readStatus));
    } catch (error) {
      console.error('Failed to save read status to localStorage:', error);
    }
  }
};