import { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router';
import ApiService from '../services/ApiService';

function DarshanBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [darshanTypes, setDarshanTypes] = useState([]);
  const [selectedDarshan, setSelectedDarshan] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDarshanTypes();
  }, []);

  const loadDarshanTypes = async () => {
    try {
      const types = await ApiService.getAllDarshanTypes();
      // Map basePrice to price for consistency
      const mappedTypes = types.map(type => ({
        ...type,
        price: type.basePrice
      }));
      setDarshanTypes(mappedTypes);
    } catch (error) {
      setError('Failed to load darshan types');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const timeSlots = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

  const handleBooking = async () => {
    setLoading(true);
    setError('');
    
    try {
      const bookingData = {
        userId: Number(user.id),
        darshanSlotId: Number(selectedDarshan.id),
        bookingDate: selectedDate,
        numberOfPeople: Number(numberOfPeople)
      };

      console.log('Booking data:', bookingData);
      await ApiService.bookDarshan(bookingData);
      setBookingConfirmed(true);
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || 'Failed to book darshan');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Darshan Booked!</h2>
            <p className="text-lg text-gray-600 mb-6">Your darshan has been successfully booked.</p>
            
            <div className="bg-orange-50 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-bold text-lg mb-4">Booking Details:</h3>
              <p><strong>Darshan:</strong> {selectedDarshan.name}</p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>People:</strong> {numberOfPeople}</p>
              <p><strong>Total Amount:</strong> ₹{selectedDarshan.price * numberOfPeople}</p>
            </div>

            <button
              onClick={() => navigate('/user/dashboard')}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🛕 Darshan Booking</h1>
            <p className="text-gray-600 mt-2">Book your sacred darshan with Sai Baba</p>
          </div>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {!selectedDarshan ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {darshanTypes.map((darshan) => (
              <div key={darshan.id} className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{darshan.name}</h3>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-orange-600">₹{darshan.price}</p>
                  <p className="text-gray-600">{darshan.duration}</p>
                </div>
                <p className="text-gray-600 mb-6">{darshan.description}</p>
                <button
                  onClick={() => setSelectedDarshan(darshan)}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all"
                >
                  Select This Darshan
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Booking</h2>
            
            <div className="bg-orange-50 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-lg">{selectedDarshan.name}</h3>
              <p className="text-gray-600">₹{selectedDarshan.price} per person • {selectedDarshan.duration}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  required
                  min={getTomorrowDate()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time</label>
                <select
                  required
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Choose time slot</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of People</label>
                <select
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Amount</label>
                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-xl font-bold text-orange-600">
                    ₹{selectedDarshan.price * numberOfPeople}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setSelectedDarshan(null)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition-all"
              >
                Back to Selection
              </button>
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || loading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🔄 Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DarshanBooking;