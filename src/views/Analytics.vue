<template>
  <div class="analytics">
    <!-- Header -->
    <div class="row mb-4">
      <PageHeader :isOfflineMode="false" title="Analytics" desc="Detailed insights into your user base and app performance" />
      <div class="col-auto">
        <select class="form-select" v-model="selectedAppId" @change="loadAnalytics">
          <option value="">All Apps</option>
          <option v-for="app in apps" :key="app._id" :value="app.appId">
            {{ app.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h2 class="text-primary mb-1">{{ retentionAnalytics.weeklyRetention || 0 }}%</h2>
            <p class="text-muted mb-0">Weekly Retention</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h2 class="text-success mb-1">{{ retentionAnalytics.monthlyRetention || 0 }}%</h2>
            <p class="text-muted mb-0">Monthly Retention</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h2 class="text-warning mb-1">{{ retentionAnalytics.activeUsersWeek || 0 }}</h2>
            <p class="text-muted mb-0">Active This Week</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h2 class="text-info mb-1">{{ retentionAnalytics.activeUsersMonth || 0 }}</h2>
            <p class="text-muted mb-0">Active This Month</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Growth Chart -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">User Growth</h5>
            <div>
              <button 
                v-for="period in growthPeriods" 
                :key="period.value"
                class="btn btn-sm me-1"
                :class="selectedGrowthPeriod === period.value ? 'btn-primary' : 'btn-outline-primary'"
                @click="changeGrowthPeriod(period.value)"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
          <div class="card-body">
            <canvas ref="growthChart" height="400"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Grid -->
    <div class="row">
      <!-- Subscription Breakdown -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Subscription Breakdown</h5>
          </div>
          <div class="card-body">
            <canvas ref="subscriptionChart" height="300"></canvas>
          </div>
        </div>
      </div>

      <!-- Platform Distribution -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Platform Distribution</h5>
          </div>
          <div class="card-body">
            <div v-for="platform in dashboardAnalytics.platformStats" :key="platform._id" class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center">
                <i :class="getPlatformIcon(platform._id)" class="me-2 fs-5"></i>
                <span>{{ platform._id || 'Unknown' }}</span>
              </div>
              <div class="d-flex align-items-center">
                <div class="progress me-3" style="width: 100px; height: 8px;">
                  <div 
                    class="progress-bar" 
                    :style="{ width: getPlatformPercentage(platform.count) + '%' }"
                  ></div>
                </div>
                <span class="fw-bold">{{ platform.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Registration Sources -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Registration Sources</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Users</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Organic</td>
                    <td>{{ getRegistrationSourceCount('organic') }}</td>
                    <td>{{ getRegistrationSourcePercentage('organic') }}%</td>
                  </tr>
                  <tr>
                    <td>Referral</td>
                    <td>{{ getRegistrationSourceCount('referral') }}</td>
                    <td>{{ getRegistrationSourcePercentage('referral') }}%</td>
                  </tr>
                  <tr>
                    <td>API</td>
                    <td>{{ getRegistrationSourceCount('api') }}</td>
                    <td>{{ getRegistrationSourcePercentage('api') }}%</td>
                  </tr>
                  <tr>
                    <td>Other</td>
                    <td>{{ getRegistrationSourceCount('other') }}</td>
                    <td>{{ getRegistrationSourcePercentage('other') }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- User Status Overview -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">User Status Overview</h5>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-6 mb-3">
                <div class="border-end">
                  <h4 class="text-success mb-1">{{ dashboardAnalytics.overview?.activeUsers || 0 }}</h4>
                  <small class="text-muted">Active Users</small>
                </div>
              </div>
              <div class="col-6 mb-3">
                <h4 class="text-danger mb-1">{{ dashboardAnalytics.overview?.blockedUsers || 0 }}</h4>
                <small class="text-muted">Blocked Users</small>
              </div>
              <div class="col-6">
                <div class="border-end">
                  <h4 class="text-warning mb-1">{{ dashboardAnalytics.overview?.premiumUsers || 0 }}</h4>
                  <small class="text-muted">Premium Users</small>
                </div>
              </div>
              <div class="col-6">
                <h4 class="text-info mb-1">{{ dashboardAnalytics.overview?.newUsersLast30Days || 0 }}</h4>
                <small class="text-muted">New (30 days)</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Options -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Export Data</h5>
          </div>
          <div class="card-body">
            <p class="text-muted">Export your analytics data for further analysis</p>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary" @click="exportData('csv')">
                <i class="bi bi-file-earmark-spreadsheet me-1"></i>
                Export as CSV
              </button>
              <button class="btn btn-outline-primary" @click="exportData('json')">
                <i class="bi bi-file-earmark-code me-1"></i>
                Export as JSON
              </button>
              <button class="btn btn-outline-primary" @click="exportData('pdf')">
                <i class="bi bi-file-earmark-pdf me-1"></i>
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import api from '../services/api'
import Chart from 'chart.js/auto'

export default {
  name: 'AnalyticsView',
  components: {
    PageHeader
  },
  data() {
    return {
      apps: [],
      selectedAppId: '',
      dashboardAnalytics: {},
      growthAnalytics: [],
      retentionAnalytics: {},
      selectedGrowthPeriod: '30',
      growthPeriods: [
        { label: '7D', value: '7' },
        { label: '30D', value: '30' },
        { label: '90D', value: '90' }
      ],
      growthChart: null,
      subscriptionChart: null
    }
  },
  async mounted() {
    await this.loadApps()
    await this.loadAnalytics()
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
        await Promise.all([
          this.loadDashboardAnalytics(),
          this.loadGrowthAnalytics(),
          this.loadRetentionAnalytics()
        ])
        
        this.$nextTick(() => {
          this.renderCharts()
        })
      } catch (error) {
        console.error('Error loading analytics:', error)
      }
    },
    
    async loadDashboardAnalytics() {
      const response = await api.getDashboardAnalytics(this.selectedAppId || null)
      this.dashboardAnalytics = response.data
    },
    
    async loadGrowthAnalytics() {
      const response = await api.getGrowthAnalytics(this.selectedAppId || null, this.selectedGrowthPeriod)
      this.growthAnalytics = response.data
    },
    
    async loadRetentionAnalytics() {
      const response = await api.getRetentionAnalytics(this.selectedAppId || null)
      this.retentionAnalytics = response.data
    },
    
    async changeGrowthPeriod(period) {
      this.selectedGrowthPeriod = period
      await this.loadGrowthAnalytics()
      this.renderGrowthChart()
    },
    
    renderCharts() {
      this.renderGrowthChart()
      this.renderSubscriptionChart()
    },
    
    renderGrowthChart() {
      if (this.growthChart) {
        this.growthChart.destroy()
      }
      
      const ctx = this.$refs.growthChart
      const data = this.growthAnalytics || []
      
      this.growthChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(d => d._id),
          datasets: [
            {
              label: 'New Users',
              data: data.map(d => d.newUsers),
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
              tension: 0.1,
              fill: true
            },
            {
              label: 'Premium Users',
              data: data.map(d => d.premiumUsers),
              borderColor: 'rgb(255, 206, 86)',
              backgroundColor: 'rgba(255, 206, 86, 0.1)',
              tension: 0.1,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'top'
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
      const data = this.dashboardAnalytics.subscriptionStats || []
      
      this.subscriptionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.map(d => d._id.charAt(0).toUpperCase() + d._id.slice(1)),
          datasets: [{
            data: data.map(d => d.count),
            backgroundColor: [
              '#6c757d', // free - gray
              '#28a745', // premium - green
              '#ffc107', // trial - yellow
              '#dc3545'  // expired - red
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    },
    
    getPlatformIcon(platform) {
      const icons = {
        'iOS': 'bi bi-phone text-primary',
        'Android': 'bi bi-phone text-success',
        'Web': 'bi bi-globe text-info'
      }
      return icons[platform] || 'bi bi-question-circle text-muted'
    },
    
    getPlatformPercentage(count) {
      const total = this.dashboardAnalytics.platformStats?.reduce((sum, p) => sum + p.count, 0) || 1
      return Math.round((count / total) * 100)
    },
    
    getRegistrationSourceCount(source) {
      // This would come from your analytics data
      // For demo purposes, returning mock data
      const mockData = {
        organic: Math.floor(Math.random() * 100),
        referral: Math.floor(Math.random() * 50),
        api: Math.floor(Math.random() * 200),
        other: Math.floor(Math.random() * 30)
      }
      return mockData[source] || 0
    },
    
    getRegistrationSourcePercentage(source) {
      const count = this.getRegistrationSourceCount(source)
      const total = Object.keys(['organic', 'referral', 'api', 'other'])
        .reduce((sum, key) => sum + this.getRegistrationSourceCount(key), 0)
      return total > 0 ? Math.round((count / total) * 100) : 0
    },
    
    exportData(format) {
      // Implement data export functionality
      console.log(`Exporting data as ${format}`)
      
      if (format === 'csv') {
        this.exportCSV()
      } else if (format === 'json') {
        this.exportJSON()
      } else if (format === 'pdf') {
        alert('PDF export functionality would be implemented here')
      }
    },
    
    exportCSV() {
      const data = this.dashboardAnalytics.topUsers || []
      if (data.length === 0) {
        alert('No data to export')
        return
      }
      
      const headers = ['Username', 'Email', 'Login Count', 'Last Login', 'Subscription Status']
      const rows = data.map(user => [
        user.username,
        user.email,
        user.loginCount,
        user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never',
        user.subscriptionStatus
      ])
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `user-analytics-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    },
    
    exportJSON() {
      const exportData = {
        overview: this.dashboardAnalytics.overview,
        subscriptionStats: this.dashboardAnalytics.subscriptionStats,
        platformStats: this.dashboardAnalytics.platformStats,
        growthData: this.growthAnalytics,
        retentionData: this.retentionAnalytics,
        exportedAt: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }
}
</script>

<style scoped>
.progress {
  background-color: #e9ecef;
}
</style>
