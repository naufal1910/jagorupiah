import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';

const LevelSelect = () => {
  const { progress, totalScore } = useGameStore();

  const levels = [
    {
      id: 'susun-uang',
      title: 'Susun Uang',
      description: 'Belajar mengenal dan mengurutkan uang Rupiah',
      icon: '💰',
      difficulty: 'Mudah',
      color: 'from-green-400 to-green-600',
      path: '/susun-uang',
      minAge: 6,
      maxAge: 12,
      unlocked: true
    },
    {
      id: 'warung-cilik',
      title: 'Warung Cilik',
      description: 'Bermain sebagai penjual dan hitung kembalian',
      icon: '🏪',
      difficulty: 'Sedang',
      color: 'from-blue-400 to-blue-600',
      path: '/warung-cilik',
      minAge: 7,
      maxAge: 12,
      unlocked: progress['susun-uang']?.completed || false
    },
    {
      id: 'misi-belanja',
      title: 'Misi Belanja',
      description: 'Belanja dengan anggaran terbatas',
      icon: '🛒',
      difficulty: 'Sulit',
      color: 'from-purple-400 to-purple-600',
      path: '/misi-belanja',
      minAge: 8,
      maxAge: 12,
      unlocked: progress['warung-cilik']?.completed || false
    }
  ];

  const getStars = (levelId) => {
    const levelProgress = progress[levelId];
    return levelProgress ? levelProgress.stars : 0;
  };

  const getBestScore = (levelId) => {
    const levelProgress = progress[levelId];
    return levelProgress ? levelProgress.bestScore : 0;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Pilih Level Permainan
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Total Skor: <span className="font-bold text-purple-600">{totalScore.toLocaleString('id-ID')}</span>
        </p>
        <p className="text-gray-500">
          Selesaikan level sebelumnya untuk membuka level berikutnya!
        </p>
      </motion.div>

      {/* Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {levels.map((level, index) => {
          const stars = getStars(level.id);
          const bestScore = getBestScore(level.id);
          
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${
                !level.unlocked ? 'opacity-75' : 'hover:shadow-xl transform hover:scale-105 transition-all duration-300'
              }`}>
                {/* Lock Overlay */}
                {!level.unlocked && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-10 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">🔒</span>
                      <p className="text-white font-semibold">Selesaikan level sebelumnya</p>
                    </div>
                  </div>
                )}

                {/* Level Header */}
                <div className={`h-32 bg-gradient-to-br ${level.color} flex items-center justify-center relative`}>
                  <span className="text-6xl">{level.icon}</span>
                  
                  {/* Stars */}
                  {level.unlocked && (
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {[1, 2, 3].map((star) => (
                        <span
                          key={star}
                          className={`text-xl ${star <= stars ? 'text-yellow-300' : 'text-gray-300'}`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Level Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{level.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      level.difficulty === 'Mudah' ? 'bg-green-100 text-green-800' :
                      level.difficulty === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {level.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{level.description}</p>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Usia: {level.minAge}-{level.maxAge} tahun</p>
                    {level.unlocked && bestScore > 0 && (
                      <p>Skor Terbaik: {bestScore.toLocaleString('id-ID')}</p>
                    )}
                  </div>

                  {/* Action Button */}
                  {level.unlocked ? (
                    <Link to={level.path}>
                      <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-200">
                        Main Sekarang
                      </button>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                    >
                      Terkunci
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Progress Kamu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((level) => {
            const levelProgress = progress[level.id];
            const completed = levelProgress?.completed || false;
            const stars = levelProgress?.stars || 0;
            
            return (
              <div key={level.id} className="text-center">
                <div className="text-3xl mb-2">{level.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{level.title}</h3>
                <div className="flex justify-center space-x-1 mb-2">
                  {[1, 2, 3].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${star <= stars ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {completed ? 'Selesai' : 'Belum Selesai'}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Back Button */}
      <div className="text-center mt-8">
        <Link to="/">
          <button className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200">
            ← Kembali ke Beranda
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LevelSelect;