// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BlogspotView from '@/views/BlogspotView.vue'
import WordpressView from '@/views/WordPressView'
import SEOView from '@/views/SEOView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import { requireAuth, requireGuest } from './auth-guard'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/blogspot',
    name: 'blogspot',
    component: BlogspotView
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router