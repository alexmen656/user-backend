<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="brand">
        <img src="@/assets/logo.png" alt="Control Center Logo" height="24" class="d-inline-block align-text-top">
        <span class="badge bg-light text-dark ms-2 fw-normal"><i class="bi bi-grid-3x3-gap me-2"></i>App Backend</span>
      </div>
    </div>
    <div class="sidebar-content">
      <nav class="nav flex-column">
        <router-link class="nav-link" to="/" exact>
          <i class="bi bi-speedometer2 me-2"></i>
          Dashboard
        </router-link>
        <router-link class="nav-link" to="/users">
          <i class="bi bi-people me-2"></i>
          Users
        </router-link>
        <router-link class="nav-link" to="/apps">
          <i class="bi bi-grid me-2"></i>
          Apps
        </router-link>
        <router-link class="nav-link" to="/analytics">
          <i class="bi bi-graph-up me-2"></i>
          Analytics
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSidebar'
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  border-right: 1px solid #e9ecef;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  z-index: 1000;
}

.sidebar-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.brand .badge {
  font-size: 0.75rem;
  font-weight: 400;
  padding: 0.35em 0.65em;
  letter-spacing: normal;
}

.sidebar-content {
  padding: 1rem 0;
  height: calc(100% - 80px);
  overflow-y: auto;
}

.nav-link {
  color: #495057;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #0d6efd;
}

.nav-link.router-link-active {
  background-color: #e7f3ff;
  color: #0d6efd;
  border-right: 3px solid #0d6efd;
}

.nav-link i {
  width: 20px;
  font-size: 1.1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.show {
    transform: translateX(0);
  }
}
</style>
