import api from './api';

// Setting Service - info toko tunggal
const settingService = {
  // Ambil info toko (publik)
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Update info toko (admin, FormData karena ada logo)
  updateSettings: async (formData) => {
    const response = await api.put('/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default settingService;
