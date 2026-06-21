const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Pengaturan toko tunggal. Tabel ini hanya berisi satu baris.
const StoreSetting = sequelize.define('StoreSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: 1
  },
  store_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Toko Saya'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telegram_username: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Username Telegram pemilik tanpa @, untuk tombol pesan'
  },
  whatsapp: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Nomor WhatsApp opsional'
  }
}, {
  tableName: 'store_settings',
  timestamps: true
});

module.exports = StoreSetting;
