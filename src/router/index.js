// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BlogspotView from '@/views/BlogspotView.vue'
import WordpressView from '@/views/WordPressView'
import SEOView from '@/views/SEOView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router