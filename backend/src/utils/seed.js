const { User, StoreSetting } = require('../models');

// Inisialisasi data awal: akun pemilik (admin) + setting toko tunggal.
// Dipanggil sekali saat server start. Aman dijalankan berulang (idempotent).
const seedInitialData = async () => {
  // 1. Pastikan ada satu baris setting toko
  const settingCount = await StoreSetting.count();
  if (settingCount === 0) {
    await StoreSetting.create({
      id: 1,
      store_name: 'Toko Ibrahim',
      description: 'Selamat datang di toko kami.',
      telegram_username: ''
    });
    console.log('✅ Setting toko default dibuat');
  }

  // 2. Pastikan ada akun pemilik (admin)
  const ownerEmail = process.env.OWNER_EMAIL || 'admin@toko.com';
  const existingOwner = await User.findOne({ where: { email: ownerEmail } });
  if (!existingOwner) {
    await User.create({
      email: ownerEmail,
      password: process.env.OWNER_PASSWORD || 'admin123',
      name: 'Pemilik Toko',
      role: 'admin'
    });
    console.log(`✅ Akun pemilik dibuat -> email: ${ownerEmail}`);
  }
};

module.exports = seedInitialData;
