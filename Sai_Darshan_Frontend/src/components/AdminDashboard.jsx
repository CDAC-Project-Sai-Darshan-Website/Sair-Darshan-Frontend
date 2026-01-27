import { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import ApiService from '../services/ApiService';

function AdminDashboard() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-red-500">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'darshan', name: 'Darshan', icon: '🛕' },
    { id: 'aarti', name: 'Aarti', icon: '🔔' },
    { id: 'pooja', name: 'Pooja', icon: '🕉' },
    { id: 'donations', name: 'Donations', icon: '💰' }
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard': return <AdminHome />;
      case 'users': return <UsersAdmin showNotification={showNotification} />;
      case 'darshan': return <DarshanAdmin showNotification={showNotification} />;
      case 'aarti': return <AartiAdmin showNotification={showNotification} />;
      case 'pooja': return <PoojaAdmin showNotification={showNotification} />;
      case 'donations': return <DonationAdmin showNotification={showNotification} />;
      default: return <AdminHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg relative">
        <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <h1 className="text-xl font-bold">🛕 Admin Panel</h1>
          <p className="text-sm text-orange-100">Sai Darshan</p>
        </div>
        
        <nav className="py-4">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full text-left px-6 py-3 hover:bg-orange-50 transition-colors ${
                activeModule === module.id ? 'bg-orange-100 border-r-4 border-orange-500 text-orange-700 font-semibold' : 'text-gray-700'
              }`}
            >
              <span className="mr-3">{module.icon}</span>
              {module.name}
            </button>
          ))}
          
          <button
            onClick={() => {
              localStorage.removeItem('currentUser');
              window.location.href = '/login';
            }}
            className="w-full text-left px-6 py-3 hover:bg-red-50 transition-colors text-red-600 font-semibold mt-4"
          >
            <span className="mr-3">🚪</span>
            Logout
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function AdminHome() {
  const [stats, setStats] = useState({
    darshan: 0, aarti: 0, pooja: 0, donations: 0, users: 0
  });
  const [bookingsData, setBookingsData] = useState({
    darshan: [],
    aarti: [],
    pooja: [],
    users: []
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [darshanBookings, aartiBookings, poojaBookings, users] = await Promise.all([
        ApiService.getAllDarshanBookings().catch(() => []),
        ApiService.getAllAartiBookings().catch(() => []),
        ApiService.getAllPoojaBookings().catch(() => []),
        ApiService.getAllUsers().catch(() => [])
      ]);

      setStats({
        darshan: Array.isArray(darshanBookings) ? darshanBookings.length : 0,
        aarti: Array.isArray(aartiBookings) ? aartiBookings.length : 0,
        pooja: Array.isArray(poojaBookings) ? poojaBookings.length : 0,
        donations: 0,
        users: Array.isArray(users) ? users.length : 0
      });

      setBookingsData({
        darshan: Array.isArray(darshanBookings) ? darshanBookings : [],
        aarti: Array.isArray(aartiBookings) ? aartiBookings : [],
        pooja: Array.isArray(poojaBookings) ? poojaBookings : [],
        users: Array.isArray(users) ? users : []
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      setBookingsData({
        darshan: [],
        aarti: [],
        pooja: [],
        users: []
      });
    }
  };

  const getUserName = (userId) => {
    const user = bookingsData.users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : `User ${userId}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage all temple services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Darshan Bookings</h3>
              <p className="text-3xl font-bold">{stats.darshan}</p>
            </div>
            <span className="text-4xl opacity-80">🛕</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Aarti Bookings</h3>
              <p className="text-3xl font-bold">{stats.aarti}</p>
            </div>
            <span className="text-4xl opacity-80">🔔</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Pooja Bookings</h3>
              <p className="text-3xl font-bold">{stats.pooja}</p>
            </div>
            <span className="text-4xl opacity-80">🕉</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
              <p className="text-3xl font-bold">₹{stats.donations}</p>
            </div>
            <span className="text-4xl opacity-80">💰</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold">{stats.users}</p>
            </div>
            <span className="text-4xl opacity-80">👤</span>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Darshan */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-orange-600">🛕 Upcoming Darshan</h3>
          <div className="space-y-3">
            {bookingsData.darshan.slice(0, 5).map((booking) => (
              <div key={booking.id} className="border-l-4 border-orange-500 pl-3 py-2">
                <p className="font-medium text-sm">{getUserName(booking.userId)}</p>
                <p className="text-xs text-gray-600">{booking.darshanSlotName}</p>
                <p className="text-xs text-gray-500">{booking.bookingDate}</p>
              </div>
            ))}
            {bookingsData.darshan.length === 0 && (
              <p className="text-gray-500 text-sm">No upcoming darshan bookings</p>
            )}
          </div>
        </div>

        {/* Upcoming Aarti */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-yellow-600">🔔 Upcoming Aarti</h3>
          <div className="space-y-3">
            {bookingsData.aarti.slice(0, 5).map((booking) => (
              <div key={booking.id} className="border-l-4 border-yellow-500 pl-3 py-2">
                <p className="font-medium text-sm">{getUserName(booking.userId)}</p>
                <p className="text-xs text-gray-600">{booking.aartiType}</p>
                <p className="text-xs text-gray-500">{booking.bookingDate}</p>
              </div>
            ))}
            {bookingsData.aarti.length === 0 && (
              <p className="text-gray-500 text-sm">No upcoming aarti bookings</p>
            )}
          </div>
        </div>

        {/* Upcoming Pooja */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-600">🪔 Upcoming Pooja</h3>
          <div className="space-y-3">
            {bookingsData.pooja.slice(0, 5).map((booking) => (
              <div key={booking.id} className="border-l-4 border-purple-500 pl-3 py-2">
                <p className="font-medium text-sm">{getUserName(booking.user?.id || booking.userId)}</p>
                <p className="text-xs text-gray-600">{booking.poojaType?.displayName || 'Pooja'}</p>
                <p className="text-xs text-gray-500">{booking.poojaDate}</p>
              </div>
            ))}
            {bookingsData.pooja.length === 0 && (
              <p className="text-gray-500 text-sm">No upcoming pooja bookings</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DarshanAdmin({ showNotification }) {
  const [darshans, setDarshans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadDarshans();
  }, []);

  const loadDarshans = async () => {
    try {
      const types = await ApiService.getAllDarshanTypes();
      setDarshans(types);
    } catch (error) {
      console.error('Failed to load darshan types:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await ApiService.updateDarshanType(editingItem.id, formData);
        showNotification('Darshan updated successfully!');
      } else {
        await ApiService.createDarshanType(formData);
        showNotification('Darshan added successfully!');
      }
      loadDarshans();
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      showNotification('Operation failed!', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this darshan?')) {
      try {
        await ApiService.deleteDarshanType(id);
        showNotification('Darshan deleted!');
        loadDarshans();
      } catch (error) {
        showNotification('Delete failed!', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">🛕 Darshan Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 text-black px-6 py-3 rounded-lg hover:bg-orange-600 font-semibold"
        >
          + Add Darshan
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {darshans.map((darshan) => (
              <tr key={darshan.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{darshan.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">₹{darshan.basePrice}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">-</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    darshan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {darshan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem(darshan);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(darshan.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <DarshanForm
          item={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

function DarshanForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    basePrice: item?.basePrice || '',
    description: item?.description || '',
    isActive: item?.isActive ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      basePrice: parseFloat(formData.basePrice)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {item ? 'Edit Darshan' : 'Add Darshan'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.basePrice}
              onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-2"
              />
              Active
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-black py-3 rounded-lg hover:bg-orange-600 font-semibold"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-black py-3 rounded-lg hover:bg-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Aarti Admin Component
function AartiAdmin({ showNotification }) {
  const [aartis, setAartis] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadAartis();
  }, []);

  const loadAartis = async () => {
    try {
      const types = await ApiService.getAllAdminAartiTypes();
      setAartis(types);
    } catch (error) {
      console.error('Failed to load aarti types:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await ApiService.updateAartiType(editingItem.id, formData);
        showNotification('Aarti updated successfully!');
      } else {
        await ApiService.createAartiType(formData);
        showNotification('Aarti added successfully!');
      }
      loadAartis();
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      showNotification('Operation failed!', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this aarti?')) {
      try {
        await ApiService.deleteAartiType(id);
        showNotification('Aarti deleted!');
        loadAartis();
      } catch (error) {
        showNotification('Delete failed!', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">🔔 Aarti Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 text-black px-6 py-3 rounded-lg hover:bg-orange-600 font-semibold"
        >
          + Add Aarti
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {aartis.map((aarti) => (
              <tr key={aarti.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{aarti.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{aarti.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{aarti.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem(aarti);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(aarti.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <AartiForm
          item={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

function AartiForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    time: item?.time || '',
    price: item?.price || '',
    capacity: item?.capacity || '',
    active: item?.active ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {item ? 'Edit Aarti' : 'Add Aarti'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="text"
              required
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 6:00 AM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              required
              min="0"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                className="mr-2"
              />
              Active
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-black py-3 rounded-lg hover:bg-orange-600 font-semibold"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-black py-3 rounded-lg hover:bg-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PoojaAdmin({ showNotification }) {
  const [poojas, setPoojas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadPoojas();
  }, []);

  const loadPoojas = async () => {
    try {
      const types = await ApiService.getAllAdminPoojaTypes();
      setPoojas(types);
    } catch (error) {
      console.error('Failed to load pooja types:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await ApiService.updatePoojaType(editingItem.id, formData);
        showNotification('Pooja updated successfully!');
      } else {
        await ApiService.createPoojaType(formData);
        showNotification('Pooja added successfully!');
      }
      loadPoojas();
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      showNotification('Operation failed!', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this pooja?')) {
      try {
        await ApiService.deletePoojaType(id);
        showNotification('Pooja deleted!');
        loadPoojas();
      } catch (error) {
        showNotification('Delete failed!', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">🕉 Pooja Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 text-black px-6 py-3 rounded-lg hover:bg-orange-600 font-semibold"
        >
          + Add Pooja
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {poojas.map((pooja) => (
              <tr key={pooja.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{pooja.displayName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{pooja.durationMinutes} mins</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">₹{pooja.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem(pooja);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pooja.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <PoojaForm
          item={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

function PoojaForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    displayName: item?.displayName || '',
    durationMinutes: item?.durationMinutes || '',
    price: item?.price || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      durationMinutes: parseInt(formData.durationMinutes),
      price: parseFloat(formData.price)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {item ? 'Edit Pooja' : 'Add Pooja'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.displayName}
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.durationMinutes}
              onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-black py-3 rounded-lg hover:bg-orange-600 font-semibold"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-black py-3 rounded-lg hover:bg-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



function DonationAdmin({ showNotification }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">💰 Donation Management</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Donation management coming soon...</p>
      </div>
    </div>
  );
}

function UsersAdmin({ showNotification }) {
  const [users, setUsers] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await ApiService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">👥 Registered Users</h1>
        <div className="text-sm text-gray-600">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-gray-500">{user.gender}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.phoneNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setShowUserDetails(user)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUserDetails && (
        <UserDetailsModal
          user={showUserDetails}
          onClose={() => setShowUserDetails(null)}
        />
      )}
    </div>
  );
}

function UserDetailsModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <p className="text-gray-900">{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <p className="text-gray-900">{user.phoneNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <p className="text-gray-900">{user.dateOfBirth}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <p className="text-gray-900 capitalize">{user.gender}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Photo ID Proof</label>
            <p className="text-gray-900">{user.photoIdProof}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Date</label>
            <p className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;