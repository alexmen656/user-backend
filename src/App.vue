<template>
  <div id="app">
    <app-navbar />
    <div class="container-fluid py-3">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue'

export default {
  name: 'App',
  components: {
    AppNavbar
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f8f9fa;
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
