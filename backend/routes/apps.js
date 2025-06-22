const express = require('express');
const App = require('../models/App');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Get all apps
router.get('/', async (req, res) => {
  try {
    const apps = await App.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    console.error('Error fetching apps:', error);
    res.status(500).json({ error: 'Failed to fetch apps' });
  }
});

// Get app by ID
router.get('/:id', async (req, res) => {
  try {
    const app = await App.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    res.json(app);
  } catch (error) {
    console.error('Error fetching app:', error);
    res.status(500).json({ error: 'Failed to fetch app' });
  }
});

// Create new app
router.post('/', [
  body('name').notEmpty().trim(),
  body('appId').notEmpty().trim(),
  body('bundleId').notEmpty().trim(),
  body('platform').isIn(['iOS', 'Android', 'Web']),
  body('version').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if app already exists
    const existingApp = await App.findOne({
      $or: [
        { appId: req.body.appId },
        { bundleId: req.body.bundleId }
      ]
    });

    if (existingApp) {
      return res.status(400).json({ 
        error: 'App with this ID or Bundle ID already exists' 
      });
    }

    // Generate API key
    const apiKey = uuidv4();

    const app = new App({
      ...req.body,
      apiKey
    });

    await app.save();
    res.status(201).json(app);

  } catch (error) {
    console.error('Error creating app:', error);
    res.status(500).json({ error: 'Failed to create app' });
  }
});

// Update app
router.put('/:id', [
  body('name').optional().notEmpty().trim(),
  body('description').optional().trim(),
  body('version').optional().notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const app = await App.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    res.json(app);
  } catch (error) {
    console.error('Error updating app:', error);
    res.status(500).json({ error: 'Failed to update app' });
  }
});

// Delete app
router.delete('/:id', async (req, res) => {
  try {
    const app = await App.findByIdAndDelete(req.params.id);
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    res.json({ message: 'App deleted successfully' });
  } catch (error) {
    console.error('Error deleting app:', error);
    res.status(500).json({ error: 'Failed to delete app' });
  }
});

// Regenerate API key
router.post('/:id/regenerate-key', async (req, res) => {
  try {
    const newApiKey = uuidv4();
    const app = await App.findByIdAndUpdate(
      req.params.id,
      { apiKey: newApiKey },
      { new: true }
    );

    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    res.json(app);
  } catch (error) {
    console.error('Error regenerating API key:', error);
    res.status(500).json({ error: 'Failed to regenerate API key' });
  }
});

module.exports = router;
