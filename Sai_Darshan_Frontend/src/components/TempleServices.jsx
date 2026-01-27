function TempleServices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-orange-600 font-medium">Sai Darshan Temple Services</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow" style={{backgroundColor: '#ea580c', color: 'white'}}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-5xl">🛕</div>
              <h3 className="text-lg font-semibold text-white">Darshan Bookings</h3>
              <div className="text-4xl font-bold text-white">1</div>
            </div>
          </div>

          <div className="rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow" style={{backgroundColor: '#ea580c', color: 'white'}}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-5xl">🔔</div>
              <h3 className="text-lg font-semibold text-white">Aarti Bookings</h3>
              <div className="text-4xl font-bold text-white">0</div>
            </div>
          </div>

          <div className="rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow" style={{backgroundColor: '#ea580c', color: 'white'}}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-5xl">🕉</div>
              <h3 className="text-lg font-semibold text-white">Pooja Bookings</h3>
              <div className="text-4xl font-bold text-white">0</div>
            </div>
          </div>

          <div className="rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow" style={{backgroundColor: '#ea580c', color: 'white'}}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-5xl">🏨</div>
              <h3 className="text-lg font-semibold text-white">Accommodation</h3>
              <div className="text-4xl font-bold text-white">2</div>
            </div>
          </div>

          <div className="rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow" style={{backgroundColor: '#ea580c', color: 'white'}}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-5xl">💰</div>
              <h3 className="text-lg font-semibold text-white">Total Donations</h3>
              <div className="text-4xl font-bold text-white">₹11000</div>
            </div>
          </div>

          <div className="rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow" style={{backgroundColor: '#ea580c', color: 'white'}}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-5xl">👤</div>
              <h3 className="text-lg font-semibold text-white">Total Users</h3>
              <div className="text-4xl font-bold text-white">4</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TempleServices;