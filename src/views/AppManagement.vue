<template>
  <div class="app-management">
    <!-- Header -->
    <div class="row mb-4">
      <PageHeader :isOfflineMode="false" title="App Management" desc="Manage your iOS/Android apps and their settings" />
      <div class="col-auto">
        <button class="btn btn-primary" @click="showAddAppModal = true">
          <i class="bi bi-plus-circle me-1"></i>
          Add App
        </button>
      </div>
    </div>

    <!-- Apps Grid -->
    <div class="row">
      <div class="col-md-6 col-lg-4 mb-4" v-for="app in apps" :key="app._id">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="d-flex align-items-center">
                <div class="app-icon bg-primary text-white rounded d-flex align-items-center justify-content-center me-3" style="width: 48px; height: 48px;">
                  <i :class="getPlatformIcon(app.platform)" class="fs-4"></i>
                </div>
                <div>
                  <h5 class="card-title mb-1">{{ app.name }}</h5>
                  <span :class="getPlatformBadgeClass(app.platform)">{{ app.platform }}</span>
                </div>
              </div>
              <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                  <i class="bi bi-three-dots"></i>
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" @click="editApp(app)">
                    <i class="bi bi-pencil me-2"></i>Edit
                  </a></li>
                  <li><a class="dropdown-item" href="#" @click="regenerateApiKey(app)">
                    <i class="bi bi-key me-2"></i>Regenerate API Key
                  </a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item text-danger" href="#" @click="deleteApp(app)">
                    <i class="bi bi-trash me-2"></i>Delete
                  </a></li>
                </ul>
              </div>
            </div>

            <div class="mb-3">
              <p class="text-muted mb-1">{{ app.description || 'No description provided' }}</p>
              <small class="text-muted">Version {{ app.version }}</small>
            </div>

            <div class="row g-2 mb-3">
              <div class="col-6">
                <div class="bg-light rounded p-2 text-center">
                  <div class="fw-bold text-primary">{{ appStats[app.appId]?.totalUsers || 0 }}</div>
                  <small class="text-muted">Total Users</small>
                </div>
              </div>
              <div class="col-6">
                <div class="bg-light rounded p-2 text-center">
                  <div class="fw-bold text-success">{{ appStats[app.appId]?.activeUsers || 0 }}</div>
                  <small class="text-muted">Active Users</small>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <small class="text-muted">App ID</small>
                <button class="btn btn-sm btn-outline-secondary" @click="copyToClipboard(app.appId)">
                  <i class="bi bi-clipboard"></i>
                </button>
              </div>
              <code class="small">{{ app.appId }}</code>
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <small class="text-muted">Bundle ID</small>
                <button class="btn btn-sm btn-outline-secondary" @click="copyToClipboard(app.bundleId)">
                  <i class="bi bi-clipboard"></i>
                </button>
              </div>
              <code class="small">{{ app.bundleId }}</code>
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <small class="text-muted">API Key</small>
                <button class="btn btn-sm btn-outline-secondary" @click="copyToClipboard(app.apiKey)">
                  <i class="bi bi-clipboard"></i>
                </button>
              </div>
              <code class="small">{{ maskApiKey(app.apiKey) }}</code>
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <span :class="app.isActive ? 'badge bg-success' : 'badge bg-secondary'">
                {{ app.isActive ? 'Active' : 'Inactive' }}
              </span>
              <small class="text-muted">
                Created {{ formatDate(app.createdAt) }}
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="col-12" v-if="apps.length === 0">
        <div class="text-center py-5">
          <i class="bi bi-phone display-1 text-muted"></i>
          <h3 class="mt-3">No Apps Yet</h3>
          <p class="text-muted">Create your first app to start managing users</p>
          <button class="btn btn-primary" @click="showAddAppModal = true">
            <i class="bi bi-plus-circle me-1"></i>
            Add Your First App
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit App Modal -->
    <div class="modal fade" :class="{ show: showAddAppModal }" :style="{ display: showAddAppModal ? 'block' : 'none' }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingApp ? 'Edit App' : 'Add New App' }}</h5>
            <button type="button" class="btn-close" @click="closeAppModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveApp">
              <div class="mb-3">
                <label class="form-label">App Name *</label>
                <input type="text" class="form-control" v-model="appForm.name" required>
              </div>
              
              <div class="mb-3">
                <label class="form-label">App ID *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="appForm.appId" 
                  :disabled="editingApp"
                  placeholder="e.g., com.yourcompany.myapp"
                  required
                >
                <small class="form-text text-muted">Unique identifier for your app</small>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Bundle ID *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="appForm.bundleId" 
                  :disabled="editingApp"
                  placeholder="e.g., com.yourcompany.myapp"
                  required
                >
                <small class="form-text text-muted">iOS Bundle ID or Android Package Name</small>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Platform *</label>
                <select class="form-select" v-model="appForm.platform" :disabled="editingApp" required>
                  <option value="">Select Platform</option>
                  <option value="iOS">iOS</option>
                  <option value="Android">Android</option>
                  <option value="Web">Web</option>
                </select>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Version *</label>
                <input type="text" class="form-control" v-model="appForm.version" placeholder="1.0.0" required>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="appForm.description" rows="3" placeholder="Brief description of your app"></textarea>
              </div>
              
              <div class="mb-3" v-if="!editingApp">
                <h6>App Settings</h6>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="appForm.settings.allowRegistration" id="allowRegistration">
                  <label class="form-check-label" for="allowRegistration">
                    Allow new user registrations
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="appForm.settings.requireEmailVerification" id="requireEmailVerification">
                  <label class="form-check-label" for="requireEmailVerification">
                    Require email verification
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeAppModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveApp">
              {{ editingApp ? 'Update App' : 'Create App' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ show: showAddAppModal }" v-if="showAddAppModal"></div>

    <!-- API Integration Guide Modal -->
    <div class="modal fade" :class="{ show: showApiGuideModal }" :style="{ display: showApiGuideModal ? 'block' : 'none' }">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">API Integration Guide</h5>
            <button type="button" class="btn-close" @click="showApiGuideModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              Use these endpoints to integrate your {{ selectedApp?.platform }} app with the backend.
            </div>
            
            <h6>Base URL</h6>
            <pre><code>{{ apiBaseUrl }}</code></pre>
            
            <h6 class="mt-3">Authentication Endpoints</h6>
            <div class="mb-3">
              <strong>Register User</strong>
              <pre><code>POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword",
  "appId": "{{ selectedApp?.appId }}",
  "firstName": "John",
  "lastName": "Doe"
}</code></pre>
            </div>
            
            <div class="mb-3">
              <strong>Login User</strong>
              <pre><code>POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "appId": "{{ selectedApp?.appId }}"
}</code></pre>
            </div>
            
            <div class="mb-3">
              <strong>Verify Token</strong>
              <pre><code>GET /api/auth/verify
Authorization: Bearer YOUR_JWT_TOKEN</code></pre>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showApiGuideModal = false">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ show: showApiGuideModal }" v-if="showApiGuideModal"></div>
  </div>
</template>

<script>
import api from '../services/api'
import PageHeader from '../components/PageHeader.vue'
import projectStore from '../services/projectStore.js'

export default {
  name: 'AppManagementView',
  components: {
    PageHeader
  },
  data() {
    return {
      apps: [],
      appStats: {},
      showAddAppModal: false,
      showApiGuideModal: false,
      editingApp: null,
      selectedApp: null,
      appForm: {
        name: '',
        appId: '',
        bundleId: '',
        platform: '',
        version: '',
        description: '',
        settings: {
          allowRegistration: true,
          requireEmailVerification: true,
          maxUsers: 10000,
          features: []
        }
      },
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001/api'
    }
  },
  async mounted() {
    await this.loadApps()
    await this.loadAppStats()
    
    this.unsubscribe = projectStore.subscribe((project) => {
      console.log('Project changed in AppManagement:', project)
      this.loadApps()
      this.loadAppStats()
    })
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
    async loadApps() {
      try {
        const response = await api.getApps()
        this.apps = response.data
      } catch (error) {
        console.error('Error loading apps:', error)
      }
    },
    
    async loadAppStats() {
      try {
        // Load user counts for each app
        for (const app of this.apps) {
          const response = await api.getUsers({ appId: app.appId, limit: 1 })
          this.appStats[app.appId] = {
            totalUsers: response.data.pagination.totalUsers,
            activeUsers: response.data.pagination.totalUsers // Simplified for demo
          }
        }
      } catch (error) {
        console.error('Error loading app stats:', error)
      }
    },
    
    editApp(app) {
      this.editingApp = app
      this.appForm = {
        name: app.name,
        appId: app.appId,
        bundleId: app.bundleId,
        platform: app.platform,
        version: app.version,
        description: app.description || '',
        settings: app.settings || {
          allowRegistration: true,
          requireEmailVerification: true,
          maxUsers: 10000,
          features: []
        }
      }
      this.showAddAppModal = true
    },
    
    async saveApp() {
      try {
        if (this.editingApp) {
          await api.updateApp(this.editingApp._id, this.appForm)
        } else {
          await api.createApp(this.appForm)
        }
        this.closeAppModal()
        this.loadApps()
        this.loadAppStats()
      } catch (error) {
        console.error('Error saving app:', error)
        alert('Error saving app. Please check the form and try again.')
      }
    },
    
    closeAppModal() {
      this.showAddAppModal = false
      this.editingApp = null
      this.appForm = {
        name: '',
        appId: '',
        bundleId: '',
        platform: '',
        version: '',
        description: '',
        settings: {
          allowRegistration: true,
          requireEmailVerification: true,
          maxUsers: 10000,
          features: []
        }
      }
    },
    
    async deleteApp(app) {
      if (confirm(`Are you sure you want to delete "${app.name}"? This will also delete all associated users.`)) {
        try {
          await api.deleteApp(app._id)
          this.loadApps()
          this.loadAppStats()
        } catch (error) {
          console.error('Error deleting app:', error)
        }
      }
    },
    
    async regenerateApiKey(app) {
      if (confirm('Are you sure you want to regenerate the API key? This will invalidate the current key.')) {
        try {
          await api.regenerateApiKey(app._id)
          this.loadApps()
        } catch (error) {
          console.error('Error regenerating API key:', error)
        }
      }
    },
    
    showApiGuide(app) {
      this.selectedApp = app
      this.showApiGuideModal = true
    },
    
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        // Could show a toast notification here
        console.log('Copied to clipboard:', text)
      })
    },
    
    maskApiKey(apiKey) {
      if (!apiKey) return ''
      return apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4)
    },
    
    formatDate(date) {
      if (!date) return 'Unknown'
      return new Date(date).toLocaleDateString()
    },
    
    getPlatformIcon(platform) {
      const icons = {
        'iOS': 'bi bi-phone',
        'Android': 'bi bi-phone',
        'Web': 'bi bi-globe'
      }
      return icons[platform] || 'bi bi-question-circle'
    },
    
    getPlatformBadgeClass(platform) {
      const classes = {
        'iOS': 'badge bg-primary',
        'Android': 'badge bg-success',
        'Web': 'badge bg-info'
      }
      return classes[platform] || 'badge bg-secondary'
    }
  }
}
</script>

<style scoped>
.app-icon {
  font-size: 1.5rem;
}

.modal {
  backdrop-filter: blur(4px);
}

.modal.show {
  display: block !important;
}

pre {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

code {
  background-color: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}
</style>
