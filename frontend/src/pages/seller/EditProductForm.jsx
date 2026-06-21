import { useState } from 'react';
import { STOCK_READY, isReady } from '../../utils/format';

// Form edit produk - tampil sebagai modal overlay, terisi data lama
const EditProductForm = ({ product, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState({
    name: product.name || '',
    price: product.price || '',
    price_before: product.price_before || '',
    // Normalisasi stok lama (angka) ke status Ready/Sold Out
    stock: isReady(product.stock) ? String(STOCK_READY) : '0',
    category: product.category || '',
    description: product.description || '',
    is_featured: !!product.is_featured
  });
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('price', form.price);
    data.append('price_before', form.price_before || '');
    data.append('stock', form.stock || 0);
    data.append('category', form.category);
    data.append('description', form.description);
    data.append('is_featured', form.is_featured);
    if (image) data.append('image', image);
    onSubmit(product.id, data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-bold">Edit Produk</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
            <input
              type="text" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) *</label>
            <input
              type="number" required min="0" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga Coret <span className="text-gray-400">(opsional)</span>
            </label>
            <input
              type="number" min="0" value={form.price_before}
              onChange={(e) => setForm({ ...form, price_before: e.target.value })}
              placeholder="Harga sebelum diskon"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Stok</label>
            <select
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white"
            >
              <option value={String(STOCK_READY)}>Ready</option>
              <option value="0">Sold Out</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <input
              type="text" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ganti Foto (opsional)</label>
            <input
              type="file" accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-sm text-gray-600"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={form.description} rows="3"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
              <span className="text-sm text-gray-700">⭐ Jadikan produk unggulan</span>
            </label>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit" disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <button
              type="button" onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
