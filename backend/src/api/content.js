const express = require('express');
const { query } = require('express-validator');
const router = express.Router();

// Mock game content data (replace with database integration)
const mockGameContent = {
  currency: {
    coins: [
      { id: 'coin-100', value: 100, name: 'Seratus Rupiah', image: '/assets/currency/coin-100.svg' },
      { id: 'coin-200', value: 200, name: 'Dua Ratus Rupiah', image: '/assets/currency/coin-200.svg' },
      { id: 'coin-500', value: 500, name: 'Lima Ratus Rupiah', image: '/assets/currency/coin-500.svg' },
      { id: 'coin-1000', value: 1000, name: 'Seribu Rupiah', image: '/assets/currency/coin-1000.svg' }
    ],
    banknotes: [
      { id: 'note-1000', value: 1000, name: 'Seribu Rupiah', image: '/assets/currency/note-1000.svg' },
      { id: 'note-2000', value: 2000, name: 'Dua Ribu Rupiah', image: '/assets/currency/note-2000.svg' },
      { id: 'note-5000', value: 5000, name: 'Lima Ribu Rupiah', image: '/assets/currency/note-5000.svg' },
      { id: 'note-10000', value: 10000, name: 'Sepuluh Ribu Rupiah', image: '/assets/currency/note-10000.svg' },
      { id: 'note-20000', value: 20000, name: 'Dua Puluh Ribu Rupiah', image: '/assets/currency/note-20000.svg' },
      { id: 'note-50000', value: 50000, name: 'Lima Puluh Ribu Rupiah', image: '/assets/currency/note-50000.svg' },
      { id: 'note-100000', value: 100000, name: 'Seratus Ribu Rupiah', image: '/assets/currency/note-100000.svg' }
    ]
  },
  shopItems: [
    { id: 'item-1', name: 'Permen', price: 500, category: 'want', image: '/assets/items/candy.svg' },
    { id: 'item-2', name: 'Buku', price: 2000, category: 'need', image: '/assets/items/book.svg' },
    { id: 'item-3', name: 'Pensil', price: 1000, category: 'need', image: '/assets/items/pencil.svg' },
    { id: 'item-4', name: 'Mainan', price: 5000, category: 'want', image: '/assets/items/toy.svg' },
    { id: 'item-5', name: 'Nasi', price: 10000, category: 'need', image: '/assets/items/rice.svg' },
    { id: 'item-6', name: 'Minuman', price: 3000, category: 'need', image: '/assets/items/drink.svg' },
    { id: 'item-7', name: 'Kerupuk', price: 1000, category: 'want', image: '/assets/items/chips.svg' },
    { id: 'item-8', name: 'Seragam Sekolah', price: 50000, category: 'need', image: '/assets/items/uniform.svg' }
  ],
  levels: {
    'susun-uang': {
      name: 'Susun Uang',
      description: 'Belajar mengenal dan mengurutkan uang sesuai nilainya',
      difficulty: 'easy',
      minAge: 6,
      maxAge: 12
    },
    'warung-cilik': {
      name: 'Warung Cilik',
      description: 'Bermain sebagai penjual di warung dan menghitung kembalian',
      difficulty: 'medium',
      minAge: 7,
      maxAge: 12
    },
    'misi-belanja': {
      name: 'Misi Belanja',
      description: 'Belanja dengan anggaran terbatas dan belajar prioritas',
      difficulty: 'hard',
      minAge: 8,
      maxAge: 12
    }
  }
};

// GET /api/content/currency - Get currency information
router.get('/currency', (req, res) => {
  const { type } = req.query;
  
  let currencyData = mockGameContent.currency;
  
  if (type === 'coins') {
    currencyData = { coins: mockGameContent.currency.coins };
  } else if (type === 'banknotes') {
    currencyData = { banknotes: mockGameContent.currency.banknotes };
  }
  
  res.status(200).json({
    success: true,
    data: currencyData
  });
});

// GET /api/content/shop-items - Get shop items
router.get('/shop-items', [
  query('category').optional().isIn(['need', 'want']).withMessage('Category must be need or want')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { category, minPrice, maxPrice } = req.query;
  
  let items = mockGameContent.shopItems;
  
  // Filter by category if specified
  if (category) {
    items = items.filter(item => item.category === category);
  }
  
  // Filter by price range if specified
  if (minPrice) {
    items = items.filter(item => item.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    items = items.filter(item => item.price <= parseInt(maxPrice));
  }
  
  res.status(200).json({
    success: true,
    data: {
      items,
      total: items.length,
      filters: { category, minPrice, maxPrice }
    }
  });
});

// GET /api/content/levels - Get level information
router.get('/levels', (req, res) => {
  const { difficulty } = req.query;
  
  let levels = mockGameContent.levels;
  
  if (difficulty) {
    levels = Object.fromEntries(
      Object.entries(levels).filter(([key, level]) => level.difficulty === difficulty)
    );
  }
  
  res.status(200).json({
    success: true,
    data: levels
  });
});

// GET /api/content/levels/:levelId - Get specific level information
router.get('/levels/:levelId', (req, res) => {
  const { levelId } = req.params;
  
  const level = mockGameContent.levels[levelId];
  
  if (!level) {
    return res.status(404).json({
      error: 'Level not found',
      message: `Level with ID '${levelId}' does not exist`
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      id: levelId,
      ...level
    }
  });
});

module.exports = router;