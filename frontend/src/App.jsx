import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Customer Pages (publik)
import Home from './pages/customer/Home';
import ProductDetail from './pages/customer/ProductDetail';

// Owner Pages
import Login from './pages/customer/Login';
import OwnerDashboard from './pages/seller/OwnerDashboard';

// Route khusus pemilik (admin)
const OwnerRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Publik - customer */}
        <Route path="/" element={<Home />} />
        <Route path="/produk/:slug" element={<ProductDetail />} />

        {/* Login pemilik */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard pemilik (admin) */}
        <Route
          path="/admin"
          element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
              <a href="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition">
                Kembali ke Beranda
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
