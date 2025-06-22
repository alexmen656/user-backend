const express = require('express');
const User = require('../models/User');
const App = require('../models/App');
const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const { appId } = req.query;
    
    // Build filter
    const filter = appId ? { appId } : {};
    
    // Get basic counts
    const totalUsers = await User.countDocuments(filter);
    const activeUsers = await User.countDocuments({ ...filter, isActive: true, isBlocked: false });
    const blockedUsers = await User.countDocuments({ ...filter, isBlocked: true });
    const premiumUsers = await User.countDocuments({ ...filter, subscriptionStatus: 'premium' });
    
    // Get registration trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsersLast30Days = await User.countDocuments({
      ...filter,
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get users by subscription status
    const subscriptionStats = await User.aggregate([
      { $match: filter },
      { $group: { _id: '$subscriptionStatus', count: { $sum: 1 } } }
    ]);
    
    // Get users by platform/device
    const platformStats = await User.aggregate([
      { $match: filter },
      { $group: { _id: '$deviceInfo.deviceType', count: { $sum: 1 } } }
    ]);
    
    // Get daily registrations for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyRegistrations = await User.aggregate([
      { 
        $match: { 
          ...filter,
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get most active users (by login count)
    const topUsers = await User.find(filter)
      .select('username email loginCount lastLoginAt subscriptionStatus')
      .sort({ loginCount: -1 })
      .limit(10);
    
    res.json({
      overview: {
        totalUsers,
        activeUsers,
        blockedUsers,
        premiumUsers,
        newUsersLast30Days
      },
      subscriptionStats,
      platformStats,
      dailyRegistrations,
      topUsers
    });
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get user growth analytics
router.get('/growth', async (req, res) => {
  try {
    const { appId, period = '30' } = req.query;
    const days = parseInt(period);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const filter = appId ? { appId } : {};
    
    const growthData = await User.aggregate([
      {
        $match: {
          ...filter,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          newUsers: { $sum: 1 },
          premiumUsers: {
            $sum: {
              $cond: [{ $eq: ["$subscriptionStatus", "premium"] }, 1, 0]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(growthData);
    
  } catch (error) {
    console.error('Error fetching growth analytics:', error);
    res.status(500).json({ error: 'Failed to fetch growth analytics' });
  }
});

// Get retention analytics
router.get('/retention', async (req, res) => {
  try {
    const { appId } = req.query;
    const filter = appId ? { appId } : {};
    
    // Users who logged in within last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeUsersWeek = await User.countDocuments({
      ...filter,
      lastLoginAt: { $gte: sevenDaysAgo }
    });
    
    // Users who logged in within last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsersMonth = await User.countDocuments({
      ...filter,
      lastLoginAt: { $gte: thirtyDaysAgo }
    });
    
    const totalUsers = await User.countDocuments(filter);
    
    res.json({
      weeklyRetention: totalUsers > 0 ? (activeUsersWeek / totalUsers * 100).toFixed(2) : 0,
      monthlyRetention: totalUsers > 0 ? (activeUsersMonth / totalUsers * 100).toFixed(2) : 0,
      activeUsersWeek,
      activeUsersMonth,
      totalUsers
    });
    
  } catch (error) {
    console.error('Error fetching retention analytics:', error);
    res.status(500).json({ error: 'Failed to fetch retention analytics' });
  }
});

module.exports = router;
