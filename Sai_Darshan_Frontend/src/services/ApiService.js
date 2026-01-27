// API Configuration and Authentication Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('adminToken');
  }

  // Generate CSRF token
  getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
           sessionStorage.getItem('csrf-token') || 
           Math.random().toString(36).substring(2, 15);
  }

  // Set authorization header
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.getCSRFToken()
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Handle API responses
  async handleResponse(response) {
    if (response.status === 401) {
      this.logout();
      throw new Error('Unauthorized access');
    }
    if (!response.ok) {
      let errorMessage = 'API request failed';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (parseError) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    try {
      return await response.json();
    } catch (parseError) {
      throw new Error('Invalid response format');
    }
  }

  // User Authentication APIs
  async login(email, password) {
    // For now, use localStorage as fallback since backend might not be running
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { user };
  }

  async signup(userData) {
    // For now, use localStorage as fallback since backend might not be running
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { user: newUser };
  }

  // User Booking APIs
  async getUserDarshanBookings(userId) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    return bookings.filter(booking => booking.userId === userId && booking.type === 'darshan');
  }

  async getUserAartiBookings(userId) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    return bookings.filter(booking => booking.userId === userId && booking.type === 'aarti');
  }

  async getUserPoojaBookings(userId) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    return bookings.filter(booking => booking.userId === userId && booking.type === 'pooja');
  }

  async getUserAllBookings(userId) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    return bookings.filter(booking => booking.userId === userId);
  }

  // Aarti Types API
  async getAartiTypes() {
    // Return default aarti types since backend might not be available
    return [
      'Kakad Aarti',
      'Madhyan Aarti', 
      'Dhoop Aarti',
      'Shej Aarti'
    ];
  }

  async bookAarti(bookingData) {
    // Get aarti time based on type
    const aartiTimes = {
      'Kakad Aarti': '04:30 AM',
      'Madhyan Aarti': '12:00 PM', 
      'Dhoop Aarti': '06:30 PM',
      'Shej Aarti': '10:30 PM'
    };
    
    // Save aarti booking to localStorage
    const booking = {
      id: Date.now().toString(),
      userId: bookingData.userId,
      type: 'aarti',
      aartiType: bookingData.aartiType,
      date: bookingData.bookingDate,
      time: aartiTimes[bookingData.aartiType] || '06:00 PM',
      totalAmount: bookingData.totalAmount || 100,
      numberOfPeople: bookingData.numberOfPeople || 1,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    return booking;
  }

  // Pooja Types and Booking APIs
  async getPoojaTypes() {
    // Return default pooja types since backend might not be available
    return [
      {
        poojaType: 'RUDRABHISHEK',
        displayName: 'Rudrabhishek Pooja',
        price: 2100,
        durationMinutes: 90,
        description: 'Sacred abhishek of Lord Shiva with holy water, milk, and sacred materials',
        requiredMaterials: 'Milk, Honey, Ghee, Gangajal, Bilva leaves, Flowers',
        benefits: 'Removes obstacles, brings peace and prosperity'
      },
      {
        poojaType: 'MAHAMRITYUNJAY',
        displayName: 'Mahamrityunjay Jaap',
        price: 1100,
        durationMinutes: 60,
        description: 'Powerful mantra chanting for health and longevity',
        requiredMaterials: 'Rudraksha, White flowers, Sacred thread, Ghee lamp',
        benefits: 'Protects from diseases, grants good health and long life'
      },
      {
        poojaType: 'SATYANARAYAN',
        displayName: 'Satyanarayan Pooja',
        price: 1500,
        durationMinutes: 120,
        description: 'Complete Satyanarayan Katha and pooja for prosperity',
        requiredMaterials: 'Banana, Coconut, Panchamrit, Flowers, Incense',
        benefits: 'Brings wealth, happiness and fulfills desires'
      },
      {
        poojaType: 'HANUMAN_CHALISA',
        displayName: 'Hanuman Chalisa Path',
        price: 500,
        durationMinutes: 45,
        description: 'Recitation of Hanuman Chalisa with aarti',
        requiredMaterials: 'Red flowers, Sindoor, Coconut, Sweets',
        benefits: 'Removes fear, grants strength and courage'
      }
    ];
  }

  async bookPooja(userId, bookingData) {
    // Save pooja booking to localStorage
    const booking = {
      id: Date.now().toString(),
      userId: userId,
      type: 'pooja',
      category: bookingData.poojaType,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      totalAmount: bookingData.totalAmount,
      devoteeDetails: bookingData.devoteeDetails,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    return booking;
  }

  async adminLogin(email, password) {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password })
    });
    
    const data = await this.handleResponse(response);
    this.token = data.token;
    localStorage.setItem('adminToken', this.token);
    localStorage.setItem('adminUser', JSON.stringify(data.user));
    return data;
  }

  async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  }

  // Darshan Management APIs
  async getDarshans() {
    const response = await fetch(`${API_BASE_URL}/admin/darshan`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async addDarshan(darshanData) {
    const response = await fetch(`${API_BASE_URL}/admin/darshan`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(darshanData)
    });
    return this.handleResponse(response);
  }

  async updateDarshan(darshanId, darshanData) {
    const response = await fetch(`${API_BASE_URL}/admin/darshan/${darshanId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(darshanData)
    });
    return this.handleResponse(response);
  }

  async deleteDarshan(darshanId) {
    const response = await fetch(`${API_BASE_URL}/admin/darshan/${darshanId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Aarti Management APIs
  async getAartis() {
    const response = await fetch(`${API_BASE_URL}/admin/aarti`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async addAarti(aartiData) {
    const response = await fetch(`${API_BASE_URL}/admin/aarti`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(aartiData)
    });
    return this.handleResponse(response);
  }

  async updateAarti(aartiId, aartiData) {
    const response = await fetch(`${API_BASE_URL}/admin/aarti/${aartiId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(aartiData)
    });
    return this.handleResponse(response);
  }

  async deleteAarti(aartiId) {
    const response = await fetch(`${API_BASE_URL}/admin/aarti/${aartiId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Special Pooja Management APIs
  async getPoojas() {
    const response = await fetch(`${API_BASE_URL}/admin/pooja`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async addPooja(poojaData) {
    const response = await fetch(`${API_BASE_URL}/admin/pooja`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(poojaData)
    });
    return this.handleResponse(response);
  }

  async updatePooja(poojaId, poojaData) {
    const response = await fetch(`${API_BASE_URL}/admin/pooja/${poojaId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(poojaData)
    });
    return this.handleResponse(response);
  }

  async deletePooja(poojaId) {
    const response = await fetch(`${API_BASE_URL}/admin/pooja/${poojaId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Donation Management APIs
  async getDonations() {
    const response = await fetch(`${API_BASE_URL}/admin/donations`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getDonationDetails(donationId) {
    const response = await fetch(`${API_BASE_URL}/admin/donations/${donationId}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getDailyDonationReport() {
    const response = await fetch(`${API_BASE_URL}/admin/reports/donations/daily`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getMonthlyDonationReport() {
    const response = await fetch(`${API_BASE_URL}/admin/reports/donations/monthly`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Reports & Analytics APIs
  async getDailyReport() {
    const response = await fetch(`${API_BASE_URL}/admin/reports/daily`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getMonthlyReport() {
    const response = await fetch(`${API_BASE_URL}/admin/reports/monthly`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }
}

export default new ApiService();