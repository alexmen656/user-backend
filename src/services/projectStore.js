class ProjectStore {
  constructor() {
    this.currentProject = {
      id: 1,
      name: 'Main Project',
      description: 'Primary application project'
    }
    this.listeners = []
  }

  subscribe(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  notify() {
    this.listeners.forEach(listener => listener(this.currentProject))
  }

  setCurrentProject(project) {
    this.currentProject = project
    this.notify()
  }

  getCurrentProject() {
    return this.currentProject
  }

  getProjects() {
    return [
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
      },
      {
        id: 5,
        name: 'New Project',
        description: 'Empty project with no apps yet'
      }
    ]
  }
}

const projectStore = new ProjectStore()

export default projectStore