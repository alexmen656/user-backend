<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom mb-4">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <!--<i class="bi bi-grid-3x3-gap me-2"></i>-->
        <!--Control Center-->
        <img src="@/assets/logo.png" alt="Control Center Logo" height="24" class="d-inline-block align-text-top">
        <span class="badge bg-light text-dark ms-2 fw-normal"><i class="bi bi-grid-3x3-gap me-2"></i>App Backend</span>
      </a>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact>
              <i class="bi bi-speedometer2 me-1"></i>
              Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/users">
              <i class="bi bi-people me-1"></i>
              Users
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/apps">
              <i class="bi bi-grid me-1"></i>
              Apps
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/analytics">
              <i class="bi bi-graph-up me-1"></i>
              Analytics
            </router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center">
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
                <a class="dropdown-item" href="#">
                  <i class="bi bi-gear me-1"></i>
                  Settings
                </a>
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
    </div>
  </nav>
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
.navbar {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-link.router-link-active {
  color: var(--bs-primary) !important;
  font-weight: 500;
}

.navbar-brand {
  font-weight: 600;
  letter-spacing: -0.5px;
}

.navbar-brand .badge {
  font-size: 0.75rem;
  font-weight: 400;
  padding: 0.35em 0.65em;
  letter-spacing: normal;
}
</style>
