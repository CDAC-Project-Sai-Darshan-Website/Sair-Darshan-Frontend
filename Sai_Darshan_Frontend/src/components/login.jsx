import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../providers/AuthProvider';
import ApiService from '../services/ApiService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if admin login (hardcoded)
      if (email === 'admin@shirdi.com' && password === 'admin123') {
        const adminUser = {
          id: 0,
          email: 'admin@shirdi.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        navigate('/admin');
      } else {
        // Regular user login via API
        const userData = await ApiService.login(email, password);
        setUser(userData.user);
        navigate('/user/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-4 border-orange-300 bg-white p-1">
            <img 
              src="/image/sai-baba.jpg" 
              alt="Shirdi Sai Baba" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-orange-800 mb-3">श्री साईं बाबा मंदिर</h1>
          <h2 className="text-2xl font-semibold text-orange-700 mb-2">Shirdi Sai Baba Temple</h2>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full inline-block mb-3">
            <p className="font-bold text-lg">🙏 ॐ साईं राम 🙏</p>
          </div>
          <p className="text-orange-600 font-medium">Online Darshan Booking Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Devotee Login</h3>
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
                📧 Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="devotee@example.com"
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
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 via-red-500 to-orange-700 text-white py-4 rounded-xl hover:from-orange-700 hover:to-red-600 transition-all font-bold text-lg shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Connecting...' : '🚪 Enter Darshan Portal'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-800 mb-2">🔑 Admin Access:</p>
            <p className="text-xs text-blue-600">Email: admin@shirdi.com</p>
            <p className="text-xs text-blue-600">Password: admin123</p>
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-4 text-gray-500 font-medium">New Devotee?</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all font-black shadow-lg"
            >
              Register for Darshan
            </button>
          </div>
        </div>

        {/* Footer Blessing */}
        <div className="text-center mt-8">
          <p className="text-orange-700 font-bold text-lg">
            🌟 "सबका मालिक एक" - Sabka Malik Ek 🌟
          </p>
          <p className="text-orange-600 mt-2 text-sm">
            May Sai Baba bless you with peace and prosperity
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login