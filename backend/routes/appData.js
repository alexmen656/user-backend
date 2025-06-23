const express = require('express')
const User = require('../models/User')
const apiKeyAuth = require('../middleware/apiKey')
const router = express.Router()

router.post('/users', apiKeyAuth, async (req, res) => {
  try {
    const { 
      username, 
      email, 
      firstName, 
      lastName, 
      phoneNumber,
      deviceInfo 
    } = req.body

    const existingUser = await User.findOne({
      $or: [
        { email, appId: req.appId },
        { username, appId: req.appId }
      ]
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
        data: { userId: existingUser._id }
      })
    }

    const userData = {
      username,
      email,
      firstName,
      lastName,
      phoneNumber,
      appId: req.appId,
      isActive: true,
      isBlocked: false,
      subscriptionStatus: 'free',
      loginCount: 0,
      deviceInfo: {
        deviceType: deviceInfo?.deviceType || 'Unknown',
        deviceModel: deviceInfo?.deviceModel || 'Unknown',
        osVersion: deviceInfo?.osVersion || 'Unknown',
        appVersion: deviceInfo?.appVersion || '1.0.0'
      }
    }

    const user = new User(userData)
    await user.save()

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { 
        userId: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('User registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

router.put('/users/:userId', apiKeyAuth, async (req, res) => {
  try {
    const { userId } = req.params
    const updates = req.body

    const user = await User.findOne({ _id: userId, appId: req.appId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const allowedFields = [
      'firstName', 
      'lastName', 
      'phoneNumber', 
      'deviceInfo',
      'subscriptionStatus'
    ]
    
    const filteredUpdates = {}
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field]
      }
    })

    Object.assign(user, filteredUpdates)
    await user.save()

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        userId: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('User update error:', error)
    res.status(500).json({
      success: false,
      message: 'Update failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

router.post('/users/:userId/login', apiKeyAuth, async (req, res) => {
  try {
    const { userId } = req.params
    const { deviceInfo } = req.body

    const user = await User.findOne({ _id: userId, appId: req.appId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    user.lastLoginAt = new Date()
    user.loginCount = (user.loginCount || 0) + 1
    
    if (deviceInfo) {
      user.deviceInfo = {
        ...user.deviceInfo,
        ...deviceInfo
      }
    }

    await user.save()

    res.json({
      success: true,
      message: 'Login tracked successfully',
      data: {
        userId: user._id,
        loginCount: user.loginCount,
        lastLoginAt: user.lastLoginAt
      }
    })
  } catch (error) {
    console.error('Login tracking error:', error)
    res.status(500).json({
      success: false,
      message: 'Login tracking failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

router.post('/events', apiKeyAuth, async (req, res) => {
  try {
    const { userId, eventType, eventData, timestamp } = req.body

    if (userId) {
      const user = await User.findOne({ _id: userId, appId: req.appId })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }
    }

    const event = {
      appId: req.appId,
      userId: userId || null,
      eventType,
      eventData: eventData || {},
      timestamp: timestamp || new Date(),
      createdAt: new Date()
    }

    console.log('Event tracked:', event)

    res.json({
      success: true,
      message: 'Event tracked successfully',
      data: {
        eventId: Date.now().toString(),
        timestamp: event.timestamp
      }
    })
  } catch (error) {
    console.error('Event tracking error:', error)
    res.status(500).json({
      success: false,
      message: 'Event tracking failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

router.get('/users/:identifier', apiKeyAuth, async (req, res) => {
  try {
    const { identifier } = req.params
    
    const user = await User.findOne({
      appId: req.appId,
      $or: [
        { _id: identifier },
        { email: identifier },
        { username: identifier }
      ]
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
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
    })
  } catch (error) {
    console.error('User fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

router.get('/health', apiKeyAuth, (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    app: {
      name: req.app.name,
      appId: req.app.appId,
      version: req.app.version
    },
    timestamp: new Date()
  })
})

module.exports = router
