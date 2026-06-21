import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import settingService from '../../services/settingService';
import ProductCard from '../../components/product/ProductCard';
import IaadLogo from '../../components/common/IaadLogo';
import { imageUrl } from '../../utils/format';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    settingService.getSettings()
      .then((res) => setStore(res.data.setting))
      .catch(() => {});
    productService.getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(() => {});
    productService.getProducts({ featured: 'true', limit: 6 })
      .then((res) => setFeatured(res.data.products))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (query) params.search = query;
        if (category) params.category = category;
        if (sort) params.sort = sort;
        const res = await productService.getProducts(params);
        setProducts(res.data.products);
      } catch (err) {
        console.error('Gagal memuat produk:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query, category, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar minimalis */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              {store?.logo ? (
                <div className="w-9 h-9 rounded-xl overflow-hidden">
                  <img src={imageUrl(store.logo)} alt={store.store_name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <IaadLogo className="w-9 h-9" />
              )}
              <span className="font-bold text-slate-900 tracking-tight">{store?.store_name || 'Toko Saya'}</span>
            </Link>
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-64 pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-primary transition"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              </div>
            </form>
          </div>
        </div>
      </nav>

      {/* Hero minimalis dengan banyak ruang */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <span className="inline-block px-4 py-1.5 bg-indigo-50 text-primary text-xs font-semibold rounded-full mb-6 tracking-wide">
            ✨ {store?.city ? `Dari ${store.city}` : 'Selamat datang'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
            {store?.store_name || 'Toko Saya'}
          </h1>
          {store?.description && (
            <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              {store.description}
            </p>
          )}

          {/* Search mobile */}
          <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto sm:hidden">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="w-full pl-11 pr-4 py-3 bg-slate-100 rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary transition"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>
          </form>
        </div>
      </section>

      {/* Section Produk Unggulan */}
      {featured.length > 0 && !query && !category && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">⭐ Produk Unggulan</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Katalog produk */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {query ? 'Hasil Pencarian' : 'Koleksi Produk'}
            </h2>
            {query && <p className="text-slate-400 text-sm mt-1">untuk "{query}"</p>}
          </div>
          {!loading && products.length > 0 && (
            <span className="text-sm text-slate-400">{products.length} item</span>
          )}
        </div>

        {/* Filter kategori + urutkan */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex flex-wrap gap-2 flex-1">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${category === '' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary'}`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${category === cat ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">Terbaru</option>
            <option value="cheapest">Harga Termurah</option>
            <option value="expensive">Harga Termahal</option>
            <option value="bestseller">Terlaris</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-slate-100"></div>
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-100 rounded"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-5xl mb-4">🪄</p>
            <p className="text-slate-500">
              {query ? 'Produk tidak ditemukan. Coba kata kunci lain.' : 'Belum ada produk yang dijual.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      {/* Footer minimalis */}
      <footer className="border-t border-slate-100 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <div className="mx-auto mb-3 w-fit">
            {store?.logo ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src={imageUrl(store.logo)} alt={store.store_name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <IaadLogo className="w-10 h-10" />
            )}
          </div>
          <p className="font-semibold text-slate-900">{store?.store_name || 'Toko Saya'}</p>
          <p className="text-slate-400 text-sm mt-1">© 2026 · Pesan langsung via Telegram</p>
          <Link to="/login" className="text-slate-300 hover:text-slate-500 text-xs mt-4 inline-block transition">
            Login Pemilik
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
