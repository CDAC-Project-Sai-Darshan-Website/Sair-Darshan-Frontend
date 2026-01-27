import { useState } from 'react';
import ApiService from '../services/ApiService';

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await ApiService.adminLogin(email, password);
      onLogin(response.user);
    } catch (error) {
      setError(error.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-4 border-orange-300 bg-white p-2">
            <div className="w-full h-full bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🛕</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-orange-800 mb-3">Admin Portal</h1>
          <h2 className="text-xl font-semibold text-orange-700 mb-2">Sai Darshan Management</h2>
          <p className="text-orange-600 font-medium">Secure Admin Access</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h3>
            <p className="text-orange-600">Enter your admin credentials</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="admin@shirdi.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔐 Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Enter admin password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 via-red-500 to-orange-700 text-white py-4 rounded-xl hover:from-orange-700 hover:to-red-600 transition-all font-bold text-lg shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Authenticating...' : '🚪 Access Admin Panel'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🔒 Secure JWT-based authentication
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-orange-700 font-bold text-lg">
            🌟 Admin Access Only 🌟
          </p>
          <p className="text-orange-600 mt-2 text-sm">
            Role-based access control enabled
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;