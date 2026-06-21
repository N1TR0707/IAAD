// Base URL backend (tanpa /api) untuk akses file upload
export const SERVER_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

// Format angka ke Rupiah
export const formatRupiah = (value) => {
  const num = Number(value) || 0;
  return 'Rp' + num.toLocaleString('id-ID');
};

// Bangun URL gambar dari path yang disimpan backend (/uploads/xxx)
export const imageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return SERVER_URL + path;
};

// Status stok berbasis angka: >0 = Ready, 0 = Sold Out
export const STOCK_READY = 99;   // nilai stok saat produk "Ready"
export const isReady = (stock) => Number(stock) > 0;
export const stockLabel = (stock) => (isReady(stock) ? 'Ready' : 'Sold Out');

// Hitung persentase diskon bila ada price_before yang lebih tinggi dari price
export const discountPercent = (price, priceBefore) => {
  const p = Number(price);
  const pb = Number(priceBefore);
  if (!pb || pb <= p) return 0;
  return Math.round(((pb - p) / pb) * 100);
};

// Bangun link Telegram untuk pesan produk.
// Membuka chat ke username pemilik dengan teks pesanan terisi otomatis.
export const telegramOrderLink = (username, product) => {
  if (!username) return null;
  const clean = String(username).replace(/^@/, '').trim();
  const text = `Halo, saya mau pesan produk:\n\n` +
    `🛍️ ${product.name}\n` +
    `💰 ${formatRupiah(product.price)}\n\n` +
    `Apakah masih tersedia?`;
  return `https://t.me/${clean}?text=${encodeURIComponent(text)}`;
};

// Bangun link WhatsApp untuk pesan produk.
export const whatsappOrderLink = (number, product) => {
  if (!number) return null;
  // Normalisasi nomor: buang spasi/strip, ubah awalan 0 jadi 62
  let clean = String(number).replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) clean = '62' + clean.slice(1);
  const text = `Halo, saya mau pesan produk:\n\n` +
    `🛍️ ${product.name}\n` +
    `💰 ${formatRupiah(product.price)}\n\n` +
    `Apakah masih tersedia?`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
};
