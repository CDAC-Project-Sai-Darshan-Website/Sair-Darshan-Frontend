import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router';

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', name: 'Home', icon: '🏠', path: '/user/dashboard' },
    { id: 'darshan', name: 'Darshan', icon: '🛕', path: '/user/darshan' },
    { id: 'aarti', name: 'Aarti', icon: '🔔', path: '/user/aarti' },
    { id: 'pooja', name: 'Pooja', icon: '🕉', path: '/user/pooja' },
    { id: 'donation', name: 'Donate', icon: '💰', path: '/user/donation' },
    { id: 'bookings', name: 'Bookings', icon: '📋', path: '/user/my-bookings' }
  ];

  return (
    <nav className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white shadow-2xl sticky top-0 z-50 border-b-4 border-orange-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-orange-600 text-2xl">🛕</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide">Sai Darshan</h1>
              <p className="text-xs text-orange-100 font-medium">Online Booking Portal</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white hover:bg-opacity-20 hover:shadow-md"
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-orange-100 font-medium">{user.role === 'admin' ? 'Temple Admin' : 'Devotee'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-orange-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-orange-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;