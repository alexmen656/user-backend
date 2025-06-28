class LocalStorageService {
  constructor() {
    this.initializeStorage()
  }

  initializeStorage() {
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
          username: 'webuser',
          email: 'web@example.com',
          firstName: 'Web',
          lastName: 'User',
          appId: 'com.example.webapp',
          isActive: true,
          isBlocked: false,
          subscriptionStatus: 'trial',
          lastLoginAt: new Date('2025-06-22').toISOString(),
          createdAt: new Date('2025-06-05').toISOString(),
          loginCount: 8,
          phoneNumber: '+1234567892',
          deviceInfo: {
            deviceType: 'Web',
            deviceModel: 'Chrome',
            osVersion: 'Web',
            appVersion: '1.1.0'
          }
        },
        {
          _id: '4',
          username: 'shopper1',
          email: 'shopper1@mobile.com',
          firstName: 'Alice',
          lastName: 'Shopper',
          appId: 'com.mobile.shop',
          isActive: true,
          isBlocked: false,
          subscriptionStatus: 'premium',
          lastLoginAt: new Date('2025-06-24').toISOString(),
          createdAt: new Date('2025-05-15').toISOString(),
          loginCount: 45,
          phoneNumber: '+1234567893',
          deviceInfo: {
            deviceType: 'Android',
            deviceModel: 'Google Pixel 8',
            osVersion: '14.0',
            appVersion: '2.0.0'
          }
        },
        {
          _id: '5',
          username: 'mobilebob',
          email: 'bob@mobile.com',
          firstName: 'Bob',
          lastName: 'Mobile',
          appId: 'com.mobile.shop',
          isActive: true,
          isBlocked: false,
          subscriptionStatus: 'free',
          lastLoginAt: new Date('2025-06-23').toISOString(),
          createdAt: new Date('2025-05-20').toISOString(),
          loginCount: 32,
          phoneNumber: '+1234567894',
          deviceInfo: {
            deviceType: 'iOS',
            deviceModel: 'iPhone 14',
            osVersion: '16.6',
            appVersion: '2.0.0'
          }
        },
        {
          _id: '6',
          username: 'analyst1',
          email: 'analyst@analytics.com',
          firstName: 'Data',
          lastName: 'Analyst',
          appId: 'com.analytics.dash',
          isActive: true,
          isBlocked: false,
          subscriptionStatus: 'premium',
          lastLoginAt: new Date('2025-06-25').toISOString(),
          createdAt: new Date('2025-04-01').toISOString(),
          loginCount: 128,
          phoneNumber: '+1234567895',
          deviceInfo: {
            deviceType: 'Web',
            deviceModel: 'Firefox',
            osVersion: 'Web',
            appVersion: '1.5.0'
          }
        },
        {
          _id: '7',
          username: 'researcher',
          email: 'research@analytics.com',
          firstName: 'Research',
          lastName: 'Team',
          appId: 'com.analytics.dash',
          isActive: true,
          isBlocked: false,
          subscriptionStatus: 'premium',
          lastLoginAt: new Date('2025-06-24').toISOString(),
          createdAt: new Date('2025-04-05').toISOString(),
          loginCount: 89,
          phoneNumber: '+1234567896',
          deviceInfo: {
            deviceType: 'Web',
            deviceModel: 'Chrome',
            osVersion: 'Web',
            appVersion: '1.5.0'
          }
        },
        {
          _id: '8',
          username: 'storeowner',
          email: 'owner@ecommerce.com',
          firstName: 'Store',
          lastName: 'Owner',
          appId: 'com.ecommerce.api',
          isActive: true,
          isBlocked: false,
          subscriptionStatus: 'premium',
          lastLoginAt: new Date('2025-06-25').toISOString(),
          createdAt: new Date('2025-03-01').toISOString(),
          loginCount: 256,
          phoneNumber: '+1234567897',
          deviceInfo: {
            deviceType: 'API',
            deviceModel: 'Server',
            osVersion: 'Linux',
            appVersion: '3.1.0'
          }
        },
        {
          _id: '9',
          username: 'customer1',
          email: 'customer@shop.com',
          firstName: 'Happy',
          lastName: 'Customer',
          appId: 'com.ecommerce.api',
          isActive: true,
          isBlocked: false,
          subscriptionStatus: 'free',
          lastLoginAt: new Date('2025-06-24').toISOString(),
          createdAt: new Date('2025-03-15').toISOString(),
          loginCount: 67,
          phoneNumber: '+1234567898',
          deviceInfo: {
            deviceType: 'API',
            deviceModel: 'Mobile',
            osVersion: 'API',
            appVersion: '3.1.0'
          }
        },
        {
          _id: '10',
          username: 'merchant',
          email: 'merchant@ecommerce.com',
          firstName: 'Big',
          lastName: 'Merchant',
          appId: 'com.ecommerce.api',
          isActive: true,
          isBlocked: false,
          subscriptionStatus: 'premium',
          lastLoginAt: new Date('2025-06-25').toISOString(),
          createdAt: new Date('2025-02-20').toISOString(),
          loginCount: 445,
          phoneNumber: '+1234567899',
          deviceInfo: {
            deviceType: 'API',
            deviceModel: 'Desktop',
            osVersion: 'Windows',
            appVersion: '3.1.0'
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
          projectId: 1,
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
          projectId: 1,
          createdAt: new Date('2025-05-15').toISOString(),
          settings: {
            allowRegistration: false,
            requireEmailVerification: false,
            maxUsers: 5000,
            features: ['analytics']
          }
        },
        {
          _id: '3',
          name: 'Mobile Shopping App',
          appId: 'com.mobile.shop',
          bundleId: 'com.mobile.shop',
          platform: 'Android',
          version: '2.0.0',
          description: 'E-commerce mobile application',
          isActive: true,
          apiKey: 'api_key_mobile123',
          projectId: 2,
          createdAt: new Date('2025-04-10').toISOString(),
          settings: {
            allowRegistration: true,
            requireEmailVerification: true,
            maxUsers: 50000,
            features: ['analytics', 'push_notifications', 'payments']
          }
        },
        {
          _id: '4',
          name: 'Analytics Dashboard',
          appId: 'com.analytics.dash',
          bundleId: 'com.analytics.dash',
          platform: 'Web',
          version: '1.5.0',
          description: 'Analytics and reporting dashboard',
          isActive: true,
          apiKey: 'api_key_analytics456',
          projectId: 3,
          createdAt: new Date('2025-03-20').toISOString(),
          settings: {
            allowRegistration: false,
            requireEmailVerification: true,
            maxUsers: 1000,
            features: ['analytics', 'reports']
          }
        },
        {
          _id: '5',
          name: 'E-Commerce API',
          appId: 'com.ecommerce.api',
          bundleId: 'com.ecommerce.api',
          platform: 'API',
          version: '3.1.0',
          description: 'Backend API for e-commerce platform',
          isActive: true,
          apiKey: 'api_key_ecommerce789',
          projectId: 4,
          createdAt: new Date('2025-02-15').toISOString(),
          settings: {
            allowRegistration: true,
            requireEmailVerification: true,
            maxUsers: 100000,
            features: ['analytics', 'payments', 'inventory']
          }
        }
      ]
      localStorage.setItem('apps', JSON.stringify(sampleApps))
    }

    if (!localStorage.getItem('nextUserId')) {
      localStorage.setItem('nextUserId', '4')
    }
    if (!localStorage.getItem('nextAppId')) {
      localStorage.setItem('nextAppId', '3')
    }
  }

  generateId(type) {
    const key = `next${type}Id`
    const currentId = parseInt(localStorage.getItem(key))
    localStorage.setItem(key, (currentId + 1).toString())
    return currentId.toString()
  }

  delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getUsers(params = {}) {
    await this.delay()
    
    let users = JSON.parse(localStorage.getItem('users') || '[]')
    let filteredUsers = [...users]

    if (params.projectId) {
      const apps = JSON.parse(localStorage.getItem('apps') || '[]')
      const projectAppIds = apps
        .filter(app => app.projectId === params.projectId)
        .map(app => app.appId)
      
      filteredUsers = filteredUsers.filter(user => projectAppIds.includes(user.appId))
    }

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

  async getApps(projectId = null) {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    
    if (projectId) {
      const filteredApps = apps.filter(app => app.projectId === projectId)
      return { data: filteredApps }
    }
    
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
    
    const existing = apps.find(a => a.appId === appData.appId || a.bundleId === appData.bundleId)
    if (existing) {
      throw new Error('App with this ID or Bundle ID already exists')
    }

    const { default: projectStore } = await import('./projectStore.js')
    const currentProject = projectStore.getCurrentProject()
    
    const newApp = {
      _id: this.generateId('App'),
      ...appData,
      projectId: currentProject.id,
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

  async getDashboardAnalytics(appId = null, projectId = null) {
    await this.delay()
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    let filteredUsers = [...users]
    
    if (projectId) {
      const apps = JSON.parse(localStorage.getItem('apps') || '[]')
      const projectAppIds = apps
        .filter(app => app.projectId === projectId)
        .map(app => app.appId)
      
      filteredUsers = filteredUsers.filter(user => projectAppIds.includes(user.appId))
    }
    
    if (appId) {
      filteredUsers = filteredUsers.filter(u => u.appId === appId)
    }
    
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

  async getGrowthAnalytics(appId = null, period = '30', projectId = null) {
    await this.delay()
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    let filteredUsers = [...users]
    
    if (projectId) {
      const apps = JSON.parse(localStorage.getItem('apps') || '[]')
      const projectAppIds = apps
        .filter(app => app.projectId === projectId)
        .map(app => app.appId)
      
      filteredUsers = filteredUsers.filter(user => projectAppIds.includes(user.appId))
    }
    
    if (appId) {
      filteredUsers = filteredUsers.filter(u => u.appId === appId)
    }
    
    const days = parseInt(period)
    const growthData = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
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

  async getRetentionAnalytics(appId = null, projectId = null) {
    await this.delay()
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    let filteredUsers = [...users]
    
    if (projectId) {
      const apps = JSON.parse(localStorage.getItem('apps') || '[]')
      const projectAppIds = apps
        .filter(app => app.projectId === projectId)
        .map(app => app.appId)
      
      filteredUsers = filteredUsers.filter(user => projectAppIds.includes(user.appId))
    }
    
    if (appId) {
      filteredUsers = filteredUsers.filter(u => u.appId === appId)
    }
    
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

  async submitUserRegistration(userData, apiKey) {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    const app = apps.find(a => a.apiKey === apiKey && a.isActive)
    if (!app) {
      throw new Error('Invalid API key')
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    const existing = users.find(u => 
      (u.email === userData.email || u.username === userData.username) && 
      u.appId === app.appId
    )
    
    if (existing) {
      return { 
        data: { 
          success: false, 
          message: 'User already exists',
          userId: existing._id 
        } 
      }
    }

    const newUser = {
      _id: this.generateId('User'),
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phoneNumber: userData.phoneNumber || '',
      appId: app.appId,
      isActive: true,
      isBlocked: false,
      subscriptionStatus: 'free',
      loginCount: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      deviceInfo: userData.deviceInfo || {
        deviceType: 'Unknown',
        deviceModel: 'Unknown',
        osVersion: 'Unknown',
        appVersion: '1.0.0'
      }
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    return {
      data: {
        success: true,
        message: 'User registered successfully',
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    }
  }

  async submitUserLogin(userId, apiKey, deviceInfo = null) {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    const app = apps.find(a => a.apiKey === apiKey && a.isActive)
    if (!app) {
      throw new Error('Invalid API key')
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u._id === userId && u.appId === app.appId)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    users[userIndex].lastLoginAt = new Date().toISOString()
    users[userIndex].loginCount = (users[userIndex].loginCount || 0) + 1
    
    if (deviceInfo) {
      users[userIndex].deviceInfo = {
        ...users[userIndex].deviceInfo,
        ...deviceInfo
      }
    }

    localStorage.setItem('users', JSON.stringify(users))

    return {
      data: {
        success: true,
        message: 'Login tracked successfully',
        userId: users[userIndex]._id,
        loginCount: users[userIndex].loginCount,
        lastLoginAt: users[userIndex].lastLoginAt
      }
    }
  }

  async submitUserUpdate(userId, updates, apiKey) {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    const app = apps.find(a => a.apiKey === apiKey && a.isActive)
    if (!app) {
      throw new Error('Invalid API key')
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u._id === userId && u.appId === app.appId)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'deviceInfo', 'subscriptionStatus']
    const filteredUpdates = {}
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field]
      }
    })

    users[userIndex] = { ...users[userIndex], ...filteredUpdates }
    localStorage.setItem('users', JSON.stringify(users))

    return {
      data: {
        success: true,
        message: 'User updated successfully',
        userId: users[userIndex]._id,
        username: users[userIndex].username,
        email: users[userIndex].email
      }
    }
  }

  async submitEvent(eventData, apiKey) {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    const app = apps.find(a => a.apiKey === apiKey && a.isActive)
    if (!app) {
      throw new Error('Invalid API key')
    }

    if (eventData.userId) {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => u._id === eventData.userId && u.appId === app.appId)
      if (!user) {
        throw new Error('User not found')
      }
    }

    const events = JSON.parse(localStorage.getItem('events') || '[]')
    const event = {
      _id: Date.now().toString(),
      appId: app.appId,
      userId: eventData.userId || null,
      eventType: eventData.eventType,
      eventData: eventData.eventData || {},
      timestamp: eventData.timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    events.push(event)
    localStorage.setItem('events', JSON.stringify(events))

    return {
      data: {
        success: true,
        message: 'Event tracked successfully',
        eventId: event._id,
        timestamp: event.timestamp
      }
    }
  }

  async getUserByIdentifier(identifier, apiKey) {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    const app = apps.find(a => a.apiKey === apiKey && a.isActive)
    if (!app) {
      throw new Error('Invalid API key')
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => 
      u.appId === app.appId && 
      (u._id === identifier || u.email === identifier || u.username === identifier)
    )
    
    if (!user) {
      throw new Error('User not found')
    }

    return {
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        isBlocked: user.isBlocked,
        subscriptionStatus: user.subscriptionStatus,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        loginCount: user.loginCount
      }
    }
  }

  async healthCheck(apiKey) {
    await this.delay()
    
    const apps = JSON.parse(localStorage.getItem('apps') || '[]')
    const app = apps.find(a => a.apiKey === apiKey && a.isActive)
    if (!app) {
      throw new Error('Invalid API key')
    }

    return {
      data: {
        success: true,
        message: 'API is healthy',
        app: {
          name: app.name,
          appId: app.appId,
          version: app.version
        },
        timestamp: new Date().toISOString()
      }
    }
  }

}

export default new LocalStorageService()
