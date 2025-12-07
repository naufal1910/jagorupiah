import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';

const Header = () => {
  const location = useLocation();
  const { totalScore, sessionId } = useGameStore();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg border-b-4 border-purple-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">₹</span>
            </motion.div>
            <span className="font-bold text-xl text-gray-800">Rupiah Quest</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/level-select"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/level-select') 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              Pilih Level
            </Link>
          </nav>

          {/* Score Display */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
              <span className="text-yellow-600 font-semibold">💰</span>
              <span className="text-yellow-800 font-bold">{totalScore.toLocaleString('id-ID')}</span>
            </div>
            
            {/* Session ID (for development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-500">
                ID: {sessionId.substring(0, 8)}...
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-gray-600 hover:text-purple-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;