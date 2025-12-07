const express = require('express');
const router = express.Router();

// Import route modules
const progressRoutes = require('./progress');
const scoresRoutes = require('./scores');
const contentRoutes = require('./content');

// Health check for API
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Rupiah Quest API v1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// Route modules
router.use('/progress', progressRoutes);
router.use('/scores', scoresRoutes);
router.use('/content', contentRoutes);

module.exports = router;