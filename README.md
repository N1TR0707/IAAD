# 🛒 Tokopedia Clone - Full-Featured E-Commerce Platform

Platform e-commerce marketplace lengkap dengan fitur multi-vendor, real-time chat, flash sale, voucher, dan automasi.

## 📋 Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL (Sequelize ORM)
- Redis (Caching & Session)
- Socket.io (Real-time)
- Bull (Job Queue)
- JWT Authentication
- Bcrypt, Multer, Nodemailer

### Frontend
- React 18 + Vite
- TailwindCSS
- React Router
- Zustand (State Management)
- Axios
- Socket.io Client

## 🚀 Getting Started

### Prerequisites

Pastikan Anda sudah install:
- Node.js (v18 atau lebih baru)
- PostgreSQL
- Redis (opsional, app akan jalan tanpa Redis)
- npm atau yarn

### Installation

#### 1. Clone Repository
```bash
cd tokopedia-clone
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies (sudah dilakukan)
npm install

# Buat database PostgreSQL
# Buka PostgreSQL terminal dan jalankan:
# CREATE DATABASE tokopedia_db;

# Edit file .env sesuai konfigurasi Anda
# Update DB_PASSWORD, EMAIL credentials, dll

# Start backend server
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

#### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies (sudah dilakukan)
npm install

# Edit file .env jika perlu
# VITE_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 🧪 Testing Authentication

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Flow
1. Buka `http://localhost:5173`
2. Klik "Daftar" atau "Register"
3. Isi form registrasi
4. Submit dan Anda akan diredirect ke home atau dashboard
5. Coba logout dan login kembali

## 📝 API Endpoints (Phase 1)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `PUT /api/auth/change-password` - Change password (Protected)

## 👨‍💻 Author

Ibrahim Akbar

## 📄 License

ISC
