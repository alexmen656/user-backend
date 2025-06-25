<template>
  <div class="header-controls">
    <div class="controls-content">
      <span v-if="isOfflineMode" class="badge bg-warning me-3">
        <i class="bi bi-wifi-off me-1"></i>
        Offline Mode
      </span>
      <div class="dropdown">
        <button 
          class="btn btn-light dropdown-toggle" 
          type="button" 
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-person-circle me-1"></i>
          Admin
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <router-link class="dropdown-item" to="/user-settings">
              <i class="bi bi-person-gear me-1"></i>
              User Settings
            </router-link>
          </li>
          <li>
            <a class="dropdown-item" href="#">
              <i class="bi bi-question-circle me-1"></i>
              Help
            </a>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <a class="dropdown-item text-danger" href="#">
              <i class="bi bi-box-arrow-right me-1"></i>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppNavbar',
  computed: {
    isOfflineMode() {
      return process.env.VUE_APP_OFFLINE_MODE === 'true'
    }
  }
}
</script>

<style scoped>
.header-controls {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1001;
  padding: 1rem;
}

.controls-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Remove all navbar-specific styles since we're going headless */
</style>
