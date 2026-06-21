const { Op } = require('sequelize');
const { Product } = require('../models');
const { slugify } = require('../utils/slug');

// @desc    Tambah produk baru
// @route   POST /api/products
// @access  Private (admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, price_before, stock, category, is_featured } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan harga produk wajib diisi'
      });
    }

    const product = await Product.create({
      name,
      slug: slugify(name),
      description,
      price,
      price_before: price_before || null,
      stock: stock || 0,
      category,
      is_featured: is_featured === 'true' || is_featured === true,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Data tidak valid',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan produk',
      error: error.message
    });
  }
};

// @desc    List produk publik (katalog) dengan search & filter
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { search, category, sort, featured, page = 1, limit = 12 } = req.query;
    const where = { is_active: true };

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (category) {
      where.category = category;
    }
    if (featured === 'true') {
      where.is_featured = true;
    }

    // Tentukan urutan
    let order = [['created_at', 'DESC']]; // default: terbaru
    if (sort === 'cheapest') order = [['price', 'ASC']];
    else if (sort === 'expensive') order = [['price', 'DESC']];
    else if (sort === 'bestseller') order = [['sold', 'DESC']];

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Product.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: {
        products: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar produk',
      error: error.message
    });
  }
};

// @desc    Daftar kategori unik (untuk filter)
// @route   GET /api/products/categories/list
// @access  Public
const getCategories = async (req, res) => {
  try {
    const rows = await Product.findAll({
      attributes: ['category'],
      where: { is_active: true },
      group: ['category']
    });
    const categories = rows
      .map((r) => r.category)
      .filter((c) => c && c.trim() !== '');
    res.status(200).json({ success: true, data: { categories } });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil kategori' });
  }
};

// @desc    Detail produk publik berdasarkan slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { slug: req.params.slug } });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail produk',
      error: error.message
    });
  }
};

// @desc    List semua produk untuk dashboard pemilik
// @route   GET /api/products/my/list
// @access  Private (admin)
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['created_at', 'DESC']] });
    res.status(200).json({ success: true, data: { products } });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil produk',
      error: error.message
    });
  }
};

// @desc    Update produk
// @route   PUT /api/products/:id
// @access  Private (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    const { name, description, price, price_before, stock, category, is_active, is_featured } = req.body;
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (price_before !== undefined) product.price_before = price_before || null;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;
    if (is_active !== undefined) product.is_active = (is_active === 'true' || is_active === true);
    if (is_featured !== undefined) product.is_featured = (is_featured === 'true' || is_featured === true);
    if (req.file) product.image = `/uploads/${req.file.filename}`;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Produk berhasil diperbarui',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui produk',
      error: error.message
    });
  }
};

// @desc    Hapus produk
// @route   DELETE /api/products/:id
// @access  Private (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    await product.destroy();
    res.status(200).json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus produk',
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getCategories,
  getProductBySlug,
  getMyProducts,
  updateProduct,
  deleteProduct
};
