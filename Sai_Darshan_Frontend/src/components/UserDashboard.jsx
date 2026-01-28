import { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router';
import ApiService from '../services/ApiService';

function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    darshanCount: 0,
    aartiCount: 0,
    poojaCount: 0,
    totalDonations: 0
  });

  // Load user stats
  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const [darshanBookings, aartiBookings, poojaBookings] = await Promise.all([
        ApiService.getUserDarshanBookings(user.id).catch(() => []),
        ApiService.getUserAartiBookings(user.id).catch(() => []),
        ApiService.getUserPoojaBookings(user.id).catch(() => [])
      ]);

      setStats({
        darshanCount: darshanBookings.length,
        aartiCount: aartiBookings.length,
        poojaCount: poojaBookings.length,
        totalDonations: 0 // Donations not implemented in backend yet
      });
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-8 pb-12">
      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-white">🛕</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome, {user.firstName} {user.lastName}
            </h1>
            <p className="text-lg text-orange-600 mb-4">🙏 ॐ साईं राम 🙏</p>
            <p className="text-gray-600">Choose a service below to begin your spiritual journey</p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Temple Services</h2>
          <p className="text-gray-600">Book your spiritual journey with Sai Baba</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard 
            icon="🛕" 
            title="Darshan Booking" 
            description="Book your sacred darshan slots with Sai Baba"
            link="/user/darshan"
          />
          <ServiceCard 
            icon="🔔" 
            title="Aarti Booking" 
            description="Join daily aarti ceremonies and prayers"
            link="/user/aarti"
          />
          <ServiceCard 
            icon="🕉" 
            title="Special Pooja" 
            description="Special pooja bookings for blessings"
            link="/user/pooja"
          />
          <ServiceCard 
            icon="💰" 
            title="Donations" 
            description="Make sacred donations to the temple"
            link="/user/donation"
          />
          <ServiceCard 
            icon="📋" 
            title="My Bookings" 
            description="View and manage all your bookings"
            link="/user/my-bookings"
            isBookings={true}
          />
          <ServiceCard 
            icon="👤" 
            title="My Profile" 
            description="Update your personal information"
            link="/user/profile"
          />
        </div>
      </div>

      {/* Blessing Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">🌟 "सबका मालिक एक" - Sabka Malik Ek 🌟</h3>
          <p className="text-orange-100">May Sai Baba bless you with peace, prosperity, and spiritual fulfillment</p>
        </div>
      </div>
    </div>
  );
}

// Service Card Component
function ServiceCard({ icon, title, description, link, isBookings = false }) {
  const navigate = useNavigate();
  
  return (
    <div
      onClick={() => navigate(link)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 border border-orange-100 hover:border-orange-300"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">{icon}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {description}
        </p>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
          {isBookings ? 'View Bookings' : 'Book Now'} →
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;