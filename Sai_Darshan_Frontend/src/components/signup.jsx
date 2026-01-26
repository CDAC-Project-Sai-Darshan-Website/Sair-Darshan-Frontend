import { useState } from 'react';

function Signup({ onSignup, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === formData.email)) {
      setError('Email already registered');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: `${formData.firstName} ${formData.lastName}`,
      ...formData,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    onSignup(newUser);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-4 border-orange-300 bg-white p-2">
            <img 
              src="/sai-baba.jpg" 
              alt="Shirdi Sai Baba" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-orange-800 mb-3">Join Sai Family</h1>
          <p className="text-orange-600 font-medium">Register for Darshan Booking</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h3>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
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
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📱 Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="10-digit mobile number"
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
                placeholder="Create password"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔐 Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Confirm password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 via-red-500 to-orange-700 text-white py-4 rounded-xl hover:from-orange-700 hover:to-red-600 transition-all font-bold text-lg shadow-lg transform hover:scale-105"
            >
              🙏 Join Sai Family
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
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all font-bold shadow-lg"
            >
              Login Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;