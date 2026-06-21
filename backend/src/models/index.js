const { sequelize } = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const StoreSetting = require('./StoreSetting');

// Tidak ada relasi multi-toko lagi. Toko tunggal (StoreSetting) berdiri sendiri,
// produk berdiri sendiri. User hanya untuk login pemilik (admin).

module.exports = {
  sequelize,
  User,
  Product,
  StoreSetting
};
