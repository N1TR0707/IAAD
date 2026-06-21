const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Publik: lihat info toko
router.get('/', getSettings);

// Admin: update info toko (termasuk logo)
router.put('/', authenticate, authorize('admin'), upload.single('logo'), updateSettings);

module.exports = router;
