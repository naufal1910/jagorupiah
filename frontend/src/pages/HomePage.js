import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';

const HomePage = () => {
  const { totalScore, achievements } = useGameStore();

  const gameFeatures = [
    {
      id: 'susun-uang',
      title: 'Susun Uang',
      description: 'Belajar mengenal dan mengurutkan uang Rupiah',
      icon: '💰',
      difficulty: 'Mudah',
      color: 'from-green-400 to-green-600',
      path: '/susun-uang'
    },
    {
      id: 'warung-cilik',
      title: 'Warung Cilik',
      description: 'Bermain sebagai penjual dan hitung kembalian',
      icon: '🏪',
      difficulty: 'Sedang',
      color: 'from-blue-400 to-blue-600',
      path: '/warung-cilik'
    },
    {
      id: 'misi-belanja',
      title: 'Misi Belanja',
      description: 'Belanja dengan anggaran terbatas',
      icon: '🛒',
      difficulty: 'Sulit',
      color: 'from-purple-400 to-purple-600',
      path: '/misi-belanja'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          Selamat Datang di{' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Rupiah Quest
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Petualangan seru untuk belajar mengelola uang Rupiah Indonesia!
          Cocok untuk anak usia 6-12 tahun.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/level-select"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Mulai Bermain
          </Link>
          <button
            className="px-8 py-3 bg-white text-purple-600 font-bold rounded-full border-2 border-purple-600 hover:bg-purple-50 transition-colors duration-200"
          >
            Cara Bermain
          </button>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-purple-600">{totalScore.toLocaleString('id-ID')}</div>
          <div className="text-gray-600">Total Skor</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl font-bold text-yellow-500">{achievements.length}</div>
          <div className="text-gray-600">Pencapaian</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl mb-2">🎮</div>
          <div className="text-2xl font-bold text-green-600">{gameFeatures.length}</div>
          <div className="text-gray-600">Game Tersedia</div>
        </div>
      </motion.div>

      {/* Game Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Pilih Permainan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {gameFeatures.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Link to={game.path}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                    <span className="text-6xl">{game.icon}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h3>
                    <p className="text-gray-600 mb-4">{game.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        game.difficulty === 'Mudah' ? 'bg-green-100 text-green-800' :
                        game.difficulty === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {game.difficulty}
                      </span>
                      <span className="text-purple-600 font-semibold">Main →</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Learning Objectives */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Apa yang akan kamu pelajari?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🔢</div>
            <h3 className="font-semibold text-gray-800 mb-2">Mengenal Uang</h3>
            <p className="text-sm text-gray-600">Belajar mengenali berbagai jenis uang Rupiah</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">➕</div>
            <h3 className="font-semibold text-gray-800 mb-2">Berhitung</h3>
            <p className="text-sm text-gray-600">Latih kemampuan berhitung dengan uang</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🛍️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Belanja</h3>
            <p className="text-sm text-gray-600">Belajar berbelanja dengan bijak</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="font-semibold text-gray-800 mb-2">Mengelola</h3>
            <p className="text-sm text-gray-600">Paham cara mengatur keuangan</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;