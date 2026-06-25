import { useState } from 'react';
import { STOCK_READY } from '../../utils/format';
import toast from 'react-hot-toast';

// Form tambah produk baru
const AddProductForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: '', price: '', price_before: '', stock: String(STOCK_READY), category: '', description: '', is_featured: false
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [open, setOpen] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      toast.error('Maksimal 5 gambar per produk');
      return;
    }
    
    setImages(files);
    
    // Generate previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removePreview = (index) => {
    const newImages = images.filter((_, idx) => idx !== index);
    const newPreviews = imagePreviews.filter((_, idx) => idx !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

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
    images.forEach(img => data.append('images', img));
    onSubmit(data, () => {
      setForm({ name: '', price: '', price_before: '', stock: String(STOCK_READY), category: '', description: '', is_featured: false });
      setImages([]);
      setImagePreviews([]);
      setOpen(false);
    });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition"
      >
        + Tambah Produk
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Tambah Produk Baru</h3>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            Harga Coret <span className="text-gray-400">(opsional, untuk diskon)</span>
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
            placeholder="Contoh: Fashion"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto Produk <span className="text-gray-500 text-xs">(Maksimal 5 gambar)</span>
          </label>
          <input
            type="file" accept="image/*" multiple
            onChange={handleImageChange}
            className="w-full text-sm text-gray-600"
          />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative aspect-square">
                  <img 
                    src={preview} 
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover rounded border border-gray-200" 
                  />
                  <button
                    type="button"
                    onClick={() => removePreview(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
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
            <span className="text-sm text-gray-700">⭐ Jadikan produk unggulan (tampil di section khusus)</span>
          </label>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit" disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
