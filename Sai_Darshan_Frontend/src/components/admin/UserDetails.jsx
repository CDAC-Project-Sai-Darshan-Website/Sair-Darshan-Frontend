import { useState, useEffect } from 'react';
import { ArrowLeft, User as UserIcon, Mail, Phone, Calendar, CreditCard, Heart, IndianRupee } from 'lucide-react';

function UserDetails({ userId, onBack }) {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u) => u.id === userId);
    setUser(foundUser);

    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const userBookings = allBookings.filter((b) => b.userId === userId);
    setBookings(userBookings);

    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    const userDonations = allDonations.filter((d) => d.userId === userId);
    setDonations(userDonations);
  }, [userId]);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const upcomingBookings = bookings.filter(b => new Date(b.date) >= new Date());
  const pastBookings = bookings.filter(b => new Date(b.date) < new Date());

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Users List
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-500">User ID: {user.id}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Active User
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium text-gray-900">{user.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-900">
                {new Date(user.dateOfBirth).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <UserIcon className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium text-gray-900 capitalize">{user.gender}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CreditCard className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Photo ID Proof</p>
              <p className="font-medium text-gray-900">{user.photoIdProof}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Registered On</p>
              <p className="font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-blue-700">{bookings.length}</p>
            </div>
            <Calendar className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Upcoming</p>
              <p className="text-3xl font-bold text-green-700">{upcomingBookings.length}</p>
            </div>
            <Calendar className="w-12 h-12 text-green-400" />
          </div>
        </div>
        <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 mb-1">Total Donations</p>
              <div className="flex items-center text-3xl font-bold text-orange-700">
                <IndianRupee className="w-8 h-8" />
                {totalDonations}
              </div>
            </div>
            <Heart className="w-12 h-12 text-orange-400 fill-current" />
          </div>
        </div>
      </div>

      {bookings.length === 0 && donations.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-600">No activity from this user yet</p>
        </div>
      )}
    </div>
  );
}

export default UserDetails;