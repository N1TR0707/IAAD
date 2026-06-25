const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getCategories,
  getProductBySlug,
  getMyProducts,
  updateProduct,
  deleteProduct,
  deleteProductImage
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

// Public routes
router.get('/', getProducts);
router.get('/categories/list', getCategories);

// Admin routes - taruh /my/list sebelum /:slug agar tidak tertangkap
router.get('/my/list', authenticate, authorize('admin'), getMyProducts);
router.post('/', authenticate, authorize('admin'), uploadMultiple, createProduct);
router.put('/:id', authenticate, authorize('admin'), uploadMultiple, updateProduct);
router.delete('/:id/images/:index', authenticate, authorize('admin'), deleteProductImage);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

// Public detail (paling bawah karena dinamis)
router.get('/:slug', getProductBySlug);

module.exports = router;
