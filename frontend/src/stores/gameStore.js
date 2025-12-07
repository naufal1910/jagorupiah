import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // Game state
  isInitialized: false,
  sessionId: null,
  totalScore: 0,
  currentLevel: 1,
  progress: {},
  achievements: [],
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    language: 'id'
  },

  // Initialize game
  initializeGame: () => {
    // Generate or retrieve session ID
    let sessionId = localStorage.getItem('rupiah-quest-session');
    if (!sessionId) {
      sessionId = 'session-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('rupiah-quest-session', sessionId);
    }

    // Load saved progress
    const savedProgress = localStorage.getItem('rupiah-quest-progress');
    const savedScore = localStorage.getItem('rupiah-quest-score');
    const savedAchievements = localStorage.getItem('rupiah-quest-achievements');
    const savedSettings = localStorage.getItem('rupiah-quest-settings');

    set({
      isInitialized: true,
      sessionId,
      totalScore: savedScore ? parseInt(savedScore) : 0,
      progress: savedProgress ? JSON.parse(savedProgress) : {},
      achievements: savedAchievements ? JSON.parse(savedAchievements) : [],
      settings: savedSettings ? JSON.parse(savedSettings) : {
        soundEnabled: true,
        musicEnabled: true,
        language: 'id'
      }
    });
  },

  // Update score
  updateScore: (newScore) => {
    const currentScore = get().totalScore;
    const updatedScore = currentScore + newScore;
    
    set({ totalScore: updatedScore });
    localStorage.setItem('rupiah-quest-score', updatedScore.toString());
    
    // Check for achievements
    get().checkAchievements(updatedScore);
  },

  // Update progress
  updateProgress: (levelId, progressData) => {
    const currentProgress = get().progress;
    const updatedProgress = {
      ...currentProgress,
      [levelId]: progressData
    };
    
    set({ progress: updatedProgress });
    localStorage.setItem('rupiah-quest-progress', JSON.stringify(updatedProgress));
    
    // Also update score if best score improved
    if (progressData.bestScore) {
      get().updateScore(progressData.bestScore);
    }
  },

  // Check and unlock achievements
  checkAchievements: (score) => {
    const currentAchievements = get().achievements;
    const newAchievements = [...currentAchievements];

    // First game achievement
    if (score > 0 && !newAchievements.find(a => a.id === 'first-game')) {
      newAchievements.push({
        id: 'first-game',
        name: 'Permainan Pertama',
        description: 'Menyelesaikan permainan pertama',
        icon: '🎮',
        unlockedAt: new Date().toISOString()
      });
    }

    // Score milestones
    if (score >= 100 && !newAchievements.find(a => a.id === 'score-100')) {
      newAchievements.push({
        id: 'score-100',
        name: 'Pemula',
        description: 'Mencapai 100 poin',
        icon: '⭐',
        unlockedAt: new Date().toISOString()
      });
    }

    if (score >= 500 && !newAchievements.find(a => a.id === 'score-500')) {
      newAchievements.push({
        id: 'score-500',
        name: 'Pemain Handal',
        description: 'Mencapai 500 poin',
        icon: '🏆',
        unlockedAt: new Date().toISOString()
      });
    }

    if (score >= 1000 && !newAchievements.find(a => a.id === 'score-1000')) {
      newAchievements.push({
        id: 'score-1000',
        name: 'Master Rupiah',
        description: 'Mencapai 1000 poin',
        icon: '👑',
        unlockedAt: new Date().toISOString()
      });
    }

    // Check if all levels completed
    const progress = get().progress;
    const allLevelsCompleted = ['susun-uang', 'warung-cilik', 'misi-belanja'].every(
      level => progress[level]?.completed
    );

    if (allLevelsCompleted && !newAchievements.find(a => a.id === 'all-levels')) {
      newAchievements.push({
        id: 'all-levels',
        name: 'Petualang Lengkap',
        description: 'Menyelesaikan semua level',
        icon: '🌟',
        unlockedAt: new Date().toISOString()
      });
    }

    // Update achievements if new ones were added
    if (newAchievements.length > currentAchievements.length) {
      set({ achievements: newAchievements });
      localStorage.setItem('rupiah-quest-achievements', JSON.stringify(newAchievements));
    }
  },

  // Update settings
  updateSettings: (newSettings) => {
    const currentSettings = get().settings;
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    set({ settings: updatedSettings });
    localStorage.setItem('rupiah-quest-settings', JSON.stringify(updatedSettings));
  },

  // Reset game progress
  resetProgress: () => {
    set({
      totalScore: 0,
      progress: {},
      achievements: []
    });
    
    localStorage.removeItem('rupiah-quest-progress');
    localStorage.removeItem('rupiah-quest-score');
    localStorage.removeItem('rupiah-quest-achievements');
  },

  // Export/Import progress
  exportProgress: () => {
    const state = get();
    return {
      sessionId: state.sessionId,
      totalScore: state.totalScore,
      progress: state.progress,
      achievements: state.achievements,
      settings: state.settings,
      exportedAt: new Date().toISOString()
    };
  },

  importProgress: (importedData) => {
    if (importedData.sessionId && importedData.totalScore !== undefined) {
      set({
        sessionId: importedData.sessionId,
        totalScore: importedData.totalScore,
        progress: importedData.progress || {},
        achievements: importedData.achievements || [],
        settings: importedData.settings || get().settings
      });

      // Save to localStorage
      localStorage.setItem('rupiah-quest-session', importedData.sessionId);
      localStorage.setItem('rupiah-quest-score', importedData.totalScore.toString());
      localStorage.setItem('rupiah-quest-progress', JSON.stringify(importedData.progress || {}));
      localStorage.setItem('rupiah-quest-achievements', JSON.stringify(importedData.achievements || []));
      if (importedData.settings) {
        localStorage.setItem('rupiah-quest-settings', JSON.stringify(importedData.settings));
      }

      return true;
    }
    return false;
  }
}));

export { useGameStore };
export default useGameStore;