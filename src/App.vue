<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">
          <i class="bi bi-grid-3x3-gap-fill me-2"></i>
          User Management Backend
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">
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
                <i class="bi bi-phone me-1"></i>
                Apps
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/analytics">
                <i class="bi bi-bar-chart me-1"></i>
                Analytics
              </router-link>
            </li>
          </ul>
          
          <div class="navbar-nav">
            <div class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-1"></i>
                Admin
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="container-fluid mt-3">
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.navbar-brand {
  font-weight: 600;
}

.router-link-active {
  font-weight: 500;
}

/* Custom styles for better aesthetics */
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.table th {
  border-top: none;
  font-weight: 600;
  background-color: #f8f9fa;
}

.btn {
  font-weight: 500;
}

/* Bootstrap Icons */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css");
</style>
