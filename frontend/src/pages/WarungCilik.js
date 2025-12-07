import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';

const WarungCilik = () => {
  const {
    updateScore,
    updateProgress
  } = useGameStore();
  
  const [gameState, setGameState] = useState('ready'); // ready, playing, completed
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [customerOrder, setCustomerOrder] = useState(null);
  const [customerMoney, setCustomerMoney] = useState(0);
  const [selectedChange, setSelectedChange] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [correctTransactions, setCorrectTransactions] = useState(0);

  // Mock shop items
  const shopItems = [
    { id: 1, name: 'Permen', price: 500, image: '🍬' },
    { id: 2, name: 'Buku', price: 2000, image: '📚' },
    { id: 3, name: 'Pensil', price: 1000, image: '✏️' },
    { id: 4, name: 'Mainan', price: 5000, image: '🧸' },
    { id: 5, name: 'Nasi', price: 10000, image: '🍚' },
    { id: 6, name: 'Minuman', price: 3000, image: '🥤' },
    { id: 7, name: 'Kerupuk', price: 1000, image: '🍘' },
    { id: 8, name: 'Roti', price: 4000, image: '🍞' }
  ];

  // Mock currency
  const currency = [
    { id: 1, value: 100, image: '🪙', name: '100 Rupiah' },
    { id: 2, value: 200, image: '🪙', name: '200 Rupiah' },
    { id: 3, value: 500, image: '🪙', name: '500 Rupiah' },
    { id: 4, value: 1000, image: '🪙', name: '1000 Rupiah' },
    { id: 5, value: 2000, image: '💵', name: '2000 Rupiah' },
    { id: 6, value: 5000, image: '💵', name: '5000 Rupiah' },
    { id: 7, value: 10000, image: '💵', name: '10000 Rupiah' },
    { id: 8, value: 20000, image: '💵', name: '20000 Rupiah' },
    { id: 9, value: 50000, image: '💵', name: '50000 Rupiah' }
  ];

  const endGame = useCallback(() => {
    setGameState('completed');
    const finalScore = score;
    updateScore(finalScore);
    updateProgress('warung-cilik', {
      completed: true,
      bestScore: finalScore,
      stars: finalScore > 1500 ? 3 : finalScore > 800 ? 2 : 1
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

  const generateCustomerOrder = () => {
    const itemCount = Math.min(1 + Math.floor(currentLevel / 2), 3);
    const items = [];
    let totalPrice = 0;

    for (let i = 0; i < itemCount; i++) {
      const randomItem = shopItems[Math.floor(Math.random() * shopItems.length)];
      items.push(randomItem);
      totalPrice += randomItem.price;
    }

    // Generate customer payment (always more than total price)
    const possiblePayments = currency.filter(c => c.value > totalPrice);
    const payment = possiblePayments[Math.floor(Math.random() * possiblePayments.length)];

    setCustomerOrder({ items, totalPrice });
    setCustomerMoney(payment.value);
    setSelectedChange([]);
    setFeedback(null);
  };

  const startGame = () => {
    setGameState('playing');
    generateCustomerOrder();
  };

  const handleCurrencyClick = (currencyItem) => {
    const newChange = [...selectedChange, currencyItem];
    setSelectedChange(newChange);
  };

  const removeCurrencyFromChange = (index) => {
    const newChange = selectedChange.filter((_, i) => i !== index);
    setSelectedChange(newChange);
  };

  const calculateChangeTotal = () => {
    return selectedChange.reduce((total, item) => total + item.value, 0);
  };

  const checkChange = () => {
    const changeTotal = calculateChangeTotal();
    const expectedChange = customerMoney - customerOrder.totalPrice;

    if (changeTotal === expectedChange) {
      const points = timeLeft * 5 + (currentLevel * 50);
      setScore(score + points);
      setCorrectTransactions(correctTransactions + 1);
      setFeedback({ type: 'success', message: `Benar! Kembalian tepat. +${points} poin` });
      
      setTimeout(() => {
        if (correctTransactions + 1 >= currentLevel * 2) {
          if (currentLevel < 5) {
            setCurrentLevel(currentLevel + 1);
            setCorrectTransactions(0);
          } else {
            endGame();
            return;
          }
        }
        generateCustomerOrder();
      }, 2000);
    } else {
      setFeedback({ 
        type: 'error', 
        message: `Kembalian salah. Seharusnya: Rp ${expectedChange.toLocaleString('id-ID')}` 
      });
      
      setTimeout(() => {
        setSelectedChange([]);
        setFeedback(null);
      }, 2000);
    }
  };


  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setCorrectTransactions(0);
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
          <h1 className="text-3xl font-bold text-gray-800">🏪 Warung Cilik</h1>
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
            <div className="text-sm text-gray-600">Transaksi Benar</div>
            <div className="text-2xl font-bold text-purple-600">
              {correctTransactions}/{currentLevel * 2}
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
            Kamu adalah penjual warung! Hitung kembalian yang tepat untuk pelanggan.
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Mulai Bermain
          </button>
        </motion.div>
      )}

      {gameState === 'playing' && customerOrder && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Customer Order */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🛒 Pesanan Pelanggan:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {customerOrder.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center"
                >
                  <div className="text-3xl mb-2">{item.image}</div>
                  <div className="font-semibold text-gray-700">{item.name}</div>
                  <div className="text-sm text-gray-600">Rp {item.price.toLocaleString('id-ID')}</div>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700">
                Total: <span className="text-2xl text-blue-600">Rp {customerOrder.totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="text-lg font-semibold text-gray-700 mt-2">
                Uang Pelanggan: <span className="text-2xl text-green-600">Rp {customerMoney.toLocaleString('id-ID')}</span>
              </div>
              <div className="text-xl font-bold text-purple-600 mt-2">
                Kembalian yang harus diberikan: Rp {(customerMoney - customerOrder.totalPrice).toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Currency Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Pilih Kembalian:</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
              {currency.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleCurrencyClick(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-3 text-center shadow-md hover:shadow-lg transition-all"
                >
                  <div className="text-2xl mb-1">{item.image}</div>
                  <div className="text-sm font-semibold text-gray-700">
                    {item.value.toLocaleString('id-ID')}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Selected Change */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-3">Kembalian Dipilih:</h4>
              <div className="min-h-[80px] bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
                {selectedChange.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <div className="text-2xl mb-2">📥</div>
                    <p>Klik uang di atas untuk memilih kembalian</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedChange.map((item, index) => (
                      <motion.button
                        key={index}
                        onClick={() => removeCurrencyFromChange(index)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        className="bg-white rounded-lg p-2 shadow-md hover:shadow-lg transition-all border-2 border-red-200"
                      >
                        <div className="text-xl">{item.image}</div>
                        <div className="text-xs font-semibold text-gray-700">
                          {item.value.toLocaleString('id-ID')}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
              {selectedChange.length > 0 && (
                <div className="text-center mt-2">
                  <div className="text-lg font-semibold text-gray-700">
                    Total Kembalian: <span className="text-xl text-green-600">Rp {calculateChangeTotal().toLocaleString('id-ID')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={checkChange}
                disabled={selectedChange.length === 0}
                className={`px-8 py-3 font-bold rounded-full transition-all duration-200 ${
                  selectedChange.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg transform hover:scale-105'
                }`}
              >
                Cek Kembalian
              </button>
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

export default WarungCilik;