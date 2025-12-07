const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock leaderboard data (replace with database integration)
const mockLeaderboard = [
  { sessionId: 'player-1', playerName: 'Ani', score: 2500, level: 'misi-belanja', timestamp: '2024-01-15T10:30:00Z' },
  { sessionId: 'player-2', playerName: 'Budi', score: 2200, level: 'warung-cilik', timestamp: '2024-01-15T09:45:00Z' },
  { sessionId: 'player-3', playerName: 'Citra', score: 1800, level: 'susun-uang', timestamp: '2024-01-15T08:20:00Z' },
  { sessionId: 'player-4', playerName: 'Doni', score: 1600, level: 'misi-belanja', timestamp: '2024-01-14T16:15:00Z' },
  { sessionId: 'player-5', playerName: 'Eka', score: 1400, level: 'warung-cilik', timestamp: '2024-01-14T14:30:00Z' }
];

// GET /api/scores/leaderboard - Get leaderboard
router.get('/leaderboard', (req, res) => {
  const { level, limit = 10 } = req.query;
  
  let filteredScores = mockLeaderboard;
  
  // Filter by level if specified
  if (level) {
    filteredScores = mockLeaderboard.filter(score => score.level === level);
  }
  
  // Sort by score (highest first) and limit results
  const leaderboard = filteredScores
    .sort((a, b) => b.score - a.score)
    .slice(0, parseInt(limit));
  
  res.status(200).json({
    success: true,
    data: {
      leaderboard,
      totalEntries: filteredScores.length,
      filter: level || 'all'
    }
  });
});

// POST /api/scores - Submit a new score
router.post('/', [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('playerName').isLength({ min: 1, max: 20 }).withMessage('Player name must be 1-20 characters'),
  body('score').isInt({ min: 0 }).withMessage('Score must be a positive integer'),
  body('level').isIn(['susun-uang', 'warung-cilik', 'misi-belanja']).withMessage('Invalid level')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { sessionId, playerName, score, level } = req.body;

  // Create new score entry (in real implementation, save to database)
  const newScore = {
    sessionId,
    playerName,
    score,
    level,
    timestamp: new Date().toISOString()
  };

  // Add to mock leaderboard
  mockLeaderboard.push(newScore);

  // Determine rank
  const rank = mockLeaderboard
    .filter(s => s.level === level)
    .sort((a, b) => b.score - a.score)
    .findIndex(s => s.sessionId === sessionId) + 1;

  res.status(201).json({
    success: true,
    message: 'Score submitted successfully',
    data: {
      score: newScore,
      rank,
      totalPlayers: mockLeaderboard.filter(s => s.level === level).length
    }
  });
});

// GET /api/scores/:sessionId - Get player's scores
router.get('/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  const playerScores = mockLeaderboard.filter(score => score.sessionId === sessionId);
  
  if (playerScores.length === 0) {
    return res.status(404).json({
      error: 'No scores found',
      message: 'No scores found for this session ID'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      sessionId,
      scores: playerScores,
      totalScore: playerScores.reduce((sum, score) => sum + score.score, 0),
      bestScore: Math.max(...playerScores.map(s => s.score))
    }
  });
});

module.exports = router;