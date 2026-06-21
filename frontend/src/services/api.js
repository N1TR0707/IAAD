import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Return error message from server
      return Promise.reject({
        message: data.message || 'Terjadi kesalahan',
        status,
        data
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        message: 'Tidak dapat terhubung ke server',
        status: 0
      });
    } else {
      // Error in request setup
      return Promise.reject({
        message: error.message || 'Terjadi kesalahan',
        status: 0
      });
    }
  }
);

export default api;
