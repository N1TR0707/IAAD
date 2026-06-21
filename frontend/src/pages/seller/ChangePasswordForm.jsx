import { useState } from 'react';
import authService from '../../services/authService';

// Form ganti password pemilik
const ChangePasswordForm = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (form.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password baru minimal 6 karakter' });
      return;
    }
    if (form.newPassword !== form.confirm) {
      setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok' });
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setMessage({ type: 'success', text: 'Password berhasil diubah!' });
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Gagal mengubah password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 mt-6">
      <h2 className="text-lg font-bold text-slate-900">Ganti Password</h2>

      {message && (
        <div className={`p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Password Lama</label>
        <input
          type="password" required value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password Baru</label>
          <input
            type="password" required value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Password Baru</label>
          <input
            type="password" required value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>
      <button
        type="submit" disabled={loading}
        className="px-6 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50"
      >
        {loading ? 'Menyimpan...' : 'Ubah Password'}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
