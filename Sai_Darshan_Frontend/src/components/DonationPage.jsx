import { useState } from 'react';

const donationTypes = [
  {
    id: 'general',
    name: 'General Donation',
    description: 'Support overall temple operations and maintenance',
    suggestedAmounts: [101, 251, 501, 1001, 2100]
  },
  {
    id: 'annadan',
    name: 'Annadan (Food Donation)',
    description: 'Sponsor meals for devotees and provide free food service',
    suggestedAmounts: [251, 501, 1001, 2100, 5100]
  },
  {
    id: 'development',
    name: 'Temple Development',
    description: 'Contribute to temple infrastructure and facility improvements',
    suggestedAmounts: [501, 1001, 2100, 5100, 11000]
  },
  {
    id: 'festival',
    name: 'Festival Donation',
    description: 'Support special celebrations like Ram Navami, Guru Purnima, Diwali',
    suggestedAmounts: [251, 501, 1001, 2100, 5100]
  },
  {
    id: 'vastra',
    name: 'Vastra Seva (Clothes Donation)',
    description: 'Sponsor new clothes and decorations for Sai Baba',
    suggestedAmounts: [501, 1001, 2100, 5100, 11000]
  }
];

function DonationPage({ user }) {
  const [selectedType, setSelectedType] = useState('');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [donorDetails, setDonorDetails] = useState({
    name: user?.firstName + ' ' + user?.lastName || '',
    mobile: user?.phoneNumber || '',
    email: user?.email || '',
    address: '',
    panNumber: ''
  });

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!selectedType || !amount) {
      alert('Please select donation type and amount');
      return;
    }
    if (amount === 'custom' && (!customAmount || parseInt(customAmount) < 1)) {
      alert('Please enter a valid custom amount');
      return;
    }
    setShowDonorForm(true);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    
    // Validation for non-anonymous donations
    if (!isAnonymous) {
      if (!donorDetails.name || !donorDetails.mobile) {
        alert('Please fill name and mobile number for non-anonymous donation');
        return;
      }
      if (donorDetails.mobile.length !== 10 || !/^[0-9]+$/.test(donorDetails.mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
      }
      if (donorDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorDetails.email)) {
        alert('Please enter a valid email address');
        return;
      }
    }
    
    const finalAmount = amount === 'custom' ? parseInt(customAmount) : parseInt(amount);
    const selectedDonationType = donationTypes.find(d => d.id === selectedType);
    
    const donation = {
      id: Date.now().toString(),
      userId: user?.id || 'anonymous',
      donationType: selectedDonationType.name,
      amount: finalAmount,
      isAnonymous,
      donorDetails: isAnonymous ? { name: 'Anonymous' } : donorDetails,
      date: new Date().toISOString(),
      receiptNumber: 'SAI' + Date.now().toString().slice(-8)
    };

    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    donations.push(donation);
    localStorage.setItem('donations', JSON.stringify(donations));

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedType('');
      setAmount('');
      setCustomAmount('');
      setIsAnonymous(false);
      setShowDonorForm(false);
      setDonorDetails({
        name: user?.firstName + ' ' + user?.lastName || '',
        mobile: user?.phoneNumber || '',
        email: user?.email || '',
        address: '',
        panNumber: ''
      });
    }, 5000);
  };

  if (showSuccess) {
    const finalAmount = amount === 'custom' ? parseInt(customAmount) : parseInt(amount);
    const selectedDonationType = donationTypes.find(d => d.id === selectedType);
    
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-green-600">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Donation Successful!</h2>
          <p className="text-orange-600 font-semibold mb-4">Om Sai Ram 🙏</p>
          
          <div className="bg-orange-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-bold text-lg mb-4">Donation Receipt:</h3>
            <p><strong>Receipt No:</strong> SAI{Date.now().toString().slice(-8)}</p>
            <p><strong>Donation Type:</strong> {selectedDonationType?.name}</p>
            <p><strong>Amount:</strong> ₹{finalAmount}</p>
            <p><strong>Donor:</strong> {isAnonymous ? 'Anonymous' : donorDetails.name}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            {!isAnonymous && donorDetails.mobile && (
              <p><strong>Mobile:</strong> {donorDetails.mobile}</p>
            )}
          </div>
          
          <p className="text-gray-600 mb-4">Thank you for your generous donation!</p>
          <p className="text-sm text-gray-500">May Sai Baba bless you with happiness and prosperity.</p>
          <p className="text-xs text-gray-400 mt-4">Receipt has been sent to your registered contact details.</p>
        </div>
      </div>
    );
  }

  if (showDonorForm) {
    const finalAmount = amount === 'custom' ? parseInt(customAmount) : parseInt(amount);
    const selectedDonationType = donationTypes.find(d => d.id === selectedType);
    
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">👤</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Donor Details</h1>
            <p className="text-orange-600 font-semibold">Complete your donation</p>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-lg">{selectedDonationType?.name}</h3>
            <p className="text-gray-600">{selectedDonationType?.description}</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">₹{finalAmount}</p>
          </div>

          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="anonymous" className="text-sm font-medium text-gray-700">
                Make this an anonymous donation
              </label>
            </div>

            {!isAnonymous && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={donorDetails.name}
                      onChange={(e) => setDonorDetails({...donorDetails, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter full name"
                      pattern="[A-Za-z\s]+"
                      title="Please enter a valid name (letters and spaces only)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      maxLength="10"
                      value={donorDetails.mobile}
                      onChange={(e) => setDonorDetails({...donorDetails, mobile: e.target.value.replace(/[^0-9]/g, '')})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={donorDetails.email}
                      onChange={(e) => setDonorDetails({...donorDetails, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Number (Optional)</label>
                    <input
                      type="text"
                      value={donorDetails.panNumber}
                      onChange={(e) => setDonorDetails({...donorDetails, panNumber: e.target.value.toUpperCase()})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="ABCDE1234F"
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      maxLength="10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address (Optional)</label>
                  <textarea
                    value={donorDetails.address}
                    onChange={(e) => setDonorDetails({...donorDetails, address: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your address"
                    rows="3"
                  />
                </div>
              </>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowDonorForm(false)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all"
              >
                Complete Donation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <span className="text-8xl mb-4 block">❤️</span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Make a Donation</h1>
          <p className="text-orange-600 font-semibold mb-4">Om Sai Ram 🙏</p>
          <p className="text-gray-600">Support Sai Baba temple and serve devotees</p>
        </div>

        <form onSubmit={handleInitialSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Select Donation Type *
            </label>
            <div className="grid grid-cols-1 gap-4">
              {donationTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                    selectedType === type.id
                      ? 'border-orange-600 bg-orange-50 shadow-lg'
                      : 'border-gray-300 hover:border-orange-400'
                  }`}
                >
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{type.name}</h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedType && (
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Select Donation Amount *
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                {donationTypes.find(d => d.id === selectedType)?.suggestedAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      amount === amt.toString()
                        ? 'border-orange-600 bg-orange-50 font-bold'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <span className="mr-1">₹</span>
                      {amt}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setAmount('custom')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    amount === 'custom'
                      ? 'border-orange-600 bg-orange-50 font-bold'
                      : 'border-gray-300 hover:border-orange-400'
                  }`}
                >
                  Custom Amount
                </button>
                {amount === 'custom' && (
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                      <input
                        type="number"
                        required
                        min="1"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter custom amount"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedType && amount && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border-2 border-orange-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold text-gray-700">Donation Amount:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    {donationTypes.find(d => d.id === selectedType)?.name}
                  </p>
                </div>
                <div className="flex items-center text-3xl font-bold text-orange-600">
                  <span className="mr-1">₹</span>
                  {amount === 'custom' ? customAmount : amount}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedType || !amount || (amount === 'custom' && !customAmount)}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Donor Details
          </button>
        </form>
      </div>
    </div>
  );
}

export default DonationPage