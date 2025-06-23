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

    <!-- User Details Modal -->
    <div class="modal fade" :class="{ show: showUserDetailsModal }" :style="{ display: showUserDetailsModal ? 'block' : 'none' }">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-person-circle me-2"></i>
              User Details - {{ selectedUserDetails?.username }}
            </h5>
            <button type="button" class="btn-close" @click="closeUserDetailsModal"></button>
          </div>
          <div class="modal-body" v-if="selectedUserDetails">
            <div class="row g-4">
              <!-- Basic Information -->
              <div class="col-lg-6">
                <div class="card h-100">
                  <div class="card-header">
                    <h6 class="card-title mb-0">
                      <i class="bi bi-person me-2"></i>
                      Basic Information
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="row g-3">
                      <div class="col-12">
                        <div class="d-flex align-items-center mb-3">
                          <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px; font-size: 1.5rem;">
                            {{ selectedUserDetails.username.charAt(0).toUpperCase() }}
                          </div>
                          <div>
                            <h5 class="mb-0">{{ selectedUserDetails.username }}</h5>
                            <span :class="getStatusBadgeClass(selectedUserDetails)">
                              {{ getUserStatus(selectedUserDetails) }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label text-muted small">Email</label>
                        <div class="fw-bold">{{ selectedUserDetails.email }}</div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label text-muted small">User ID</label>
                        <div class="fw-bold font-monospace small">{{ selectedUserDetails._id }}</div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label text-muted small">First Name</label>
                        <div class="fw-bold">{{ selectedUserDetails.firstName || 'Not provided' }}</div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label text-muted small">Last Name</label>
                        <div class="fw-bold">{{ selectedUserDetails.lastName || 'Not provided' }}</div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label text-muted small">Phone Number</label>
                        <div class="fw-bold">{{ selectedUserDetails.phoneNumber || 'Not provided' }}</div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label text-muted small">App ID</label>
                        <div>
                          <span class="badge bg-info">{{ selectedUserDetails.appId }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Account Status & Subscription -->
              <div class="col-lg-6">
                <div class="card h-100">
                  <div class="card-header">
                    <h6 class="card-title mb-0">
                      <i class="bi bi-shield-check me-2"></i>
                      Account Status
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label text-muted small">Status</label>
                        <div>
                          <span :class="getStatusBadgeClass(selectedUserDetails)">
                            {{ getUserStatus(selectedUserDetails) }}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label text-muted small">Subscription</label>
                        <div>
                          <span :class="getSubscriptionBadgeClass(selectedUserDetails.subscriptionStatus)">
                            {{ selectedUserDetails.subscriptionStatus }}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label text-muted small">Is Active</label>
                        <div>
                          <span :class="selectedUserDetails.isActive ? 'badge bg-success' : 'badge bg-secondary'">
                            {{ selectedUserDetails.isActive ? 'Yes' : 'No' }}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label text-muted small">Is Blocked</label>
                        <div>
                          <span :class="selectedUserDetails.isBlocked ? 'badge bg-danger' : 'badge bg-success'">
                            {{ selectedUserDetails.isBlocked ? 'Yes' : 'No' }}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label text-muted small">Email Verified</label>
                        <div>
                          <span :class="selectedUserDetails.isEmailVerified ? 'badge bg-success' : 'badge bg-warning'">
                            {{ selectedUserDetails.isEmailVerified ? 'Verified' : 'Not Verified' }}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label text-muted small">Two-Factor Auth</label>
                        <div>
                          <span :class="selectedUserDetails.hasTwoFactorAuth ? 'badge bg-success' : 'badge bg-secondary'">
                            {{ selectedUserDetails.hasTwoFactorAuth ? 'Enabled' : 'Disabled' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Activity Information -->
              <div class="col-lg-6">
                <div class="card h-100">
                  <div class="card-header">
                    <h6 class="card-title mb-0">
                      <i class="bi bi-clock-history me-2"></i>
                      Activity Information
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="row g-3">
                      <div class="col-12">
                        <label class="form-label text-muted small">Registration Date</label>
                        <div class="fw-bold">{{ formatDateTime(selectedUserDetails.createdAt) }}</div>
                      </div>
                      <div class="col-12">
                        <label class="form-label text-muted small">Last Updated</label>
                        <div class="fw-bold">{{ formatDateTime(selectedUserDetails.updatedAt) }}</div>
                      </div>
                      <div class="col-12">
                        <label class="form-label text-muted small">Last Login</label>
                        <div class="fw-bold">{{ formatDateTime(selectedUserDetails.lastLoginAt) }}</div>
                      </div>
                      <div class="col-12">
                        <label class="form-label text-muted small">Last IP Address</label>
                        <div class="fw-bold font-monospace">{{ selectedUserDetails.lastIpAddress || 'Not available' }}</div>
                      </div>
                      <div class="col-12">
                        <label class="form-label text-muted small">Login Count</label>
                        <div class="fw-bold">{{ selectedUserDetails.loginCount || 0 }} times</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Additional Information -->
              <div class="col-lg-6">
                <div class="card h-100">
                  <div class="card-header">
                    <h6 class="card-title mb-0">
                      <i class="bi bi-info-circle me-2"></i>
                      Additional Information
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="row g-3">
                      <div class="col-12">
                        <label class="form-label text-muted small">Profile Picture</label>
                        <div>
                          <span v-if="selectedUserDetails.profilePicture" class="badge bg-success">Available</span>
                          <span v-else class="badge bg-secondary">Not set</span>
                        </div>
                      </div>
                      <div class="col-12">
                        <label class="form-label text-muted small">Language Preference</label>
                        <div class="fw-bold">{{ selectedUserDetails.language || 'Not set' }}</div>
                      </div>
                      <div class="col-12">
                        <label class="form-label text-muted small">Timezone</label>
                        <div class="fw-bold">{{ selectedUserDetails.timezone || 'Not set' }}</div>
                      </div>
                      <div class="col-12">
                        <label class="form-label text-muted small">Subscription Expires</label>
                        <div class="fw-bold">{{ formatDateTime(selectedUserDetails.subscriptionExpiresAt) }}</div>
                      </div>
                      <div class="col-12">
                        <label class="form-label text-muted small">Device Count</label>
                        <div class="fw-bold">{{ selectedUserDetails.deviceCount || 0 }} devices</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- User Actions -->
              <div class="col-12">
                <div class="card">
                  <div class="card-header">
                    <h6 class="card-title mb-0">
                      <i class="bi bi-tools me-2"></i>
                      Quick Actions
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="d-flex flex-wrap gap-2">
                      <button class="btn btn-primary btn-sm" @click="editUser(selectedUserDetails)">
                        <i class="bi bi-pencil me-1"></i>Edit User
                      </button>
                      <button 
                        class="btn btn-sm" 
                        :class="selectedUserDetails.isBlocked ? 'btn-success' : 'btn-warning'"
                        @click="toggleBlockUser(selectedUserDetails)"
                      >
                        <i :class="selectedUserDetails.isBlocked ? 'bi bi-unlock me-1' : 'bi bi-lock me-1'"></i>
                        {{ selectedUserDetails.isBlocked ? 'Unblock User' : 'Block User' }}
                      </button>
                      <button class="btn btn-danger btn-sm" @click="deleteUser(selectedUserDetails)">
                        <i class="bi bi-trash me-1"></i>Delete User
                      </button>
                      <button class="btn btn-info btn-sm" @click="sendNotificationToUser(selectedUserDetails)">
                        <i class="bi bi-bell me-1"></i>Send Notification
                      </button>
                      <button class="btn btn-secondary btn-sm" @click="exportUserData(selectedUserDetails)">
                        <i class="bi bi-download me-1"></i>Export Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeUserDetailsModal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ show: showUserDetailsModal }" v-if="showUserDetailsModal"></div>
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
      showUserDetailsModal: false,
      editingUser: null,
      selectedUserDetails: null,
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
      this.selectedUserDetails = user
      this.showUserDetailsModal = true
    },
    
    closeUserDetailsModal() {
      this.showUserDetailsModal = false
      this.selectedUserDetails = null
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
    
    async sendNotificationToUser(user) {
      try {
        // This would typically send a notification to the user
        // For now, we'll just show an alert
        alert(`Notification sent to ${user.username}`)
        // In a real implementation, you might call:
        // await api.sendNotification(user._id, { message: 'Your notification message' })
      } catch (error) {
        console.error('Error sending notification:', error)
        alert('Failed to send notification')
      }
    },
    
    async exportUserData(user) {
      try {
        // Create a downloadable JSON file with user data
        const userData = {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          appId: user.appId,
          subscriptionStatus: user.subscriptionStatus,
          isActive: user.isActive,
          isBlocked: user.isBlocked,
          isEmailVerified: user.isEmailVerified,
          hasTwoFactorAuth: user.hasTwoFactorAuth,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt,
          lastIpAddress: user.lastIpAddress,
          loginCount: user.loginCount
        }
        
        const dataStr = JSON.stringify(userData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `user_${user.username}_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        alert(`User data exported for ${user.username}`)
      } catch (error) {
        console.error('Error exporting user data:', error)
        alert('Failed to export user data')
      }
    },
    
    formatDate(date) {
      if (!date) return 'Never'
      return new Date(date).toLocaleDateString()
    },
    
    formatDateTime(dateTime) {
      if (!dateTime) return 'Never'
      return new Date(dateTime).toLocaleString()
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
