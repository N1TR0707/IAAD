import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set) => ({
  // State
  user: authService.getUser(),
  token: authService.getToken(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: true }),
  
  setToken: (token) => set({ token }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Register
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.register(userData);
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        loading: false
      });
      return { success: true, data: response.data };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || 'Registrasi gagal' 
      });
      return { success: false, error: error.message };
    }
  },

  // Login
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        loading: false
      });
      return { success: true, data: response.data };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || 'Login gagal' 
      });
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  },

  // Update profile
  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.updateProfile(profileData);
      set({
        user: response.data.user,
        loading: false
      });
      return { success: true, data: response.data };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || 'Update profile gagal' 
      });
      return { success: false, error: error.message };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.changePassword(passwordData);
      set({ loading: false });
      return { success: true, message: response.message };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || 'Ubah password gagal' 
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch current user (refresh user data)
  fetchCurrentUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await authService.getCurrentUser();
      set({
        user: response.data.user,
        loading: false
      });
      return { success: true, data: response.data };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message 
      });
      return { success: false, error: error.message };
    }
  }
}));

export default useAuthStore;
