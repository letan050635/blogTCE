import authService from '@/services/authService';

export const requireAuth = (to, from, next) => {
  if (!authService.isLoggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
};

export const requireGuest = (to, from, next) => {
  if (authService.isLoggedIn()) {
    next({ path: '/' });
  } else {
    next();
  }
};

export const requireAdmin = (to, from, next) => {
  if (!authService.isAdminLoggedIn()) {
    next({
      path: '/admin/login',
      query: { redirect: to.fullPath }
    });
  } else {
    const user = authService.getCurrentAdmin();
    if (user && user.role === 'admin') {
      next();
    } else {
      next({ path: '/admin/login' });
    }
  }
};