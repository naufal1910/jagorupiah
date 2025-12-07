/**
 * Database Connection Utility
 * 
 * This file handles database connection and configuration.
 * Currently set up for MongoDB but can be adapted for other databases.
 */

const mongoose = require('mongoose');

// Database connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/rupiah-quest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// For development without database - mock data storage
const mockDB = {
  users: [],
  progress: [],
  scores: [],
  content: {}
};

// Mock database functions for development
const mockDBFunctions = {
  // User operations
  findUser: async (query) => mockDB.users.find(user => 
    Object.keys(query).every(key => user[key] === query[key])
  ),
  
  createUser: async (userData) => {
    const user = { ...userData, _id: Date.now().toString() };
    mockDB.users.push(user);
    return user;
  },
  
  updateUser: async (id, updateData) => {
    const index = mockDB.users.findIndex(user => user._id === id);
    if (index !== -1) {
      mockDB.users[index] = { ...mockDB.users[index], ...updateData };
      return mockDB.users[index];
    }
    return null;
  },
  
  // Progress operations
  findProgress: async (query) => mockDB.progress.find(progress => 
    Object.keys(query).every(key => progress[key] === query[key])
  ),
  
  createProgress: async (progressData) => {
    const progress = { ...progressData, _id: Date.now().toString() };
    mockDB.progress.push(progress);
    return progress;
  },
  
  updateProgress: async (id, updateData) => {
    const index = mockDB.progress.findIndex(progress => progress._id === id);
    if (index !== -1) {
      mockDB.progress[index] = { ...mockDB.progress[index], ...updateData };
      return mockDB.progress[index];
    }
    return null;
  },
  
  // Score operations
  findScores: async (query) => {
    let scores = mockDB.scores;
    if (query.sessionId) {
      scores = scores.filter(score => score.sessionId === query.sessionId);
    }
    if (query.level) {
      scores = scores.filter(score => score.level === query.level);
    }
    return scores;
  },
  
  createScore: async (scoreData) => {
    const score = { ...scoreData, _id: Date.now().toString() };
    mockDB.scores.push(score);
    return score;
  },
  
  // Content operations
  getContent: async (type) => {
    return mockDB.content[type] || null;
  },
  
  setContent: async (type, data) => {
    mockDB.content[type] = data;
    return data;
  }
};

// Check if we should use mock database or real database
const useMockDB = process.env.USE_MOCK_DB === 'true' || !process.env.DATABASE_URL;

module.exports = {
  connectDB,
  useMockDB,
  mockDBFunctions,
  mongoose
};