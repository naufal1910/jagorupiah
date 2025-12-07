import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

// Import components
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LevelSelect from './pages/LevelSelect';
import SusunUang from './pages/SusunUang';
import WarungCilik from './pages/WarungCilik';
import MisiBelanja from './pages/MisiBelanja';

// Import stores
import useGameStore from './stores/gameStore';

function App() {
  const { isInitialized, initializeGame } = useGameStore();

  // Initialize game on app start
  React.useEffect(() => {
    if (!isInitialized) {
      initializeGame();
    }
  }, [isInitialized, initializeGame]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-xl font-semibold text-purple-700">Loading Rupiah Quest...</span>
      </div>
    );
  }

  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/level-select" element={<LevelSelect />} />
            <Route path="/susun-uang" element={<SusunUang />} />
            <Route path="/warung-cilik" element={<WarungCilik />} />
            <Route path="/misi-belanja" element={<MisiBelanja />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;