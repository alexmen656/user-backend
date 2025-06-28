<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="row mb-4">
      <PageHeader :isOfflineMode="isOfflineMode" title="Dashboard" desc="Overview of your user management system" />
      <div class="col-auto">
        <select class="form-select" v-model="selectedAppId" @change="loadAnalytics">
          <option value="">All Apps</option>
          <option v-for="app in apps" :key="app._id" :value="app.appId">
            {{ app.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card border-0 bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title mb-1">Total Users</h6>
                <h3 class="mb-0">{{ analytics.overview?.totalUsers || 0 }}</h3>
              </div>
              <div class="align-self-center">
                <i class="bi bi-people fs-1 opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title mb-1">Active Users</h6>
                <h3 class="mb-0">{{ analytics.overview?.activeUsers || 0 }}</h3>
              </div>
              <div class="align-self-center">
                <i class="bi bi-person-check fs-1 opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 bg-warning text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title mb-1">Premium Users</h6>
                <h3 class="mb-0">{{ analytics.overview?.premiumUsers || 0 }}</h3>
              </div>
              <div class="align-self-center">
                <i class="bi bi-star fs-1 opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 bg-info text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title mb-1">New (30 days)</h6>
                <h3 class="mb-0">{{ analytics.overview?.newUsersLast30Days || 0 }}</h3>
              </div>
              <div class="align-self-center">
                <i class="bi bi-person-plus fs-1 opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row mb-4">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Daily Registrations (Last 7 Days)</h5>
          </div>
          <div class="card-body">
            <canvas ref="registrationChart" height="300"></canvas>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Subscription Distribution</h5>
          </div>
          <div class="card-body">
            <canvas ref="subscriptionChart" height="300"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Users and Platform Stats -->
    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Most Active Users</h5>
            <router-link to="/users" class="btn btn-sm btn-outline-primary">View All</router-link>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Login Count</th>
                    <th>Last Login</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in analytics.topUsers" :key="user._id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div
                          class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                          style="width: 32px; height: 32px;">
                          {{ user.username.charAt(0).toUpperCase() }}
                        </div>
                        {{ user.username }}
                      </div>
                    </td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.loginCount }}</td>
                    <td>{{ formatDate(user.lastLoginAt) }}</td>
                    <td>
                      <span :class="getStatusBadgeClass(user.subscriptionStatus)">
                        {{ user.subscriptionStatus }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Platform Distribution</h5>
          </div>
          <div class="card-body">
            <div v-for="platform in analytics.platformStats" :key="platform._id"
              class="d-flex justify-content-between align-items-center mb-2">
              <div class="d-flex align-items-center">
                <i :class="getPlatformIcon(platform._id)" class="me-2"></i>
                <span>{{ platform._id || 'Unknown' }}</span>
              </div>
              <span class="badge bg-secondary">{{ platform.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import Chart from 'chart.js/auto'
import PageHeader from '@/components/PageHeader.vue'
import projectStore from '@/services/projectStore.js'

export default {
  name: 'DashboardView',
  components: {
    PageHeader
  },
  data() {
    return {
      analytics: {},
      apps: [],
      selectedAppId: '',
      registrationChart: null,
      subscriptionChart: null,
      isOfflineMode: process.env.VUE_APP_USE_LOCAL_STORAGE === 'true'
    }
  },
  async mounted() {
    await this.loadApps()
    await this.loadAnalytics()
    
    this.unsubscribe = projectStore.subscribe((project) => {
      console.log('Project changed in Dashboard:', project)
      this.selectedAppId = ''
      this.loadApps()
      this.loadAnalytics()
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

    async loadAnalytics() {
      try {
        const response = await api.getDashboardAnalytics(this.selectedAppId || null)
        this.analytics = response.data

        this.$nextTick(() => {
          this.renderCharts()
        })
      } catch (error) {
        console.error('Error loading analytics:', error)
      }
    },

    renderCharts() {
      this.renderRegistrationChart()
      this.renderSubscriptionChart()
    },

    renderRegistrationChart() {
      if (this.registrationChart) {
        this.registrationChart.destroy()
      }

      const ctx = this.$refs.registrationChart
      const data = this.analytics.dailyRegistrations || []

      this.registrationChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(d => d._id),
          datasets: [{
            label: 'New Registrations',
            data: data.map(d => d.count),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    },

    renderSubscriptionChart() {
      if (this.subscriptionChart) {
        this.subscriptionChart.destroy()
      }

      const ctx = this.$refs.subscriptionChart
      const data = this.analytics.subscriptionStats || []

      this.subscriptionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.map(d => d._id),
          datasets: [{
            data: data.map(d => d.count),
            backgroundColor: [
              '#007bff',
              '#28a745',
              '#ffc107',
              '#dc3545'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    },

    formatDate(date) {
      if (!date) return 'Never'
      return new Date(date).toLocaleDateString()
    },

    getStatusBadgeClass(status) {
      const classes = {
        'free': 'badge bg-secondary',
        'premium': 'badge bg-success',
        'trial': 'badge bg-warning',
        'expired': 'badge bg-danger'
      }
      return classes[status] || 'badge bg-secondary'
    },

    getPlatformIcon(platform) {
      const icons = {
        'iOS': 'bi bi-phone',
        'Android': 'bi bi-phone',
        'Web': 'bi bi-globe'
      }
      return icons[platform] || 'bi bi-question-circle'
    }
  }
}
</script>

<style scoped>
.avatar {
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
