import axios from 'axios'
import localStorageService from './localStorageService'
import projectStore from './projectStore'

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001/api'
const USE_LOCAL_STORAGE = process.env.VUE_APP_USE_LOCAL_STORAGE === 'true' || true // Default to true for offline development

let api = null

if (!USE_LOCAL_STORAGE) {
  api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  api.interceptors.request.use(
    config => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken')
      }
      return Promise.reject(error)
    }
  )
}

export default {
  getUsers(params = {}) {
    if (USE_LOCAL_STORAGE) {
      const currentProject = projectStore.getCurrentProject()
      return localStorageService.getUsers({ ...params, projectId: currentProject.id })
    }
    const currentProject = projectStore.getCurrentProject()
    return api.get('/users', { params: { ...params, projectId: currentProject.id } })
  },
  getUser(id) {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.getUser(id)
    }
    return api.get(`/users/${id}`)
  },
  createUser(userData) {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.createUser(userData)
    }
    return api.post('/users', userData)
  },
  updateUser(id, userData) {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.updateUser(id, userData)
    }
    return api.put(`/users/${id}`, userData)
  },
  deleteUser(id) {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.deleteUser(id)
    }
    return api.delete(`/users/${id}`)
  },
  blockUser(id, blocked) {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.blockUser(id, blocked)
    }
    return api.patch(`/users/${id}/block`, { blocked })
  },
  getUserAnalytics(id) {
    if (USE_LOCAL_STORAGE) {
      return Promise.resolve({
        data: {
          userId: id,
          registrationDate: new Date().toISOString(),
          lastLoginDate: new Date().toISOString(),
          totalLogins: 42,
          accountAge: 30,
          subscriptionStatus: 'premium',
          isActive: true,
          deviceInfo: {
            deviceType: 'iOS',
            deviceModel: 'iPhone 15',
            osVersion: '17.0',
            appVersion: '1.2.0'
          }
        }
      })
    }
    return api.get(`/users/${id}/analytics`)
  },

  getApps() {
    if (USE_LOCAL_STORAGE) {
      const currentProject = projectStore.getCurrentProject()
      return localStorageService.getApps(currentProject.id)
    }
    const currentProject = projectStore.getCurrentProject()
    return api.get('/apps', { params: { projectId: currentProject.id } })
  },
  getApp(id) {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.getApp(id)
    }
    return api.get(`/apps/${id}`)
  },
  createApp(appData) {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.createApp(appData)
    }
    return api.post('/apps', appData)
  },
  updateApp(id, appData) {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.updateApp(id, appData)
    }
    return api.put(`/apps/${id}`, appData)
  },
  deleteApp(id) {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.deleteApp(id)
    }
    return api.delete(`/apps/${id}`)
  },
  regenerateApiKey(id) {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.regenerateApiKey(id)
    }
    return api.post(`/apps/${id}/regenerate-key`)
  },

  getDashboardAnalytics(appId = null) {
    if (USE_LOCAL_STORAGE) {
      const currentProject = projectStore.getCurrentProject()
      return localStorageService.getDashboardAnalytics(appId, currentProject.id)
    }
    const currentProject = projectStore.getCurrentProject()
    const params = appId ? { appId, projectId: currentProject.id } : { projectId: currentProject.id }
    return api.get('/analytics/dashboard', { params })
  },
  getGrowthAnalytics(appId = null, period = '30') {
    if (USE_LOCAL_STORAGE) {
      const currentProject = projectStore.getCurrentProject()
      return localStorageService.getGrowthAnalytics(appId, period, currentProject.id)
    }
    const currentProject = projectStore.getCurrentProject()
    const params = { period, projectId: currentProject.id }
    if (appId) params.appId = appId
    return api.get('/analytics/growth', { params })
  },
  getRetentionAnalytics(appId = null) {
    if (USE_LOCAL_STORAGE) {
      const currentProject = projectStore.getCurrentProject()
      return localStorageService.getRetentionAnalytics(appId, currentProject.id)
    }
    const currentProject = projectStore.getCurrentProject()
    const params = appId ? { appId, projectId: currentProject.id } : { projectId: currentProject.id }
    return api.get('/analytics/retention', { params })
  },

  register(userData) {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.createUser(userData).then(response => ({
        data: {
          message: 'User registered successfully',
          user: response.data,
          token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 16)
        }
      }))
    }
    return api.post('/auth/register', userData)
  },
  login(credentials) {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.getUsers({ search: credentials.email }).then(response => {
        const user = response.data.users.find(u => u.email === credentials.email)
        if (user) {
          return {
            data: {
              message: 'Login successful',
              user,
              token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 16)
            }
          }
        } else {
          throw new Error('Invalid credentials')
        }
      })
    }
    return api.post('/auth/login', credentials)
  },
  verifyToken() {
    if (USE_LOCAL_STORAGE) {
      return Promise.resolve({
        data: {
          user: {
            _id: '1',
            username: 'admin',
            email: 'admin@example.com'
          },
          valid: true
        }
      })
    }
    return api.get('/auth/verify')
  },
  forgotPassword(email, appId) {
    if (USE_LOCAL_STORAGE) {
      return Promise.resolve({
        data: {
          message: 'If an account with this email exists, a password reset link has been sent.'
        }
      })
    }
    return api.post('/auth/forgot-password', { email, appId })
  }
}
