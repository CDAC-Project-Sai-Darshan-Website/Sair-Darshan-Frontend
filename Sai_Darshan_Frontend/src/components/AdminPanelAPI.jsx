import { useState } from 'react';
import ApiService from '../services/ApiService';

function AdminPanelAPI({ onLogout }) {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await ApiService.logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      onLogout();
    }
  };

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'darshan', name: 'Darshan Management', icon: '🛕' },
    { id: 'aarti', name: 'Aarti Management', icon: '🔔' },
    { id: 'pooja', name: 'Special Pooja', icon: '🕉' },
    { id: 'donations', name: 'Donations', icon: '💰' },
    { id: 'reports', name: 'Reports', icon: '📈' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-orange-800">🛕 Admin Panel</h1>
          <p className="text-sm text-gray-600">API-Integrated</p>
        </div>
        
        <nav className="mt-6">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full text-left px-6 py-3 hover:bg-orange-50 transition-colors ${
                activeModule === module.id ? 'bg-orange-100 border-r-4 border-orange-500' : ''
              }`}
            >
              <span className="mr-3">{module.icon}</span>
              {module.name}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Admin Panel API - {activeModule}</h2>
          <p className="text-gray-600">API-integrated content for {activeModule} module</p>
        </div>
      </div>
    </div>
  );
}

export default AdminPanelAPI;