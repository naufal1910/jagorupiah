const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock data for development (replace with database integration)
const mockProgress = {
  sessionId: 'demo-session-123',
  levels: {
    'susun-uang': { completed: false, bestScore: 0, stars: 0 },
    'warung-cilik': { completed: false, bestScore: 0, stars: 0 },
    'misi-belanja': { completed: false, bestScore: 0, stars: 0 }
  },
  totalScore: 0,
  achievements: []
};

// GET /api/progress - Get user progress
router.get('/', (req, res) => {
  const { sessionId } = req.query;
  
  if (!sessionId) {
    return res.status(400).json({
      error: 'Missing session ID',
      message: 'Session ID is required to fetch progress'
    });
  }

  // In a real implementation, fetch from database using sessionId
  res.status(200).json({
    success: true,
    data: mockProgress
  });
});

// POST /api/progress - Update user progress
router.post('/', [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('level').isIn(['susun-uang', 'warung-cilik', 'misi-belanja']).withMessage('Invalid level'),
  body('score').isInt({ min: 0 }).withMessage('Score must be a positive integer'),
  body('stars').isInt({ min: 0, max: 3 }).withMessage('Stars must be between 0 and 3')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { sessionId, level, score, stars } = req.body;

  // Update mock progress (in real implementation, update database)
  if (mockProgress.levels[level]) {
    mockProgress.levels[level] = {
      completed: true,
      bestScore: Math.max(mockProgress.levels[level].bestScore, score),
      stars: Math.max(mockProgress.levels[level].stars, stars)
    };
    mockProgress.totalScore += score;
  }

  res.status(200).json({
    success: true,
    message: 'Progress updated successfully',
    data: mockProgress
  });
});

module.exports = router;