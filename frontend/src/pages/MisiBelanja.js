import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';

const MisiBelanja = () => {
  const {
    updateScore,
    updateProgress
  } = useGameStore();
  
  const [gameState, setGameState] = useState('ready'); // ready, playing, completed
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [budget, setBudget] = useState(0);
  const [shoppingList, setShoppingList] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [completedMissions, setCompletedMissions] = useState(0);

  // Mock shop items
  const allItems = [
    { id: 1, name: 'Permen', price: 500, category: 'want', image: '🍬' },
    { id: 2, name: 'Buku', price: 2000, category: 'need', image: '📚' },
    { id: 3, name: 'Pensil', price: 1000, category: 'need', image: '✏️' },
    { id: 4, name: 'Mainan', price: 5000, category: 'want', image: '🧸' },
    { id: 5, name: 'Nasi', price: 10000, category: 'need', image: '🍚' },
    { id: 6, name: 'Minuman', price: 3000, category: 'need', image: '🥤' },
    { id: 7, name: 'Kerupuk', price: 1000, category: 'want', image: '🍘' },
    { id: 8, name: 'Roti', price: 4000, category: 'need', image: '🍞' },
    { id: 9, name: 'Sepatu', price: 15000, category: 'need', image: '👟' },
    { id: 10, name: 'Kaos', price: 12000, category: 'need', image: '👕' },
    { id: 11, name: 'Game', price: 20000, category: 'want', image: '🎮' },
    { id: 12, name: 'Es Krim', price: 2500, category: 'want', image: '🍦' }
  ];

  const endGame = useCallback(() => {
    setGameState('completed');
    const finalScore = score;
    updateScore(finalScore);
    updateProgress('misi-belanja', {
      completed: true,
      bestScore: finalScore,
      stars: finalScore > 2000 ? 3 : finalScore > 1000 ? 2 : 1
    });
  }, [score, updateScore, updateProgress]);

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

  const initializeMission = () => {
    // Set budget based on level
    const missionBudget = 10000 + (currentLevel * 5000);
    setBudget(missionBudget);

    // Generate shopping list
    const needsCount = 2 + Math.floor(currentLevel / 2);
    const wantsCount = Math.min(1 + Math.floor(currentLevel / 3), 3);
    
    const needs = allItems.filter(item => item.category === 'need');
    const wants = allItems.filter(item => item.category === 'want');

    const selectedNeeds = [];
    const selectedWants = [];

    // Select needs
    for (let i = 0; i < needsCount; i++) {
      const randomNeed = needs[Math.floor(Math.random() * needs.length)];
      if (!selectedNeeds.find(item => item.id === randomNeed.id)) {
        selectedNeeds.push(randomNeed);
      }
    }

    // Select wants
    for (let i = 0; i < wantsCount; i++) {
      const randomWant = wants[Math.floor(Math.random() * wants.length)];
      if (!selectedWants.find(item => item.id === randomWant.id)) {
        selectedWants.push(randomWant);
      }
    }

    const missionList = [...selectedNeeds, ...selectedWants];
    setShoppingList(missionList);

    // Set available items (shopping list + some extra items)
    const extraItems = allItems
      .filter(item => !missionList.find(listItem => listItem.id === item.id))
      .slice(0, 5 + currentLevel);
    
    setAvailableItems([...missionList, ...extraItems]);
    setCart([]);
    setFeedback(null);
  };

  const startGame = () => {
    setGameState('playing');
    initializeMission();
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const checkShoppingList = () => {
    const cartTotal = calculateCartTotal();
    
    // Check if over budget
    if (cartTotal > budget) {
      setFeedback({ 
        type: 'error', 
        message: `Melebihi anggaran! Budget: Rp ${budget.toLocaleString('id-ID')}, Total: Rp ${cartTotal.toLocaleString('id-ID')}` 
      });
      return false;
    }

    // Check if all needs are in cart
    const needs = shoppingList.filter(item => item.category === 'need');
    const cartIds = cart.map(item => item.id);
    const allNeedsInCart = needs.every(need => cartIds.includes(need.id));

    if (!allNeedsInCart) {
      setFeedback({ 
        type: 'error', 
        message: 'Belum semua barang kebutuhan (needs) ada di keranjang!' 
      });
      return false;
    }

    // Calculate score
    const budgetRemaining = budget - cartTotal;
    const points = budgetRemaining + (timeLeft * 10) + (currentLevel * 100);
    
    setScore(score + points);
    setCompletedMissions(completedMissions + 1);
    setFeedback({ 
      type: 'success', 
      message: `Misi berhasil! Sisa uang: Rp ${budgetRemaining.toLocaleString('id-ID')}. +${points} poin` 
    });

    setTimeout(() => {
      if (completedMissions + 1 >= currentLevel) {
        if (currentLevel < 5) {
          setCurrentLevel(currentLevel + 1);
          setCompletedMissions(0);
        } else {
          endGame();
          return;
        }
      }
      initializeMission();
    }, 3000);

    return true;
  };


  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setCompletedMissions(0);
    setGameState('ready');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Game Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">🛒 Misi Belanja</h1>
          <Link to="/level-select" className="text-purple-600 hover:text-purple-800">
            ← Kembali
          </Link>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
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
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Misi Selesai</div>
            <div className="text-2xl font-bold text-purple-600">
              {completedMissions}/{currentLevel}
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
            Belanja sesuai daftar dengan anggaran yang terbatas! Prioritaskan kebutuhan (needs) sebelum keinginan (wants).
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
          {/* Shopping List and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Daftar Belanja:</h3>
              <div className="space-y-2">
                {shoppingList.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      item.category === 'need' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <div className="font-semibold text-gray-700">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          {item.category === 'need' ? '📌 Kebutuhan' : '🎯 Keinginan'}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-700">
                      Rp {item.price.toLocaleString('id-ID')}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Anggaran:</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  Rp {budget.toLocaleString('id-ID')}
                </div>
                <div className="text-sm text-gray-600">Total Budget</div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-semibold text-blue-800 mb-1">💡 Tips:</div>
                <div className="text-sm text-blue-600">
                  • Prioritaskan barang kebutuhan (needs)<br/>
                  • Cari harga termurah<br/>
                  • Sisakan uang untuk bonus poin
                </div>
              </div>
            </div>
          </div>

          {/* Available Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🛍️ Barang Tersedia:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {availableItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-all"
                >
                  <div className="text-3xl mb-2">{item.image}</div>
                  <div className="font-semibold text-gray-700 text-sm">{item.name}</div>
                  <div className="text-sm font-bold text-blue-600">
                    Rp {item.price.toLocaleString('id-ID')}
                  </div>
                  {shoppingList.find(listItem => listItem.id === item.id) && (
                    <div className="text-xs text-green-600 font-semibold mt-1">
                      {item.category === 'need' ? '📌 Need' : '🎯 Want'}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🛒 Keranjang Belanja:</h3>
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🛒</div>
                <p>Keranjang masih kosong</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <div className="font-semibold text-gray-700">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          Rp {item.price.toLocaleString('id-ID')} × {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                      >
                        +
                      </button>
                      <div className="font-bold text-gray-700 ml-4 w-24 text-right">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold text-gray-700">Total:</div>
                    <div className={`text-xl font-bold ${
                      calculateCartTotal() > budget ? 'text-red-600' : 'text-green-600'
                    }`}>
                      Rp {calculateCartTotal().toLocaleString('id-ID')}
                    </div>
                  </div>
                  {calculateCartTotal() > budget && (
                    <div className="text-red-600 text-sm mt-1">
                      ⚠️ Melebihi anggaran!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={checkShoppingList}
              disabled={cart.length === 0}
              className={`px-8 py-3 font-bold rounded-full transition-all duration-200 ${
                cart.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              Selesaikan Belanja
            </button>
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

export default MisiBelanja;