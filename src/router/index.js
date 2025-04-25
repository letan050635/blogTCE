import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WordpressView from '@/views/WordPressView'
import SEOView from '@/views/SEOView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import RegulationsView from '@/views/RegulationsView.vue'
import { requireAuth, requireGuest, requireAdmin } from './auth-guard'

// Lazy load các component
const AdminDashboard = () => import('@/views/admin/DashboardView.vue')
const NotificationsManagement = () => import('@/views/admin/NotificationsManagementView.vue')
const RegulationsManagement = () => import('@/views/admin/RegulationsManagementView.vue')
const UsersManagement = () => import('@/views/admin/UsersManagementView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/regulation',
    name: 'regulations',
    component: RegulationsView
  },
  {
    path: '/wordpress',
    name: 'wordpress',
    component: WordpressView
  },
  {
    path: '/seo',
    name: 'seo',
    component: SEOView
  },
  // Routes cho xác thực
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    beforeEnter: requireGuest
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    beforeEnter: requireGuest
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    beforeEnter: requireAuth
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: ChangePasswordView,
    beforeEnter: requireAuth
  },
  // Routes cho trang quản trị Admin
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/dashboard',
    beforeEnter: requireAdmin
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashboard,
    beforeEnter: requireAdmin
  },
  {
    path: '/admin/notifications',
    name: 'admin-notifications',
    component: NotificationsManagement,
    beforeEnter: requireAdmin
  },
  {
    path: '/admin/regulations',
    name: 'admin-regulations',
    component: RegulationsManagement,
    beforeEnter: requireAdmin
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: UsersManagement,
    beforeEnter: requireAdmin
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router