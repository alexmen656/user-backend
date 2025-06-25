<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="brand">
        <a href="/"><img src="@/assets/logo.png" alt="Control Center Logo" height="28" class="d-inline-block align-text-top"></a>
        <!--<span class="badge bg-light text-dark ms-2 fw-normal"><i class="bi bi-grid-3x3-gap me-2"></i>App Backend</span>-->
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
        <router-link class="nav-link" to="/settings">
          <i class="bi bi-gear me-2"></i>
          Project Settings
        </router-link>
      </nav>
    </div>

    <div class="project-switcher">
      <div class="dropdown dropup">
        <button 
          class="btn btn-light w-100 dropdown-toggle" 
          type="button" 
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-folder me-2"></i>
          {{ selectedProject.name }}
        </button>
        <ul class="dropdown-menu w-100">
          <li v-for="project in projects" :key="project.id">
            <a 
              class="dropdown-item" 
              href="#" 
              @click.prevent="selectProject(project)"
              :class="{ 'active': project.id === selectedProject.id }"
            >
              {{ project.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'AppSidebar',
  data() {
    return {
      selectedProject: {
        id: 1,
        name: 'Main Project',
        description: 'Primary application project'
      },
      projects: [
        {
          id: 1,
          name: 'Main Project',
          description: 'Primary application project'
        },
        {
          id: 2,
          name: 'Mobile App',
          description: 'Mobile application backend'
        },
        {
          id: 3,
          name: 'Analytics Platform',
          description: 'Data analytics and reporting'
        },
        {
          id: 4,
          name: 'E-Commerce API',
          description: 'Online store backend services'
        }
      ]
    }
  },
  methods: {
    selectProject(project) {
      this.selectedProject = project
      this.$emit('project-changed', project)
      console.log('Selected project:', project)
    }
  }
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
  height: calc(100% - 160px);
  overflow-y: auto;
}

.project-switcher {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  background-color: #fff;
}

.project-switcher .btn {
  text-align: left;
}

.project-switcher .dropdown-item.active {
  background-color: #0d6efd;
  color: white;
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