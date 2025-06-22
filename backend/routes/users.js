const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all users with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('appId').optional().isString(),
  query('status').optional().isIn(['active', 'inactive', 'blocked']),
  query('subscription').optional().isIn(['free', 'premium', 'trial', 'expired']),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.appId) {
      filter.appId = req.query.appId;
    }
    
    if (req.query.status) {
      switch (req.query.status) {
        case 'active':
          filter.isActive = true;
          filter.isBlocked = false;
          break;
        case 'inactive':
          filter.isActive = false;
          break;
        case 'blocked':
          filter.isBlocked = true;
          break;
      }
    }
    
    if (req.query.subscription) {
      filter.subscriptionStatus = req.query.subscription;
    }
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { email: searchRegex },
        { username: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex }
      ];
    }

    // Get users with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create new user
router.post('/', [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 30 }).trim(),
  body('password').isLength({ min: 6 }),
  body('appId').notEmpty().trim(),
  body('firstName').optional().isLength({ max: 50 }).trim(),
  body('lastName').optional().isLength({ max: 50 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
    }

    const user = new User(req.body);
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', [
  body('email').optional().isEmail().normalizeEmail(),
  body('username').optional().isLength({ min: 3, max: 30 }).trim(),
  body('firstName').optional().isLength({ max: 50 }).trim(),
  body('lastName').optional().isLength({ max: 50 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Don't allow password updates through this endpoint
    delete req.body.password;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Block/Unblock user
router.patch('/:id/block', async (req, res) => {
  try {
    const { blocked } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: blocked },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user block status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Get user analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const analytics = {
      userId: user._id,
      registrationDate: user.createdAt,
      lastLoginDate: user.lastLoginAt,
      totalLogins: user.loginCount,
      accountAge: Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24)), // days
      subscriptionStatus: user.subscriptionStatus,
      isActive: user.isActive,
      deviceInfo: user.deviceInfo
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
