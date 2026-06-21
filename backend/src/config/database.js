const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Pilih dialect lewat env. Default ke SQLite agar bisa jalan tanpa
// instalasi database server. Set DB_DIALECT=postgres untuk produksi.
const dialect = process.env.DB_DIALECT || 'sqlite';

const commonOptions = {
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

let sequelize;

if (dialect === 'sqlite') {
  // Database disimpan sebagai file lokal di folder database/
  const storage = process.env.DB_STORAGE
    || path.join(__dirname, '..', '..', '..', 'database', 'tokopedia.sqlite');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    ...commonOptions
  });
} else {
  sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    ...commonOptions
  });
}

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
};

module.exports = { sequelize, testConnection };
