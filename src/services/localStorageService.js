// Local storage service for offline development
class LocalStorageService {
  constructor() {
    this.initializeStorage()
  }

  initializeStorage() {
    // Initialize with sample data if not exists
    if (!localStorage.getItem('users')) {
      const sampleUsers = [
        {
          _id: '1',
          username: 'johndoe',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          appId: 'com.example.myapp',
          isActive: true,
          isBlocked: false,
          subscriptionStatus: 'premium',
          lastLoginAt: new Date('2025-06-20').toISOString(),
          createdAt: new Date('2025-06-01').toISOString(),
          loginCount: 25,
          phoneNumber: '+1234567890',
          deviceInfo: {
            deviceType: 'iOS',
            deviceModel: 'iPhone 15',
            osVersion: '17.0',
            appVersion: '1.2.0'
          }
        },
        {
          _id: '2',
          username: 'janedoe',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
          appId: 'com.example.myapp',
          isActive: true,
          isBlocked: false,
          subscriptionStatus: 'free',
          lastLoginAt: new Date('2025-06-21').toISOString(),
          createdAt: new Date('2025-06-10').toISOString(),
          loginCount: 12,
          phoneNumber: '+1234567891',
          deviceInfo: {
            deviceType: 'Android',
            deviceModel: 'Samsung Galaxy S24',
            osVersion: '14.0',
            appVersion: '1.2.0'
          }
        },
        {
          _id: '3',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          appId: 'com.example.webapp',
          isActive: false,
          isBlocked: true,
          subscriptionStatus: 'trial',
          lastLoginAt: new Date('2025-06-15').toISOString(),
          createdAt: new Date('2025-06-05').toISOString(),
          loginCount: 5,
          phoneNumber: '+1234567892',
          deviceInfo: {
            deviceType: 'Web',
            deviceModel: 'Chrome',
            osVersion: 'Web',
            appVersion: '1.1.0'
          }
        }
      ]
      localStorage.setItem('users', JSON.stringify(sampleUsers))
    }

    if (!localStorage.getItem('apps')) {
      const sampleApps = [
        {
          _id: '1',
          name: 'My iOS App',
          appId: 'com.example.myapp',
          bundleId: 'com.example.myapp',
          platform: 'iOS',
          version: '1.2.0',
          description: 'A sample iOS application for user management',
          isActive: true,
          apiKey: 'api_key_12345678',
          createdAt: new Date('2025-05-01').toISOString(),
          settings: {
            allowRegistration: true,
            requireEmailVerification: true,
            maxUsers: 10000,
            features: ['analytics', 'push_notifications']
          }
        },
        {
          _id: '2',
          name: 'Web App',
          appId: 'com.example.webapp',
          bundleId: 'com.example.webapp',
          platform: 'Web',
          version: '1.1.0',
          description: 'Web application for testing',
          isActive: true,
          apiKey: 'api_key_87654321',
          createdAt: new Date('2025-05-15').toISOString(),
          settings: {
            allowRegistration: false,
            requireEmailVerification: false,
            maxUsers: 5000,
            features: ['analytics']
          }
        }
      ]
      localStorage.setItem('apps', JSON.stringify(sampleApps))
    }

    // Initialize next ID counters
    if (!localStorage.getItem('nextUserId')) {
      localStorage.setItem('nextUserId', '4')
    }
    if (!localStorage.getItem('nextAppId')) {
      localStorage.setItem('nextAppId', '3')
    }
  }

  // Utility methods
  generateId(type) {
    const key = `next${type}Id`
    const currentId = parseInt(localStorage.getItem(key))
    localStorage.setItem(key, (currentId + 1).toString())
    return currentId.toString()
  }

  delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // User methods
  async getUsers(params = {}) {
    await this.delay()
    
    let users = JSON.parse(localStorage.getItem('users') || '[]')
    let filteredUsers = [...users]

    // Apply filters
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredUsers = filteredUsers.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchLower))
      )
    }

    if (params.appId) {
      filteredUsers = filteredUsers.filter(user => user.appId === params.appId)
    }

    if (params.status) {
      if (params.status === 'active') {
        filteredUsers = filteredUsers.filter(user => user.isActive && !user.isBlocked)
      } else if (params.status === 'inactive') {
        filteredUsers = filteredUsers.filter(user => !user.isActive)
      } else if (params.status === 'blocked') {
        filteredUsers = filteredUsers.filter(user => user.isBlocked)
      }
    }

    if (params.subscription) {
      filteredUsers = filteredUsers.filter(user => user.subscriptionStatus === params.subscription)
    }

    // Pagination
    const page = parseInt(params.page || 1)
    const limit = parseInt(params.limit || 20)
    const skip = (page - 1) * limit
    const totalUsers = filteredUsers.length
    const totalPages = Math.ceil(totalUsers / limit)
    
    const paginatedUsers = filteredUsers.slice(skip, skip + limit)

    return {
      data: {
        users: paginatedUsers,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    }
  }

  async getUser(id) {
    await this.delay()
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u._id === id)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return { data: user }
  }

  async createUser(userData) {
    await this.delay()
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Check for existing email/username
    const existing = users.find(u => u.email === userData.email || u.username === userData.username)
    if (existing) {
      throw new Error('User with this email or username already exists')
    }
    
    const newUser = {
      _id: this.generateId('User'),
      ...userData,
      isActive: true,
      isBlocked: false,
      loginCount: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      deviceInfo: {
        deviceType: 'Unknown',
        deviceModel: 'Unknown',
        osVersion: 'Unknown',
        appVersion: '1.0.0'
      }
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    return { data: newUser }
  }

  async updateUser(id, userData) {
    await this.delay()
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u._id === id)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    // Don't allow changing email/username to existing ones
    if (userData.email || userData.username) {
      const existing = users.find(u => u._id !== id && (u.email === userData.email || u.username === userData.username))
      if (existing) {
        throw new Error('User with this email or username already exists')
      }
    }
    
    users[userIndex] = { ...users[userIndex], ...userData }
    localStorage.setItem('users', JSON.stringify(users))
    
    return { data: users[userIndex] }
  }

  async deleteUser(id) {
    await this.delay()
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const filteredUsers = users.filter(u => u._id !== id)
    
    if (users.length === filteredUsers.length) {
      throw new Error('User not found')
    }
    
    localStorage.setItem('users', JSON.stringify(filteredUsers))
    
    return { data: { message: 'User deleted successfully' } }
  }

  async blockUser(id, blocked) {
    await this.delay()
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u._id === id)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    users[userIndex].isBlocked = blocked
    localStorage.setItem('users', JSON.stringify(users))
    
    return { data: users[userIndex] }
  }

  // App methods
  async getApps() {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    return { data: apps }
  }

  async getApp(id) {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    const app = apps.find(a => a._id === id)
    
    if (!app) {
      throw new Error('App not found')
    }
    
    return { data: app }
  }

  async createApp(appData) {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    
    // Check for existing appId/bundleId
    const existing = apps.find(a => a.appId === appData.appId || a.bundleId === appData.bundleId)
    if (existing) {
      throw new Error('App with this ID or Bundle ID already exists')
    }
    
    const newApp = {
      _id: this.generateId('App'),
      ...appData,
      isActive: true,
      apiKey: 'api_key_' + Math.random().toString(36).substr(2, 16),
      createdAt: new Date().toISOString()
    }
    
    apps.push(newApp)
    localStorage.setItem('apps', JSON.stringify(apps))
    
    return { data: newApp }
  }

  async updateApp(id, appData) {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    const appIndex = apps.findIndex(a => a._id === id)
    
    if (appIndex === -1) {
      throw new Error('App not found')
    }
    
    apps[appIndex] = { ...apps[appIndex], ...appData }
    localStorage.setItem('apps', JSON.stringify(apps))
    
    return { data: apps[appIndex] }
  }

  async deleteApp(id) {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    const filteredApps = apps.filter(a => a._id !== id)
    
    if (apps.length === filteredApps.length) {
      throw new Error('App not found')
    }
    
    localStorage.setItem('apps', JSON.stringify(filteredApps))
    
    return { data: { message: 'App deleted successfully' } }
  }

  async regenerateApiKey(id) {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    const appIndex = apps.findIndex(a => a._id === id)
    
    if (appIndex === -1) {
      throw new Error('App not found')
    }
    
    apps[appIndex].apiKey = 'api_key_' + Math.random().toString(36).substr(2, 16)
    localStorage.setItem('apps', JSON.stringify(apps))
    
    return { data: apps[appIndex] }
  }

  // Analytics methods
  async getDashboardAnalytics(appId = null) {
    await this.delay()
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    let filteredUsers = appId ? users.filter(u => u.appId === appId) : users
    
    const overview = {
      totalUsers: filteredUsers.length,
      activeUsers: filteredUsers.filter(u => u.isActive && !u.isBlocked).length,
      blockedUsers: filteredUsers.filter(u => u.isBlocked).length,
      premiumUsers: filteredUsers.filter(u => u.subscriptionStatus === 'premium').length,
      newUsersLast30Days: filteredUsers.filter(u => {
        const created = new Date(u.createdAt)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return created >= thirtyDaysAgo
      }).length
    }
    
    const subscriptionStats = this.getGroupedStats(filteredUsers, 'subscriptionStatus')
    const platformStats = this.getGroupedStats(filteredUsers, 'deviceInfo.deviceType')
    
    // Mock daily registrations for last 7 days
    const dailyRegistrations = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const count = Math.floor(Math.random() * 10) + 1
      dailyRegistrations.push({ _id: dateStr, count })
    }
    
    const topUsers = filteredUsers
      .sort((a, b) => (b.loginCount || 0) - (a.loginCount || 0))
      .slice(0, 10)
    
    return {
      data: {
        overview,
        subscriptionStats,
        platformStats,
        dailyRegistrations,
        topUsers
      }
    }
  }

  async getGrowthAnalytics(appId = null, period = '30') {
    await this.delay()
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const filteredUsers = appId ? users.filter(u => u.appId === appId) : users
    
    const days = parseInt(period)
    const growthData = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Calculate actual users for this date from filteredUsers
      const usersForDate = filteredUsers.filter(u => {
        const userDate = new Date(u.createdAt || u.registeredAt || '2024-01-01')
        return userDate.toISOString().split('T')[0] === dateStr
      })
      
      const newUsers = usersForDate.length || Math.floor(Math.random() * 15) + 1
      const premiumUsers = usersForDate.filter(u => u.subscriptionTier === 'premium').length || Math.floor(Math.random() * 5)
      
      growthData.push({
        _id: dateStr,
        newUsers,
        premiumUsers
      })
    }
    
    return { data: growthData }
  }

  async getRetentionAnalytics(appId = null) {
    await this.delay()
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const filteredUsers = appId ? users.filter(u => u.appId === appId) : users
    
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const activeUsersWeek = filteredUsers.filter(u => {
      return u.lastLoginAt && new Date(u.lastLoginAt) >= sevenDaysAgo
    }).length
    
    const activeUsersMonth = filteredUsers.filter(u => {
      return u.lastLoginAt && new Date(u.lastLoginAt) >= thirtyDaysAgo
    }).length
    
    const totalUsers = filteredUsers.length
    
    return {
      data: {
        weeklyRetention: totalUsers > 0 ? ((activeUsersWeek / totalUsers) * 100).toFixed(2) : 0,
        monthlyRetention: totalUsers > 0 ? ((activeUsersMonth / totalUsers) * 100).toFixed(2) : 0,
        activeUsersWeek,
        activeUsersMonth,
        totalUsers
      }
    }
  }

  getGroupedStats(users, field) {
    const groups = {}
    users.forEach(user => {
      let value
      if (field.includes('.')) {
        // Handle nested fields like 'deviceInfo.deviceType'
        const keys = field.split('.')
        value = user[keys[0]]?.[keys[1]]
      } else {
        value = user[field]
      }
      
      if (!value) value = 'Unknown'
      groups[value] = (groups[value] || 0) + 1
    })
    
    return Object.entries(groups).map(([key, count]) => ({
      _id: key,
      count
    }))
  }
}

export default new LocalStorageService()
