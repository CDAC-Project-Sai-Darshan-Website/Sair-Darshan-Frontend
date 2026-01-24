import { useState } from 'react';
import { authUtils, validationUtils } from '../utils/helpers';

function Signup({ onSignup, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate inputs
    if (!validationUtils.validateRequired(formData)) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!validationUtils.isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!validationUtils.isValidPhone(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      setIsLoading(false);
      return;
    }

    if (!validationUtils.isValidPassword(formData.password)) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (authUtils.emailExists(formData.email)) {
      setError('Email already registered');
      setIsLoading(false);
      return;
    }

    // Register user
    const newUser = authUtils.registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone
    });

    onSignup(newUser);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-4 border-orange-300 bg-white p-1">
            <img 
              src="/sai-baba.jpg" 
              alt="Shirdi Sai Baba" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-orange-800 mb-3">श्री साईं बाबा मंदिर</h1>
          <h2 className="text-2xl font-semibold text-orange-700 mb-2">Shirdi Sai Baba Temple</h2>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full inline-block mb-3">
            <p className="font-bold text-lg">🙏 ॐ साईं राम 🙏</p>
          </div>
          <p className="text-orange-600 font-medium">Join Our Sacred Community</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Devotee Registration</h3>
            <p className="text-orange-600">Begin your spiritual journey</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="devotee@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📱 Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔐 Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-600 via-red-500 to-orange-700 text-white hover:from-orange-700 hover:to-red-600 hover:scale-105'
              }`}
            >
              {isLoading ? '🔄 Registering...' : '🕉️ Register as Devotee'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-4 text-gray-500 font-medium">Already a devotee?</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
            <button
              onClick={onSwitchToLogin}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all font-black shadow-lg"
            >
              Login to Darshan Portal
            </button>
          </div>
        </div>

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

export default Signup;