# Rupiah Quest 🎮

Permainan edukasi literasi keuangan untuk anak Indonesia usia 6-12 tahun yang dirancang untuk membuat pembelajaran tentang mengelola uang Rupiah menjadi menyenangkan dan interaktif.

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Struktur Proyek](#struktur-proyek)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Instalasi dan Setup](#instalasi-dan-setup)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Variabel Lingkungan](#variabel-lingkungan)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## 🎯 Tentang Proyek

Rupiah Quest adalah aplikasi web edukatif yang membantu anak-anak Indonesia belajar:
- Mengenal berbagai jenis uang Rupiah
- Menghitung dan membuat perubahan (kembalian)
- Belanja dengan anggaran terbatas
- Memahami perbedaan antara kebutuhan dan keinginan
- Mengembangkan keterampilan literasi keuangan dasar

### Target Usia
- **Early Explorer (Usia 6-8 tahun)**: Fokus pada pengenalan uang dan perhitungan sederhana
- **Junior Saver (Usia 9-12 tahun)**: Konsep yang lebih kompleks seperti anggaran dan diskon

## 🌟 Fitur Utama

### 🎮 Game Edukatif
1. **Susun Uang** - Mengurutkan uang dari nilai terkecil ke terbesar
2. **Warung Cilik** - Simulasi kasir dengan perhitungan kembalian
3. **Misi Belanja** - Belanja dengan anggaran terbatas dan prioritas

### 🏆 Sistem Progress
- Level dengan kesulitan progresif
- Sistem pencapaian (achievements)
- Tracking skor dan progress
- Unlock konten baru

### 📱 Fitur Tambahan
- Desain responsif untuk mobile
- Animasi dan efek suara yang menarik
- Simpan progress lokal
- Aksesibilitas WCAG 2.1 AA compliant

## 🏗️ Struktur Proyek

```
rupiah-quest/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── api/            # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── models/         # Data models
│   │   ├── services/        # Business logic
│   │   └── utils/          # Utility functions
│   └── package.json
├── frontend/               # React frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── game/      # Game-specific components
│   │   │   ├── layout/    # Layout components
│   │   │   └── ui/        # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand state management
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── tailwind.config.js
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (opsional, mock data tersedia)
- **JWT** - Authentication
- **Jest** - Testing framework

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Zustand** - State management
- **dnd-kit** - Drag and drop functionality
- **Howler.js** - Audio management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Playwright** - E2E testing
- **TypeScript** - Type safety (opsional)

## 🚀 Instalasi dan Setup

### Prerequisites
- Node.js (v16 atau lebih tinggi)
- npm atau yarn
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-username/rupiah-quest.git
cd rupiah-quest
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 3. Environment Setup
Salin file environment example dan konfigurasi variabel yang dibutuhkan:

```bash
# Di root directory
cp .env.example .env

# Edit .env file dengan konfigurasi Anda
nano .env
```

### 4. Database Setup (Opsional)
Untuk development, aplikasi dapat berjalan dengan mock data. Untuk production:

```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS dengan Homebrew
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongod
```

## 🏃 Menjalankan Aplikasi

### Development Mode

#### Backend Server
```bash
cd backend
npm run dev
```
Server akan berjalan di `http://localhost:3001`

#### Frontend Application
```bash
cd frontend
npm start
```
Aplikasi akan berjalan di `http://localhost:3000`

### Production Mode

#### Build Backend
```bash
cd backend
npm start
```

#### Build Frontend
```bash
cd frontend
npm run build
npm start
```

## ⚙️ Variabel Lingkungan

### Backend Variables
```bash
PORT=3001                    # Server port
NODE_ENV=development          # Environment
DATABASE_URL=mongodb://...      # Database connection
JWT_SECRET=your-secret-key    # JWT secret
FRONTEND_URL=http://localhost:3000  # CORS origin
```

### Frontend Variables
```bash
REACT_APP_API_URL=http://localhost:3001/api  # Backend API URL
REACT_APP_ENVIRONMENT=development              # Environment
REACT_APP_ENABLE_SOUND=true                  # Feature flags
```

## 📚 API Documentation

### Endpoints Utama

#### Progress API
- `GET /api/progress?sessionId={id}` - Get user progress
- `POST /api/progress` - Update user progress

#### Scores API
- `GET /api/scores/leaderboard` - Get leaderboard
- `POST /api/scores` - Submit new score

#### Content API
- `GET /api/content/currency` - Get currency data
- `GET /api/content/shop-items` - Get shop items
- `GET /api/content/levels` - Get level information

### Contoh Request
```javascript
// Get user progress
fetch('/api/progress?sessionId=session-123')
  .then(response => response.json())
  .then(data => console.log(data));

// Update progress
fetch('/api/progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'session-123',
    level: 'susun-uang',
    score: 1500,
    stars: 3
  })
});
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test                    # Unit tests
npm run test:e2e           # E2E tests dengan Playwright
```

### Coverage Report
```bash
cd backend
npm run test:coverage
```

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build    # Jika ada build step
npm start        # Start production server
```

### Frontend Deployment
```bash
cd frontend
npm run build    # Build untuk production
# Deploy folder 'build' ke hosting provider
```

### Environment Variables untuk Production
- `NODE_ENV=production`
- `DATABASE_URL=mongodb://production-db-url`
- `JWT_SECRET=production-jwt-secret`
- `FRONTEND_URL=https://your-domain.com`

## 🤝 Kontribusi

Kami menyambut kontribusi! Silakan ikuti langkah-langkah berikut:

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

### Guidelines Kontribusi
- Ikuti existing code style
- Tambah tests untuk fitur baru
- Update dokumentasi
- Pastikan semua tests pass
- Follow [Conventional Commits](https://conventionalcommits.org/) specification

## 📝 Development Notes

### Game Logic
- Setiap game memiliki 5 level dengan kesulitan progresif
- Score dihitung berdasarkan waktu dan akurasi
- Progress disimpan secara lokal dan dapat disinkronkan ke server

### State Management
- Menggunakan Zustand untuk state management
- Game state, progress, dan settings disimpan terpisah
- Local storage untuk persistensi data

### Styling
- Tailwind CSS untuk styling
- Mobile-first design approach
- Custom animations dengan Framer Motion

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process pada port 3000/3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

#### Module Not Found
```bash
# Clear npm cache dan reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### CORS Issues
Pastikan `FRONTEND_URL` di backend sesuai dengan URL frontend Anda.

### Performance Tips
- Gunakan `npm run build` untuk production build
- Enable gzip compression di production server
- Gunakan CDN untuk assets statis
- Monitor bundle size dengan `npm run analyze`

## 📄 Lisensi

Proyek ini dilisensikan under MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [dnd-kit](https://dndkit.com/) - Drag and drop library
- [Zustand](https://github.com/pmndrs/zustand) - State management

## 📞 Kontak

- Project Repository: [https://github.com/your-username/rupiah-quest](https://github.com/your-username/rupiah-quest)
- Issues: [https://github.com/your-username/rupiah-quest/issues](https://github.com/your-username/rupiah-quest/issues)
- Email: contact@rupiah-quest.com

---

**Rupiah Quest** - Membuat literasi keuangan menyenangkan untuk anak Indonesia! 🇮🇩
