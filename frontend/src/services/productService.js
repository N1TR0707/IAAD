import api from './api';

// Product Service - kelola produk
const productService = {
  // Katalog publik dengan search/filter/pagination
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Detail produk publik
  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/${slug}`);
    return response.data;
  },

  // Daftar kategori unik (untuk filter)
  getCategories: async () => {
    const response = await api.get('/products/categories/list');
    return response.data;
  },

  // Produk milik toko sendiri
  getMyProducts: async () => {
    const response = await api.get('/products/my/list');
    return response.data;
  },

  // Tambah produk (FormData untuk upload gambar)
  createProduct: async (formData) => {
    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update produk
  updateProduct: async (id, formData) => {
    const response = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Hapus produk
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Hapus gambar tertentu dari produk
  deleteProductImage: async (productId, imageIndex) => {
    const response = await api.delete(`/products/${productId}/images/${imageIndex}`);
    return response.data;
  }
};

export default productService;
