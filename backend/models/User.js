const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic user information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Profile information
  firstName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  profilePicture: {
    type: String // URL to profile picture
  },
  bio: {
    type: String,
    maxlength: 500
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  
  // App-specific data
  appId: {
    type: String,
    required: true
  },
  deviceInfo: {
    deviceType: String, // iOS, Android, Web
    deviceModel: String,
    osVersion: String,
    appVersion: String
  },
  
  // Subscription/Premium status
  subscriptionStatus: {
    type: String,
    enum: ['free', 'premium', 'trial', 'expired'],
    default: 'free'
  },
  subscriptionExpiry: {
    type: Date
  },
  
  // Usage analytics
  lastLoginAt: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },
  registrationSource: {
    type: String, // organic, referral, ad, etc.
    default: 'organic'
  },
  
  // Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' }
  },
  
  // Custom fields (flexible for different app requirements)
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Metadata
  tags: [String], // For categorization
  notes: String, // Admin notes
  
}, {
  timestamps: true // createdAt, updatedAt
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ appId: 1 });
userSchema.index({ isActive: 1, isBlocked: 1 });
userSchema.index({ subscriptionStatus: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  this.loginCount += 1;
  return this.save();
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// Transform output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
