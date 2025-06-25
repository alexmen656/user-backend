<template>
  <div class="settings">
    <div class="row mb-4">
      <PageHeader :isOfflineMode="isOfflineMode" title="App Settings" desc="Configure global application settings and system preferences" />
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-gear me-2"></i>
              Application Configuration
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- General Settings -->
              <div class="col-md-6">
                <h5 class="mb-3">General Settings</h5>
                <div class="mb-3">
                  <label for="appName" class="form-label">Application Name</label>
                  <input type="text" class="form-control" id="appName" v-model="settings.appName">
                </div>
                <div class="mb-3">
                  <label for="timezone" class="form-label">Timezone</label>
                  <select class="form-select" id="timezone" v-model="settings.timezone">
                    <option value="UTC">UTC</option>
                    <option value="Europe/Berlin">Europe/Berlin</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="language" class="form-label">Language</label>
                  <select class="form-select" id="language" v-model="settings.language">
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>

              <!-- Security Settings -->
              <div class="col-md-6">
                <h5 class="mb-3">Security Settings</h5>
                <div class="mb-3">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="twoFactorAuth" v-model="settings.twoFactorAuth">
                    <label class="form-check-label" for="twoFactorAuth">
                      Enable Two-Factor Authentication
                    </label>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="apiKeyRotation" v-model="settings.apiKeyRotation">
                    <label class="form-check-label" for="apiKeyRotation">
                      Automatic API Key Rotation
                    </label>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="sessionTimeout" class="form-label">Session Timeout (minutes)</label>
                  <input type="number" class="form-control" id="sessionTimeout" v-model="settings.sessionTimeout" min="5" max="480">
                </div>
              </div>
            </div>

            <!-- Notification Settings -->
            <div class="row mt-4">
              <div class="col-12">
                <h5 class="mb-3">Notification Settings</h5>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="emailNotifications" v-model="settings.emailNotifications">
                      <label class="form-check-label" for="emailNotifications">
                        Email Notifications
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="pushNotifications" v-model="settings.pushNotifications">
                      <label class="form-check-label" for="pushNotifications">
                        Push Notifications
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="smsNotifications" v-model="settings.smsNotifications">
                      <label class="form-check-label" for="smsNotifications">
                        SMS Notifications
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- API Settings -->
            <div class="row mt-4">
              <div class="col-12">
                <h5 class="mb-3">API Settings</h5>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="apiEndpoint" class="form-label">API Endpoint</label>
                      <input type="url" class="form-control" id="apiEndpoint" v-model="settings.apiEndpoint">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="rateLimitPerMinute" class="form-label">Rate Limit (per minute)</label>
                      <input type="number" class="form-control" id="rateLimitPerMinute" v-model="settings.rateLimitPerMinute" min="1" max="10000">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="row mt-4">
              <div class="col-12">
                <hr>
                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-secondary" @click="resetSettings">
                    <i class="bi bi-arrow-clockwise me-1"></i>
                    Reset to Defaults
                  </button>
                  <div>
                    <button type="button" class="btn btn-outline-primary me-2" @click="exportSettings">
                      <i class="bi bi-download me-1"></i>
                      Export Settings
                    </button>
                    <button type="button" class="btn btn-primary" @click="saveSettings">
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
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'AppSettings',
  components: {
    PageHeader
  },
  data() {
    return {
      settings: {
        appName: 'App Backend',
        timezone: 'Europe/Berlin',
        language: 'en',
        twoFactorAuth: false,
        apiKeyRotation: true,
        sessionTimeout: 60,
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: false,
        apiEndpoint: 'https://api.example.com',
        rateLimitPerMinute: 1000
      }
    }
  },
  computed: {
    isOfflineMode() {
      return process.env.VUE_APP_OFFLINE_MODE === 'true'
    }
  },
  methods: {
    saveSettings() {
      console.log('Saving settings:', this.settings)
      this.$toast?.success?.('Settings saved successfully!')
    },
    resetSettings() {
      if (confirm('Are you sure you want to reset all settings to their default values?')) {
        this.settings = {
          appName: 'App Backend',
          timezone: 'UTC',
          language: 'en',
          twoFactorAuth: false,
          apiKeyRotation: false,
          sessionTimeout: 30,
          emailNotifications: true,
          pushNotifications: false,
          smsNotifications: false,
          apiEndpoint: 'https://api.example.com',
          rateLimitPerMinute: 100
        }
      }
    },
    exportSettings() {
      const dataStr = JSON.stringify(this.settings, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'settings.json'
      link.click()
      URL.revokeObjectURL(url)
    }
  },
  mounted() {
    console.log('Settings view mounted')
  }
}
</script>

<style scoped>
.settings {
  max-width: 1200px;
  margin: 0 auto;
}

.form-check-label {
  font-weight: 500;
}

.card-header h4 {
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
</style>
