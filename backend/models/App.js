const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  appId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  bundleId: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  platform: {
    type: String,
    enum: ['iOS', 'Android', 'Web'],
    required: true
  },
  version: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowRegistration: { type: Boolean, default: true },
    requireEmailVerification: { type: Boolean, default: true },
    maxUsers: { type: Number, default: 10000 },
    features: [String] // Array of enabled features
  },
  apiKey: {
    type: String,
    required: true,
    unique: true
  },
  webhookUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better performance
appSchema.index({ appId: 1 });
appSchema.index({ bundleId: 1 });
appSchema.index({ isActive: 1 });

module.exports = mongoose.model('App', appSchema);
