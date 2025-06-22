<template>
  <div class="user-management">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col">
        <h1 class="h3 mb-0">
          User Management
          <span v-if="isOfflineMode" class="badge bg-warning ms-2">
            <i class="bi bi-wifi-off me-1"></i>
            Offline Mode
          </span>
        </h1>
        <p class="text-muted">Manage all your app users in one place</p>
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" @click="showAddUserModal = true">
          <i class="bi bi-plus-circle me-1"></i>
          Add User
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Search</label>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search users..." 
              v-model="filters.search"
              @input="debouncedSearch"
            >
          </div>
          <div class="col-md-2">
            <label class="form-label">App</label>
            <select class="form-select" v-model="filters.appId">
              <option value="">All Apps</option>
              <option v-for="app in apps" :key="app._id" :value="app.appId">
                {{ app.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Status</label>
            <select class="form-select" v-model="filters.status">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Subscription</label>
            <select class="form-select" v-model="filters.subscription">
              <option value="">All Subscriptions</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="trial">Trial</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div class="col-md-1">
            <label class="form-label">Limit</label>
            <select class="form-select" v-model="filters.limit">
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button class="btn btn-outline-secondary me-2" @click="resetFilters">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Reset
            </button>
            <button class="btn btn-primary" @click="loadUsers">
              <i class="bi bi-search me-1"></i>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">
          Users ({{ pagination.totalUsers || 0 }})
        </h5>
        <div class="d-flex align-items-center">
          <span class="text-muted me-3">
            Showing {{ ((pagination.currentPage - 1) * parseInt(filters.limit)) + 1 }} to 
            {{ Math.min(pagination.currentPage * parseInt(filters.limit), pagination.totalUsers) }} 
            of {{ pagination.totalUsers }}
          </span>
        </div>
      </div>
      
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    class="form-check-input" 
                    v-model="selectAll"
                    @change="toggleSelectAll"
                  >
                </th>
                <th>User</th>
                <th>Email</th>
                <th>App</th>
                <th>Status</th>
                <th>Subscription</th>
                <th>Last Login</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td>
                  <input 
                    type="checkbox" 
                    class="form-check-input" 
                    v-model="selectedUsers"
                    :value="user._id"
                  >
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 40px; height: 40px;">
                      {{ user.username.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ user.username }}</div>
                      <div class="text-muted small">{{ user.firstName }} {{ user.lastName }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge bg-info">{{ user.appId }}</span>
                </td>
                <td>
                  <span :class="getStatusBadgeClass(user)">
                    {{ getUserStatus(user) }}
                  </span>
                </td>
                <td>
                  <span :class="getSubscriptionBadgeClass(user.subscriptionStatus)">
                    {{ user.subscriptionStatus }}
                  </span>
                </td>
                <td>{{ formatDate(user.lastLoginAt) }}</td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                      Actions
                    </button>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#" @click="editUser(user)">
                        <i class="bi bi-pencil me-2"></i>Edit
                      </a></li>
                      <li><a class="dropdown-item" href="#" @click="viewUserDetails(user)">
                        <i class="bi bi-eye me-2"></i>View Details
                      </a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item" href="#" @click="toggleBlockUser(user)">
                        <i :class="user.isBlocked ? 'bi bi-unlock me-2' : 'bi bi-lock me-2'"></i>
                        {{ user.isBlocked ? 'Unblock' : 'Block' }}
                      </a></li>
                      <li><a class="dropdown-item text-danger" href="#" @click="deleteUser(user)">
                        <i class="bi bi-trash me-2"></i>Delete
                      </a></li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="card-footer" v-if="pagination.totalPages > 1">
        <nav>
          <ul class="pagination justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: !pagination.hasPrevPage }">
              <a class="page-link" href="#" @click.prevent="changePage(pagination.currentPage - 1)">
                Previous
              </a>
            </li>
            <li 
              v-for="page in getPageNumbers()" 
              :key="page" 
              class="page-item" 
              :class="{ active: page === pagination.currentPage }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: !pagination.hasNextPage }">
              <a class="page-link" href="#" @click.prevent="changePage(pagination.currentPage + 1)">
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div class="row mt-3" v-if="selectedUsers.length > 0">
      <div class="col">
        <div class="card bg-light">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <span>{{ selectedUsers.length }} user(s) selected</span>
              <div>
                <button class="btn btn-sm btn-warning me-2" @click="bulkAction('block')">
                  <i class="bi bi-lock me-1"></i>Block Selected
                </button>
                <button class="btn btn-sm btn-danger" @click="bulkAction('delete')">
                  <i class="bi bi-trash me-1"></i>Delete Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div class="modal fade" :class="{ show: showAddUserModal }" :style="{ display: showAddUserModal ? 'block' : 'none' }">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingUser ? 'Edit User' : 'Add New User' }}</h5>
            <button type="button" class="btn-close" @click="closeUserModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Username *</label>
                  <input type="text" class="form-control" v-model="userForm.username" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email *</label>
                  <input type="email" class="form-control" v-model="userForm.email" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-control" v-model="userForm.firstName">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-control" v-model="userForm.lastName">
                </div>
                <div class="col-md-6">
                  <label class="form-label">App ID *</label>
                  <select class="form-select" v-model="userForm.appId" required>
                    <option value="">Select App</option>
                    <option v-for="app in apps" :key="app._id" :value="app.appId">
                      {{ app.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Subscription Status</label>
                  <select class="form-select" v-model="userForm.subscriptionStatus">
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="trial">Trial</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div class="col-md-6" v-if="!editingUser">
                  <label class="form-label">Password *</label>
                  <input type="password" class="form-control" v-model="userForm.password" :required="!editingUser">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Phone Number</label>
                  <input type="tel" class="form-control" v-model="userForm.phoneNumber">
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeUserModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveUser">
              {{ editingUser ? 'Update User' : 'Create User' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ show: showAddUserModal }" v-if="showAddUserModal"></div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'UserManagementView',
  data() {
    return {
      users: [],
      apps: [],
      pagination: {},
      filters: {
        search: '',
        appId: '',
        status: '',
        subscription: '',
        limit: '20',
        page: 1
      },
      selectedUsers: [],
      selectAll: false,
      showAddUserModal: false,
      editingUser: null,
      userForm: {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        appId: '',
        subscriptionStatus: 'free',
        password: '',
        phoneNumber: ''
      },
      searchTimeout: null,
      isOfflineMode: process.env.VUE_APP_USE_LOCAL_STORAGE === 'true'
    }
  },
  async mounted() {
    await this.loadApps()
    await this.loadUsers()
    this.checkOfflineMode()
    window.addEventListener('offline', this.checkOfflineMode)
    window.addEventListener('online', this.checkOfflineMode)
  },
  beforeUnmount() {
    window.removeEventListener('offline', this.checkOfflineMode)
    window.removeEventListener('online', this.checkOfflineMode)
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
    
    async loadUsers() {
      try {
        const params = {
          page: this.filters.page,
          limit: this.filters.limit
        }
        
        if (this.filters.search) params.search = this.filters.search
        if (this.filters.appId) params.appId = this.filters.appId
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.subscription) params.subscription = this.filters.subscription
        
        const response = await api.getUsers(params)
        this.users = response.data.users
        this.pagination = response.data.pagination
        this.selectedUsers = []
        this.selectAll = false
      } catch (error) {
        console.error('Error loading users:', error)
      }
    },
    
    debouncedSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.filters.page = 1
        this.loadUsers()
      }, 500)
    },
    
    resetFilters() {
      this.filters = {
        search: '',
        appId: '',
        status: '',
        subscription: '',
        limit: '20',
        page: 1
      }
      this.loadUsers()
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.filters.page = page
        this.loadUsers()
      }
    },
    
    getPageNumbers() {
      const pages = []
      const current = this.pagination.currentPage
      const total = this.pagination.totalPages
      
      for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
        pages.push(i)
      }
      return pages
    },
    
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedUsers = this.users.map(u => u._id)
      } else {
        this.selectedUsers = []
      }
    },
    
    editUser(user) {
      this.editingUser = user
      this.userForm = {
        username: user.username,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        appId: user.appId,
        subscriptionStatus: user.subscriptionStatus,
        password: '',
        phoneNumber: user.phoneNumber || ''
      }
      this.showAddUserModal = true
    },
    
    async saveUser() {
      try {
        if (this.editingUser) {
          await api.updateUser(this.editingUser._id, this.userForm)
        } else {
          await api.createUser(this.userForm)
        }
        this.closeUserModal()
        this.loadUsers()
      } catch (error) {
        console.error('Error saving user:', error)
        alert('Error saving user. Please check the form and try again.')
      }
    },
    
    closeUserModal() {
      this.showAddUserModal = false
      this.editingUser = null
      this.userForm = {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        appId: '',
        subscriptionStatus: 'free',
        password: '',
        phoneNumber: ''
      }
    },
    
    async toggleBlockUser(user) {
      try {
        await api.blockUser(user._id, !user.isBlocked)
        this.loadUsers()
      } catch (error) {
        console.error('Error updating user block status:', error)
      }
    },
    
    async deleteUser(user) {
      if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
        try {
          await api.deleteUser(user._id)
          this.loadUsers()
        } catch (error) {
          console.error('Error deleting user:', error)
        }
      }
    },
    
    viewUserDetails(user) {
      // Implement user details view
      console.log('View user details:', user)
    },
    
    async bulkAction(action) {
      if (action === 'delete') {
        if (confirm(`Are you sure you want to delete ${this.selectedUsers.length} user(s)?`)) {
          for (const userId of this.selectedUsers) {
            try {
              await api.deleteUser(userId)
            } catch (error) {
              console.error('Error deleting user:', error)
            }
          }
          this.loadUsers()
        }
      } else if (action === 'block') {
        for (const userId of this.selectedUsers) {
          try {
            await api.blockUser(userId, true)
          } catch (error) {
            console.error('Error blocking user:', error)
          }
        }
        this.loadUsers()
      }
    },
    
    formatDate(date) {
      if (!date) return 'Never'
      return new Date(date).toLocaleDateString()
    },
    
    getUserStatus(user) {
      if (user.isBlocked) return 'Blocked'
      if (!user.isActive) return 'Inactive'
      return 'Active'
    },
    
    getStatusBadgeClass(user) {
      if (user.isBlocked) return 'badge bg-danger'
      if (!user.isActive) return 'badge bg-warning'
      return 'badge bg-success'
    },
    
    getSubscriptionBadgeClass(status) {
      const classes = {
        'free': 'badge bg-secondary',
        'premium': 'badge bg-success',
        'trial': 'badge bg-warning',
        'expired': 'badge bg-danger'
      }
      return classes[status] || 'badge bg-secondary'
    },
    
    checkOfflineMode() {
      this.isOfflineMode = !navigator.onLine
    }
  },
  watch: {
    'filters.appId'() {
      this.filters.page = 1
      this.loadUsers()
    },
    'filters.status'() {
      this.filters.page = 1
      this.loadUsers()
    },
    'filters.subscription'() {
      this.filters.page = 1
      this.loadUsers()
    },
    'filters.limit'() {
      this.filters.page = 1
      this.loadUsers()
    }
  }
}
</script>

<style scoped>
.avatar {
  font-size: 1rem;
  font-weight: 600;
}

.modal {
  backdrop-filter: blur(4px);
}

.modal.show {
  display: block !important;
}

.table th {
  white-space: nowrap;
}
</style>
