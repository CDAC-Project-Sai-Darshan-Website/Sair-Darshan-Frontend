import { Calendar, Clock, Users, IndianRupee, Mail, Phone } from 'lucide-react';

function UpcomingAarti({ bookings, users }) {
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getUserInfo = (userId) => {
    return users.find(u => u.id === userId);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Aarti Bookings</h1>
        <p className="text-gray-600">Total {bookings.length} aarti bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-4xl mb-4">🔔</div>
          <p className="text-gray-600">No upcoming aarti bookings</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map((booking) => {
            const user = getUserInfo(booking.userId);
            return (
              <div key={booking.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">🔔</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{booking.category}</h3>
                      <p className="text-orange-600 text-sm font-medium">Booking ID: #{booking.id.slice(-8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-2xl font-bold text-orange-600">
                    <IndianRupee className="w-6 h-6" />
                    {booking.totalAmount}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Booking Details</h4>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {new Date(booking.date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{booking.timeSlot}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="w-5 h-5 mr-3 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-500">Number of People</p>
                        <p className="font-medium">{booking.numberOfPeople}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">User Details</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className="font-semibold text-gray-900">{booking.userName}</p>
                      <div className="flex items-center text-sm text-gray-700">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {booking.userEmail}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {booking.userPhone}
                      </div>
                      {user && (
                        <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                          <p>Gender: <span className="capitalize">{user.gender}</span></p>
                          <p>ID Proof: {user.photoIdProof}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default UpcomingAarti;