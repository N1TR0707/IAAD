import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';
import settingService from '../../services/settingService';
import { formatRupiah, imageUrl, telegramOrderLink, whatsappOrderLink, isReady, discountPercent } from '../../utils/format';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [pRes, sRes] = await Promise.all([
          productService.getProductBySlug(slug),
          settingService.getSettings()
        ]);
        setProduct(pRes.data.product);
        setStore(sRes.data.setting);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Memuat...</div>;
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-2xl font-bold text-gray-800 mb-2">Produk tidak ditemukan</p>
        <Link to="/" className="text-primary hover:underline">Kembali ke beranda</Link>
      </div>
    );
  }

  const img = imageUrl(product.image);
  const tgUsername = store?.telegram_username;
  const tgLink = tgUsername ? telegramOrderLink(tgUsername, product) : null;
  const waNumber = store?.whatsapp;
  const waLink = waNumber ? whatsappOrderLink(waNumber, product) : null;
  const outOfStock = product.stock < 1;
  const discount = discountPercent(product.price, product.price_before);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = { title: product.name, text: `Cek produk ini: ${product.name}`, url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link produk disalin ke clipboard!');
      }
    } catch (err) {
      // user batal share, abaikan
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link to="/" className="text-slate-600 font-semibold hover:text-primary transition inline-flex items-center gap-1.5 text-sm">
            <span>←</span> Kembali ke katalog
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Gambar */}
          <div className="relative aspect-square bg-slate-50 overflow-hidden">
            {img ? (
              <img src={img} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-200 text-8xl">📦</div>
            )}
            {!isReady(product.stock) && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                <span className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-full">SOLD OUT</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 sm:p-10 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              {isReady(product.stock) ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Ready Stock
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Stok Habis</span>
              )}
              {product.category && (
                <span className="text-xs font-semibold text-primary bg-indigo-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">{product.name}</h1>

            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <p className="text-3xl font-extrabold text-primary tracking-tight">{formatRupiah(product.price)}</p>
              {discount > 0 && (
                <>
                  <span className="text-lg text-slate-400 line-through">{formatRupiah(product.price_before)}</span>
                  <span className="px-2 py-1 bg-rose-50 text-rose-500 text-sm font-bold rounded-lg">-{discount}%</span>
                </>
              )}
            </div>

            <div className="mt-8">
              <h2 className="font-bold text-slate-400 mb-2 text-xs uppercase tracking-widest">Deskripsi</h2>
              <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                {product.description || 'Tidak ada deskripsi.'}
              </p>
            </div>

            <div className="mt-auto pt-8">
              {outOfStock ? (
                <button disabled className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold cursor-not-allowed">
                  Stok Habis
                </button>
              ) : tgLink ? (
                <button
                  type="button"
                  onClick={() => {
                    const win = window.open(tgLink, '_blank', 'noopener,noreferrer');
                    if (!win) window.location.href = tgLink;
                  }}
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-bold shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
                >
                  <span className="text-lg">✈️</span> Pesan via Telegram
                </button>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl text-sm text-center">
                  Penjual belum mengatur kontak Telegram.
                </div>
              )}

              {tgUsername && !outOfStock && (
                <p className="text-xs text-slate-400 mt-3 text-center">
                  Diarahkan ke chat Telegram penjual (@{tgUsername.replace(/^@/, '')})
                </p>
              )}

              {/* Tombol WhatsApp (alternatif) */}
              {waLink && !outOfStock && (
                <button
                  type="button"
                  onClick={() => {
                    const win = window.open(waLink, '_blank', 'noopener,noreferrer');
                    if (!win) window.location.href = waLink;
                  }}
                  className="w-full mt-3 flex items-center justify-center gap-2.5 py-4 bg-[#25D366] text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 hover:bg-[#1ebe5d] active:scale-[0.98] transition-all"
                >
                  <span className="text-lg">💬</span> Pesan via WhatsApp
                </button>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-600 rounded-2xl font-semibold hover:bg-slate-50 transition"
              >
                <span>🔗</span> Bagikan Produk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
