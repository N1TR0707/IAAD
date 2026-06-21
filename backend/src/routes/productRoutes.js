const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getCategories,
  getProductBySlug,
  getMyProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getProducts);
router.get('/categories/list', getCategories);

// Admin routes - taruh /my/list sebelum /:slug agar tidak tertangkap
router.get('/my/list', authenticate, authorize('admin'), getMyProducts);
router.post('/', authenticate, authorize('admin'), upload.single('image'), createProduct);
router.put('/:id', authenticate, authorize('admin'), upload.single('image'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

// Public detail (paling bawah karena dinamis)
router.get('/:slug', getProductBySlug);

module.exports = router;
