require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize, testConnection } = require('./config/database');
const redisClient = require('./config/redis');

// Load models + relasi (penting agar asosiasi terdaftar sebelum sync)
require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const settingRoutes = require('./routes/settingRoutes');
const productRoutes = require('./routes/productRoutes');
const seedInitialData = require('./utils/seed');

// Initialize express app
const app = express();

// Middleware
app.use(helmet({
  // Izinkan gambar/upload dimuat oleh frontend yang beda origin (port 5173)
  crossOriginResourcePolicy: { policy: 'cross-origin' }
})); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Tokopedia Clone API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      // Will be added later
      products: '/api/products',
      orders: '/api/orders',
      chat: '/api/chat'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tidak ditemukan'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models. alter:false hanya membuat tabel yang belum ada
    // (aman untuk produksi, tidak mengubah/menghapus data yang sudah ada).
    // Set DB_ALTER=true sekali bila ada perubahan skema kolom.
    const alterSchema = process.env.DB_ALTER === 'true';
    await sequelize.sync({ alter: alterSchema });
    console.log('✅ Database models synced');

    // Seed data awal: akun pemilik + setting toko
    await seedInitialData();
    
    // Connect Redis (optional - app will work without it)
    redisClient.connect().catch(err => {
      console.warn('⚠️  Redis not connected:', err.message);
      console.log('ℹ️  App will continue without Redis');
    });
    
    // Start listening
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`📡 API: http://localhost:${PORT}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏳ Shutting down gracefully...');
  try {
    await sequelize.close();
    await redisClient.quit();
    console.log('✅ Connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();

module.exports = app;
