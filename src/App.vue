<template>
  <div id="app">
    <app-sidebar />
    <app-navbar />
    <div class="main-content">
      <div class="container-fluid py-3">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppSidebar
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  margin-left: 250px;
  min-height: 100vh;
}

/* Responsive design */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}

.card {
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.table th {
  font-weight: 500;
  border-top: none;
}

.btn-icon {
  padding: 0.375rem;
  line-height: 1;
}

.dropdown-toggle::after {
  vertical-align: middle;
}

.text-muted {
  color: #6c757d !important;
}

.form-label {
  font-weight: 500;
  color: #495057;
}

/* Bootstrap Icons */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css");
</style>
