import { useState, useEffect } from 'react';

// Form pengaturan toko (nama, deskripsi, kota, Telegram, logo)
const StoreSettingsForm = ({ setting, onSubmit, loading }) => {
  const [form, setForm] = useState({
    store_name: '', description: '', city: '', telegram_username: '', whatsapp: ''
  });
  const [logo, setLogo] = useState(null);

  // Isi form dari data setting yang ada
  useEffect(() => {
    if (setting) {
      setForm({
        store_name: setting.store_name || '',
        description: setting.description || '',
        city: setting.city || '',
        telegram_username: setting.telegram_username || '',
        whatsapp: setting.whatsapp || ''
      });
    }
  }, [setting]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (logo) data.append('logo', logo);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Pengaturan Toko</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko *</label>
        <input
          type="text" required value={form.store_name}
          onChange={(e) => setForm({ ...form, store_name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username Telegram <span className="text-gray-400">(untuk tombol pesan)</span>
        </label>
        <div className="flex items-center">
          <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">@</span>
          <input
            type="text" value={form.telegram_username}
            onChange={(e) => setForm({ ...form, telegram_username: e.target.value })}
            placeholder="username_anda"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:border-primary"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Customer akan diarahkan ke chat Telegram ini saat memesan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
          <input
            type="text" value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (opsional)</label>
          <input
            type="text" value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="08xxx"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Toko</label>
        <textarea
          value={form.description} rows="2"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Logo Toko</label>
        <input
          type="file" accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
          className="w-full text-sm text-gray-600"
        />
      </div>

      <button
        type="submit" disabled={loading}
        className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50"
      >
        {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </button>
    </form>
  );
};

export default StoreSettingsForm;
