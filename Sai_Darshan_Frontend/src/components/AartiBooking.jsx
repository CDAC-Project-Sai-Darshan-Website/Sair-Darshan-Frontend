import { useState, useEffect } from 'react';
import { Calendar, IndianRupee, Clock, Info, CheckCircle, Users } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import ApiService from '../services/ApiService';

const aartiGuidelines = [
  'Arrive at least 15 minutes before the scheduled aarti time',
  'Mobile phones must be switched off or kept on silent mode',
  'Photography and videography are strictly prohibited during aarti',
  'Maintain complete silence and devotional atmosphere',
  'Follow the instructions of temple priests and volunteers',
  'Prasad will be distributed after each aarti ceremony',
  'Children must be accompanied by adults at all times',
  'Proper traditional dress code is recommended',
  'Remove footwear before entering the aarti hall',
  'Participate with devotion and respect for all devotees'
];

function AartiBooking() {
  const { user } = useAuth();
  const [aartiTypes, setAartiTypes] = useState([]);
  const [selectedAarti, setSelectedAarti] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showDevoteeForm, setShowDevoteeForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [error, setError] = useState('');
  const [devoteeDetails, setDevoteeDetails] = useState({
    name: user?.firstName + ' ' + user?.lastName || '',
    age: '',
    gender: '',
    mobile: user?.phoneNumber || '',
    email: user?.email || ''
  });

  useEffect(() => {
    loadAartiTypes();
  }, []);

  const loadAartiTypes = async () => {
    try {
      setLoadingTypes(true);
      const types = await ApiService.getAartiTypes();
      // Transform backend data: "Name|Time|Price"
      const transformedTypes = types.map((type) => {
        const [name, time, price] = type.split('|');
        return {
          id: name.toLowerCase().replace(/\s+/g, '_'),
          name: name,
          time: time || 'TBD',
          price: parseFloat(price) || 100,
          description: '',
          duration: '',
          guidelines: ''
        };
      });
      setAartiTypes(transformedTypes);
    } catch (error) {
      setError('Failed to load aarti types');
    } finally {
      setLoadingTypes(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!selectedAarti || !selectedDate) {
      alert('Please select aarti type and date');
      return;
    }
    setShowDevoteeForm(true);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validation
    if (!devoteeDetails.name || !devoteeDetails.age || !devoteeDetails.gender || !devoteeDetails.mobile) {
      setError('Please fill all devotee details');
      setLoading(false);
      return;
    }

    if (devoteeDetails.mobile.length !== 10 || !/^[0-9]+$/.test(devoteeDetails.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    if (parseInt(devoteeDetails.age) < 1 || parseInt(devoteeDetails.age) > 120) {
      setError('Please enter a valid age between 1 and 120');
      setLoading(false);
      return;
    }
    
    const aarti = aartiTypes.find(a => a.id === selectedAarti);
    if (!aarti) return;

    try {
      const bookingData = {
        userId: user.id,
        aartiType: aarti.name,
        bookingDate: selectedDate,
        aartiTime: aarti.time || 'TBD',
        numberOfPeople: numberOfPeople
      };

      await ApiService.bookAarti(bookingData);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedAarti('');
        setSelectedDate('');
        setNumberOfPeople(1);
        setShowDevoteeForm(false);
        setDevoteeDetails({
          name: user?.firstName + ' ' + user?.lastName || '',
          age: '',
          gender: '',
          mobile: user?.phoneNumber || '',
          email: user?.email || ''
        });
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to book aarti');
    } finally {
      setLoading(false);
    }
  };

  const selectedAartiData = aartiTypes.find(a => a.id === selectedAarti);
  const totalAmount = selectedAartiData ? selectedAartiData.price * numberOfPeople : 0;

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Aarti Booking Confirmed!</h2>
          <p className="text-orange-600 font-semibold mb-4">Om Sai Ram 🙏</p>
          <div className="bg-orange-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-bold text-lg mb-4">Booking Details:</h3>
            <p><strong>Aarti:</strong> {aartiTypes.find(a => a.id === selectedAarti)?.name}</p>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {aartiTypes.find(a => a.id === selectedAarti)?.time}</p>
            <p><strong>Devotee:</strong> {devoteeDetails.name}</p>
            <p><strong>Mobile:</strong> {devoteeDetails.mobile}</p>
            <p><strong>People:</strong> {numberOfPeople}</p>
          </div>
          <p className="text-gray-600 mb-4">Aarti pass confirmation sent to your mobile number.</p>
          <p className="text-sm text-gray-500">Please arrive 15 minutes before aarti time.</p>
        </div>
      </div>
    );
  }

  if (showGuidelines) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Info className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Aarti Guidelines & Instructions</h1>
            <p className="text-orange-600 font-semibold">Please read carefully before booking</p>
          </div>

          <div className="space-y-4 mb-8">
            {aartiGuidelines.map((guideline, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
                <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-gray-700">{guideline}</p>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-lg text-yellow-800 mb-3">Daily Aarti Schedule:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aartiTypes.map((aarti) => (
                <div key={aarti.id} className="bg-white rounded-lg p-4 border border-yellow-300">
                  <h4 className="font-semibold text-gray-800">{aarti.name}</h4>
                  <p className="text-orange-600 font-bold">{aarti.time}</p>
                  <p className="text-sm text-gray-600">{aarti.duration}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowGuidelines(false)}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              Back to Booking
            </button>
            <button
              onClick={() => setShowGuidelines(false)}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all"
            >
              I Understand, Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showDevoteeForm) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Devotee Details</h1>
            <p className="text-orange-600 font-semibold">Complete your aarti booking</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-lg">{aartiTypes.find(a => a.id === selectedAarti)?.name}</h3>
            <p className="text-gray-600">{selectedDate} at {aartiTypes.find(a => a.id === selectedAarti)?.time}</p>
            <p className="text-sm text-gray-500 mt-2">Total: ₹{aartiTypes.find(a => a.id === selectedAarti)?.price * numberOfPeople} for {numberOfPeople} people</p>
          </div>

          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={devoteeDetails.name}
                  onChange={(e) => setDevoteeDetails({...devoteeDetails, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter full name"
                  pattern="[A-Za-z\s]+"
                  title="Please enter a valid name (letters and spaces only)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={devoteeDetails.age}
                  onChange={(e) => setDevoteeDetails({...devoteeDetails, age: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter age"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
              <div className="flex space-x-4">
                {['Male', 'Female', 'Other'].map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={gender.toLowerCase()}
                      checked={devoteeDetails.gender === gender.toLowerCase()}
                      onChange={(e) => setDevoteeDetails({...devoteeDetails, gender: e.target.value})}
                      className="mr-2"
                      required
                    />
                    <span>{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={devoteeDetails.mobile}
                  onChange={(e) => setDevoteeDetails({...devoteeDetails, mobile: e.target.value.replace(/[^0-9]/g, '')})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="10-digit mobile number"
                  title="Please enter exactly 10 digits"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={devoteeDetails.email}
                  onChange={(e) => setDevoteeDetails({...devoteeDetails, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowDevoteeForm(false)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🔄 Booking...' : 'Confirm Aarti Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loadingTypes) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-2xl text-gray-600">Loading aarti types...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔔</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Aarti Pass</h1>
          <p className="text-orange-600 font-semibold mb-4">Om Sai Ram 🙏</p>
          <button
            onClick={() => setShowGuidelines(true)}
            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-all"
          >
            <Info className="w-4 h-4 inline mr-2" />
            View Aarti Guidelines & Schedule
          </button>
        </div>

        <form onSubmit={handleInitialSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Select Aarti Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aartiTypes.map((aarti) => (
                <div
                  key={aarti.id}
                  onClick={() => setSelectedAarti(aarti.id)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                    selectedAarti === aarti.id
                      ? 'border-orange-600 bg-orange-50 shadow-lg'
                      : 'border-gray-300 hover:border-orange-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-800 mb-2">{aarti.name}</h3>
                      <div className="flex items-center text-orange-600 font-bold text-lg mb-2">
                        <Clock className="w-5 h-5 mr-2" />
                        {aarti.time}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{aarti.description}</p>
                      <p className="text-sm text-blue-600 font-medium">{aarti.duration}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center text-xl font-bold text-orange-600 mb-2">
                        <IndianRupee className="w-5 h-5" />
                        {aarti.price}
                      </div>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 italic">
                    {aarti.guidelines}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <Calendar className="w-5 h-5 inline mr-2" />
                Select Date *
              </label>
              <input
                type="date"
                required
                min={getMinDate()}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <Users className="w-5 h-5 inline mr-2" />
                Number of People *
              </label>
              <input
                type="number"
                required
                min="1"
                max="10"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border-2 border-orange-200">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                {selectedAarti && (
                  <p className="text-sm text-gray-600 mt-1">
                    {aartiTypes.find(a => a.id === selectedAarti)?.name} × {numberOfPeople} people
                  </p>
                )}
              </div>
              <div className="flex items-center text-3xl font-bold text-orange-600">
                <IndianRupee className="w-8 h-8" />
                {totalAmount}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedAarti || !selectedDate}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Devotee Details
          </button>
        </form>
      </div>
    </div>
  );
}
export default AartiBooking;