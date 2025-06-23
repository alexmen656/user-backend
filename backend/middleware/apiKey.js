const App = require('../models/App')

const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.header('X-API-Key') || req.header('Authorization')?.replace('Bearer ', '')
    
    if (!apiKey) {
      return res.status(401).json({ 
        success: false, 
        message: 'API key required' 
      })
    }

    const app = await App.findOne({ apiKey, isActive: true })
    if (!app) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid API key' 
      })
    }

    req.app = app
    req.appId = app.appId
    
    next()
  } catch (error) {
    console.error('API Key auth error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    })
  }
}

module.exports = apiKeyAuth
