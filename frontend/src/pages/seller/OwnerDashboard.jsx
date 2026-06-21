import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import settingService from '../../services/settingService';
import productService from '../../services/productService';
import { formatRupiah, imageUrl, stockLabel, isReady } from '../../utils/format';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';
import StoreSettingsForm from './StoreSettingsForm';
import ChangePasswordForm from './ChangePasswordForm';

const OwnerDashboard = () => {
  const { user, logout } = useAuthStore();
  const [tab, setTab] = useState('products');
  const [setting, setSetting] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [sRes, pRes] = await Promise.all([
        settingService.getSettings(),
        productService.getMyProducts()
      ]);
      setSetting(sRes.data.setting);
      setProducts(pRes.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const flash = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveSettings = async (formData) => {
    setSubmitting(true);
    try {
      const res = await settingService.updateSettings(formData);
      setSetting(res.data.setting);
      flash('Pengaturan toko tersimpan!');
    } catch (err) {
      flash(err.message || 'Gagal menyimpan pengaturan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddProduct = async (formData, reset) => {
    setSubmitting(true);
    try {
      await productService.createProduct(formData);
      const pRes = await productService.getMyProducts();
      setProducts(pRes.data.products);
      reset();
      flash('Produk berhasil ditambahkan!');
    } catch (err) {
      flash(err.message || 'Gagal menambah produk');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (id, formData) => {
    setSubmitting(true);
    try {
      await productService.updateProduct(id, formData);
      const pRes = await productService.getMyProducts();
      setProducts(pRes.data.products);
      setEditing(null);
      flash('Produk berhasil diperbarui!');
    } catch (err) {
      flash(err.message || 'Gagal memperbarui produk');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus produk ini?')) return;
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      flash(err.message || 'Gagal menghapus produk');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-500 hover:text-primary font-medium text-sm transition inline-flex items-center gap-1">
              <span>←</span> Lihat Toko
            </Link>
            <span className="text-slate-200">|</span>
            <span className="font-bold text-slate-900">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:flex items-center gap-2">
              <span className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
              {user?.name}
            </span>
            <button onClick={logout} className="px-4 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {message && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
            {message}
          </div>
        )}

        {/* Kartu statistik ringkasan */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs text-slate-400 font-medium">Total Produk</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{products.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs text-slate-400 font-medium">Ready</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{products.filter((p) => isReady(p.stock)).length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs text-slate-400 font-medium">Sold Out</p>
            <p className="text-2xl font-extrabold text-rose-500 mt-1">{products.filter((p) => !isReady(p.stock)).length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs text-slate-400 font-medium">Unggulan</p>
            <p className="text-2xl font-extrabold text-amber-500 mt-1">{products.filter((p) => p.is_featured).length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="inline-flex gap-1 mb-8 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setTab('products')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition ${tab === 'products' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Produk ({products.length})
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition ${tab === 'settings' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pengaturan Toko
          </button>
        </div>

        {/* Tab Produk */}
        {tab === 'products' && (
          <>
            {!setting?.telegram_username && (
              <div className="mb-5 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm">
                ⚠️ Anda belum mengatur username Telegram. Tombol "Pesan" belum aktif untuk customer.
                Atur di tab <button onClick={() => setTab('settings')} className="underline font-semibold">Pengaturan Toko</button>.
              </div>
            )}

            <div className="mb-6">
              <AddProductForm onSubmit={handleAddProduct} loading={submitting} />
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center text-slate-400">
                Belum ada produk. Klik "Tambah Produk" untuk mulai memajang barang.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                      {p.image ? (
                        <img src={imageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl">📦</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 truncate">{p.name}</p>
                        {p.is_featured && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded flex-shrink-0">⭐</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {formatRupiah(p.price)} ·{' '}
                        <span className={isReady(p.stock) ? 'text-emerald-600 font-semibold' : 'text-slate-400 font-semibold'}>
                          {stockLabel(p.stock)}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => setEditing(p)}
                      className="px-4 py-1.5 text-sm font-medium text-primary border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-4 py-1.5 text-sm font-medium text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-50 transition"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab Pengaturan */}
        {tab === 'settings' && (
          <>
            <StoreSettingsForm setting={setting} onSubmit={handleSaveSettings} loading={submitting} />
            <ChangePasswordForm />
          </>
        )}
      </div>

      {/* Modal edit produk */}
      {editing && (
        <EditProductForm
          product={editing}
          onSubmit={handleUpdateProduct}
          onClose={() => setEditing(null)}
          loading={submitting}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;
