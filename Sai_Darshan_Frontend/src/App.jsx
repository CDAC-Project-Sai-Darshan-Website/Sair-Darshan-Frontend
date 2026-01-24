import { useState, useEffect } from 'react'
import Login from './components/login'
import Signup from './components/signup'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentView, setCurrentView] = useState('login')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    alert('Login successful! Welcome ' + user.name)
  }

  const handleSignup = (user) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    alert('Registration successful! Welcome ' + user.name)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
    setCurrentView('login')
  }

  const switchToSignup = () => setCurrentView('signup')
  const switchToLogin = () => setCurrentView('login')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-4 border-orange-300 bg-white p-1 animate-pulse">
            <img 
              src="/sai-baba.jpg" 
              alt="Shirdi Sai Baba" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-orange-800 mb-3">🙏 ॐ साईं राम 🙏</h1>
          <p className="text-orange-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">Welcome, {currentUser.name}!</h1>
          <p className="text-orange-600 mb-6">🙏 ॐ साईं राम 🙏</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {currentView === 'login' ? (
        <Login onLogin={handleLogin} onSwitchToSignup={switchToSignup} />
      ) : (
        <Signup onSignup={handleSignup} onSwitchToLogin={switchToLogin} />
      )}
    </>
  )
}

export default App
