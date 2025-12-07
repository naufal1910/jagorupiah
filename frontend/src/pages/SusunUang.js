import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';

const SusunUang = () => {
  const {
    updateScore,
    updateProgress
  } = useGameStore();
  
  const [gameState, setGameState] = useState('ready'); // ready, playing, completed
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currencyItems, setCurrencyItems] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);
  const [feedback, setFeedback] = useState(null);

  // Mock currency data
  const mockCurrency = [
    { id: 1, value: 100, type: 'coin', name: '100 Rupiah', image: '🪙' },
    { id: 2, value: 200, type: 'coin', name: '200 Rupiah', image: '🪙' },
    { id: 3, value: 500, type: 'coin', name: '500 Rupiah', image: '🪙' },
    { id: 4, value: 1000, type: 'coin', name: '1000 Rupiah', image: '🪙' },
    { id: 5, value: 1000, type: 'note', name: '1000 Rupiah', image: '💵' },
    { id: 6, value: 2000, type: 'note', name: '2000 Rupiah', image: '💵' },
    { id: 7, value: 5000, type: 'note', name: '5000 Rupiah', image: '💵' },
    { id: 8, value: 10000, type: 'note', name: '10000 Rupiah', image: '💵' },
    { id: 9, value: 20000, type: 'note', name: '20000 Rupiah', image: '💵' },
    { id: 10, value: 50000, type: 'note', name: '50000 Rupiah', image: '💵' },
    { id: 11, value: 100000, type: 'note', name: '100000 Rupiah', image: '💵' }
  ];

  const initializeLevel = useCallback(() => {
    // Get random currency items based on level
    const itemCount = Math.min(3 + currentLevel, 8);
    const shuffled = [...mockCurrency]
      .sort(() => Math.random() - 0.5)
      .slice(0, itemCount);
    
    setCurrencyItems(shuffled);
    setSortedItems([]);
    setGameState('ready');
    setTimeLeft(60 + (currentLevel * 10));
    setFeedback(null);
  }, [currentLevel]);

  const endGame = useCallback(() => {
    setGameState('completed');
    const finalScore = score;
    updateScore(finalScore);
    updateProgress('susun-uang', {
      completed: true,
      bestScore: finalScore,
      stars: finalScore > 1000 ? 3 : finalScore > 500 ? 2 : 1
    });
  }, [score, updateScore, updateProgress]);

  // Initialize game
  useEffect(() => {
    initializeLevel();
  }, [initializeLevel]);

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
  }, [timeLeft, gameState, endGame]);


  const startGame = () => {
    setGameState('playing');
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('currencyItem', JSON.stringify(item));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('currencyItem'));
    
    const newSortedItems = [...sortedItems, item];
    setSortedItems(newSortedItems);
    
    // Remove from available items
    setCurrencyItems(currencyItems.filter(i => i.id !== item.id));
    
    // Check if all items are sorted
    if (newSortedItems.length === mockCurrency.slice(0, Math.min(3 + currentLevel, 8)).length) {
      checkAnswer(newSortedItems);
    }
  };

  const checkAnswer = (items) => {
    const isCorrect = items.every((item, index) => {
      if (index === 0) return true;
      return item.value >= items[index - 1].value;
    });

    if (isCorrect) {
      const points = timeLeft * 10 + (currentLevel * 100);
      setScore(score + points);
      setFeedback({ type: 'success', message: `Benar! +${points} poin` });
      setTimeout(() => {
        if (currentLevel < 5) {
          setCurrentLevel(currentLevel + 1);
        } else {
          endGame();
        }
      }, 2000);
    } else {
      setFeedback({ type: 'error', message: 'Urutan belum benar, coba lagi!' });
      setTimeout(() => {
        initializeLevel();
      }, 2000);
    }
  };


  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    initializeLevel();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Susun Uang</h1>
          <Link to="/level-select" className="text-purple-600 hover:text-purple-800">
            ← Kembali
          </Link>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Level</div>
            <div className="text-2xl font-bold text-blue-600">{currentLevel}/5</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Skor</div>
            <div className="text-2xl font-bold text-green-600">{score}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Waktu</div>
            <div className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-600' : 'text-yellow-600'}`}>
              {timeLeft}s
            </div>
          </div>
        </div>
      </motion.div>

      {/* Game Area */}
      {gameState === 'ready' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Level {currentLevel}
          </h2>
          <p className="text-gray-600 mb-6">
            Susun uang dari nilai terkecil ke terbesar!
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Mulai Bermain
          </button>
        </motion.div>
      )}

      {gameState === 'playing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Available Currency */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Uang Tersedia:</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {currencyItems.map((item) => (
                <motion.div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  whileHover={{ scale: 1.05 }}
                  whileDrag={{ scale: 1.1 }}
                  className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-4 cursor-move text-center shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-3xl mb-2">{item.image}</div>
                  <div className="text-sm font-semibold text-gray-700">
                    {item.value.toLocaleString('id-ID')}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Drop Zone */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Susun di sini (dari kecil ke besar):
            </h3>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="min-h-[200px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-dashed border-purple-300"
            >
              {sortedItems.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">📥</div>
                  <p>Seret uang ke sini untuk menyusunnya</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                  {sortedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-4 text-center shadow-md"
                    >
                      <div className="text-3xl mb-2">{item.image}</div>
                      <div className="text-sm font-semibold text-gray-700">
                        {item.value.toLocaleString('id-ID')}
                      </div>
                      <div className="text-xs text-gray-500">#{index + 1}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg text-center font-semibold ${
                feedback.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </motion.div>
      )}

      {gameState === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">🎉 Selesai!</h2>
          <p className="text-xl text-gray-600 mb-6">
            Skor Akhir: <span className="font-bold text-green-600">{score}</span>
          </p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Main Lagi
            </button>
            <Link
              to="/level-select"
              className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-colors duration-200"
            >
              Pilih Level Lain
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SusunUang;