const { StoreSetting } = require('../models');

// Helper: ambil baris setting tunggal (selalu id=1)
const getSetting = async () => {
  let setting = await StoreSetting.findByPk(1);
  if (!setting) {
    setting = await StoreSetting.create({ id: 1, store_name: 'Toko Saya' });
  }
  return setting;
};

// @desc    Lihat info toko (publik)
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    const setting = await getSetting();
    res.status(200).json({ success: true, data: { setting } });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil pengaturan toko' });
  }
};

// @desc    Update info toko (pemilik/admin)
// @route   PUT /api/settings
// @access  Private (admin)
const updateSettings = async (req, res) => {
  try {
    const setting = await getSetting();
    const { store_name, description, city, telegram_username, whatsapp } = req.body;

    if (store_name) setting.store_name = store_name;
    if (description !== undefined) setting.description = description;
    if (city !== undefined) setting.city = city;
    if (telegram_username !== undefined) {
      // Bersihkan @ jika user menyertakannya
      setting.telegram_username = telegram_username.replace(/^@/, '').trim();
    }
    if (whatsapp !== undefined) setting.whatsapp = whatsapp;
    if (req.file) setting.logo = `/uploads/${req.file.filename}`;

    await setting.save();

    res.status(200).json({
      success: true,
      message: 'Pengaturan toko berhasil diperbarui',
      data: { setting }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui pengaturan toko' });
  }
};

module.exports = { getSettings, updateSettings };
