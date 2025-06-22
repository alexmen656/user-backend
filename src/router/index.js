import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import UserManagement from '../views/UserManagement.vue'
import AppManagement from '../views/AppManagement.vue'
import Analytics from '../views/Analytics.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: UserManagement
  },
  {
    path: '/apps',
    name: 'AppManagement',
    component: AppManagement
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
