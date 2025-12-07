import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright and Brand */}
          <div className="mb-4 md:mb-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <span className="text-2xl">🎮</span>
              <span className="font-bold">Rupiah Quest</span>
            </motion.div>
            <p className="text-gray-400 text-sm mt-1">
              Belajar literasi keuangan dengan cara yang menyenangkan
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6 text-sm">
            <a 
              href="/about" 
              className="text-gray-400 hover:text-white transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Tentang
            </a>
            <a 
              href="/privacy" 
              className="text-gray-400 hover:text-white transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Privasi
            </a>
            <a 
              href="/help" 
              className="text-gray-400 hover:text-white transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Bantuan
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-xs">
            © 2024 Rupiah Quest. Dibuat dengan ❤️ untuk anak-anak Indonesia
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <span className="text-xs text-gray-500">
              🎯 Target Usia: 6-12 tahun
            </span>
            <span className="text-xs text-gray-500">
              📚 Kurikulum: Literasi Keuangan
            </span>
            <span className="text-xs text-gray-500">
              🇮🇩 Fokus: Rupiah Indonesia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;