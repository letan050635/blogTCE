import authService from '@/services/authService';

// Auth Guard - Bảo vệ các route yêu cầu đăng nhập
export const requireAuth = (to, from, next) => {
  if (!authService.isLoggedIn()) {
    // Nếu người dùng chưa đăng nhập, chuyển hướng về trang đăng nhập
    // và lưu lại đường dẫn hiện tại để sau khi đăng nhập sẽ quay lại
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else {
    // Nếu đã đăng nhập, cho phép truy cập
    next();
  }
};

// Auth Guard ngược - Bảo vệ các route chỉ dành cho người chưa đăng nhập
export const requireGuest = (to, from, next) => {
  if (authService.isLoggedIn()) {
    // Nếu người dùng đã đăng nhập, chuyển hướng về trang chủ
    next({ path: '/' });
  } else {
    // Nếu chưa đăng nhập, cho phép truy cập
    next();
  }
};

// Admin Guard - Bảo vệ các route dành cho admin
export const requireAdmin = (to, from, next) => {
  if (!authService.isLoggedIn()) {
    // Nếu người dùng chưa đăng nhập, chuyển hướng về trang đăng nhập
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else {
    // Kiểm tra vai trò admin
    const user = authService.getCurrentUser();
    if (user && user.role === 'admin') {
      // Nếu là admin, cho phép truy cập
      next();
    } else {
      // Nếu không phải admin, chuyển hướng về trang chủ
      next({ path: '/' });
    }
  }
};