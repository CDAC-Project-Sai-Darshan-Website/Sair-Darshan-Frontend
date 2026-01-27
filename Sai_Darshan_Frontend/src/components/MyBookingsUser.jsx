import { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';

function MyBookingsUser() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState({
    darshan: [],
    aarti: [],
    pooja: [],
    donations: []
  });

  useEffect(() => {
    if (!user) return;
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    try {
      const [darshanBookings, aartiBookings, poojaBookings] = await Promise.all([
        ApiService.getUserDarshanBookings(user.id).catch(() => []),
        ApiService.getUserAartiBookings(user.id).catch(() => []),
        ApiService.getUserPoojaBookings(user.id).catch(() => [])
      ]);

      setBookings({
        darshan: darshanBookings,
        aarti: aartiBookings,
        pooja: poojaBookings,
        donations: [] // Donations not implemented in backend yet
      });
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const totalBookings = bookings.darshan.length + bookings.aarti.length + 
                       bookings.pooja.length + bookings.donations.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📋 My Bookings</h1>
            <p className="text-gray-600 mt-2">View all your temple bookings</p>
          </div>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
          >
            Back
          </button>
        </div>

        {totalBookings === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Bookings Yet</h2>
            <p className="text-gray-600 mb-8">You haven't made any bookings yet. Start your spiritual journey!</p>
            <button
              onClick={() => navigate('/user/dashboard')}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all"
            >
              Make Your First Booking
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Darshan Bookings */}
            {bookings.darshan.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🛕 Darshan Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Time</th>
                        <th className="text-left py-2">People</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.darshan.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="py-2">{booking.darshanType}</td>
                          <td className="py-2">{booking.date}</td>
                          <td className="py-2">{booking.time}</td>
                          <td className="py-2">{booking.numberOfPeople}</td>
                          <td className="py-2">₹{booking.totalAmount}</td>
                          <td className="py-2">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Aarti Bookings */}
            {bookings.aarti.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🔔 Aarti Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Time</th>
                        <th className="text-left py-2">People</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.aarti.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="py-2">{booking.aartiType}</td>
                          <td className="py-2">{booking.date}</td>
                          <td className="py-2">{booking.time}</td>
                          <td className="py-2">{booking.numberOfPeople}</td>
                          <td className="py-2">₹{booking.totalAmount}</td>
                          <td className="py-2">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              {booking.status || 'Confirmed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pooja Bookings */}
            {bookings.pooja.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🕉 Special Pooja Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Pooja</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Time</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.pooja.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="py-2">{booking.category}</td>
                          <td className="py-2">{booking.date}</td>
                          <td className="py-2">{booking.timeSlot}</td>
                          <td className="py-2">₹{booking.totalAmount}</td>
                          <td className="py-2">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Donations */}
            {bookings.donations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">💰 My Donations</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.donations.map((donation) => (
                        <tr key={donation.id} className="border-b">
                          <td className="py-2">{donation.donationType}</td>
                          <td className="py-2">{new Date(donation.date).toLocaleDateString()}</td>
                          <td className="py-2">₹{donation.amount}</td>
                          <td className="py-2">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Booking Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{bookings.darshan.length}</div>
                  <div className="text-sm text-gray-600">Darshan Bookings</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{bookings.aarti.length}</div>
                  <div className="text-sm text-gray-600">Aarti Bookings</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{bookings.pooja.length}</div>
                  <div className="text-sm text-gray-600">Pooja Bookings</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{bookings.donations.length}</div>
                  <div className="text-sm text-gray-600">Donations</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookingsUser;