<template>
  <div class="user-settings">
    <div class="row mb-4">
      <PageHeader :isOfflineMode="isOfflineMode" title="User Settings"
        desc="Manage your personal account settings and preferences" />
    </div>

    <div class="row">
      <!-- Profile Settings -->
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-person me-2"></i>
              Profile Information
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="firstName" class="form-label">First Name</label>
              <input type="text" class="form-control" id="firstName" v-model="userSettings.firstName">
            </div>
            <div class="mb-3">
              <label for="lastName" class="form-label">Last Name</label>
              <input type="text" class="form-control" id="lastName" v-model="userSettings.lastName">
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email Address</label>
              <input type="email" class="form-control" id="email" v-model="userSettings.email">
            </div>
            <div class="mb-3">
              <label for="phone" class="form-label">Phone Number</label>
              <input type="tel" class="form-control" id="phone" v-model="userSettings.phone">
            </div>
          </div>
        </div>
      </div>



      <!-- Personal Preferences -->
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-sliders me-2"></i>
              Personal Preferences
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="userTimezone" class="form-label">Preferred Timezone</label>
              <select class="form-select" id="userTimezone" v-model="userSettings.timezone">
                <option value="UTC">UTC</option>
                <option value="Europe/Berlin">Europe/Berlin</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="userLanguage" class="form-label">Language</label>
              <select class="form-select" id="userLanguage" v-model="userSettings.language">
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="dateFormat" class="form-label">Date Format</label>
              <select class="form-select" id="dateFormat" v-model="userSettings.dateFormat">
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>




    </div>

    <div class="row">



      <!-- Security Settings -->
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-shield-lock me-2"></i>
              Security & Privacy
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="userTwoFactorAuth"
                  v-model="userSettings.twoFactorAuth">
                <label class="form-check-label" for="userTwoFactorAuth">
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>
            <div class="mb-3">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="loginNotifications"
                  v-model="userSettings.loginNotifications">
                <label class="form-check-label" for="loginNotifications">
                  Login Notifications
                </label>
              </div>
            </div>
            <div class="mb-3">
              <button type="button" class="btn btn-outline-primary" @click="changePassword">
                <i class="bi bi-key me-1"></i>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification Preferences -->
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-bell me-2"></i>
              Notification Preferences
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="userEmailNotifications"
                  v-model="userSettings.emailNotifications">
                <label class="form-check-label" for="userEmailNotifications">
                  Email Notifications
                </label>
              </div>
            </div>
            <div class="mb-3">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="userPushNotifications"
                  v-model="userSettings.pushNotifications">
                <label class="form-check-label" for="userPushNotifications">
                  Browser Push Notifications
                </label>
              </div>
            </div>
            <div class="mb-3">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="weeklyReports" v-model="userSettings.weeklyReports">
                <label class="form-check-label" for="weeklyReports">
                  Weekly Summary Reports
                </label>
              </div>
            </div>
            <div class="mb-3">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="systemAlerts" v-model="userSettings.systemAlerts">
                <label class="form-check-label" for="systemAlerts">
                  System Alerts & Warnings
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-outline-danger" @click="deleteAccount">
                <i class="bi bi-trash me-1"></i>
                Delete Account
              </button>
              <div>
                <button type="button" class="btn btn-outline-secondary me-2" @click="resetUserSettings">
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  Reset to Defaults
                </button>
                <button type="button" class="btn btn-primary" @click="saveUserSettings">
                  <i class="bi bi-check-lg me-1"></i>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'UserSettings',
  components: {
    PageHeader
  },
  data() {
    return {
      userSettings: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'admin@example.com',
        phone: '+1 234 567 8900',
        timezone: 'Europe/Berlin',
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        twoFactorAuth: false,
        loginNotifications: true,
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true,
        systemAlerts: true
      }
    }
  },
  computed: {
    isOfflineMode() {
      return process.env.VUE_APP_OFFLINE_MODE === 'true'
    }
  },
  methods: {
    saveUserSettings() {
      console.log('Saving user settings:', this.userSettings)
      alert('User settings saved successfully!')
    },
    resetUserSettings() {
      if (confirm('Are you sure you want to reset all user settings to their default values?')) {
        this.userSettings = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'admin@example.com',
          phone: '',
          timezone: 'UTC',
          language: 'en',
          dateFormat: 'DD/MM/YYYY',
          twoFactorAuth: false,
          loginNotifications: true,
          emailNotifications: true,
          pushNotifications: false,
          weeklyReports: false,
          systemAlerts: true
        }
      }
    },
    changePassword() {
      alert('Password change functionality would be implemented here')
    },
    deleteAccount() {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        alert('Account deletion functionality would be implemented here')
      }
    }
  },
  mounted() {
    console.log('User Settings view mounted')
  }
}
</script>

<style scoped>
.user-settings {
  max-width: 1200px;
  margin: 0 auto;
}

.form-check-label {
  font-weight: 500;
}

.card-header h5 {
  color: #495057;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
}
</style>
