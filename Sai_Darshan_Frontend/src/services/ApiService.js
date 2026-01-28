import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // No token-based auth for now
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class ApiService {
  // User Authentication
  async login(email, password) {
    try {
      const response = await apiClient.post('/user/login', { email, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      return { user: response.data };
    } catch (error) {
      throw new Error(error.response?.data || 'Login failed');
    }
  }

  async signup(userData) {
    try {
      const response = await apiClient.post('/user/signup', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  }

  async getUserDetails(userId) {
    try {
      const response = await apiClient.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user details');
    }
  }

  async updateUserDetails(userId, userData) {
    try {
      const response = await apiClient.post(`/user/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user details');
    }
  }

  // Darshan APIs
  async getDarshanTypes() {
    try {
      const response = await apiClient.get('/darshan/types');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get darshan types');
    }
  }

  async getAvailableSlots(date) {
    try {
      const response = await apiClient.get('/darshan/slots', { params: { date } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get available slots');
    }
  }

  async getDarshanPrices() {
    try {
      const response = await apiClient.get('/darshan/prices');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get darshan prices');
    }
  }

  async bookDarshan(bookingData) {
    try {
      const response = await apiClient.post('/darshan/book', bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to book darshan');
    }
  }

  async getUserDarshanBookings(userId) {
    try {
      const response = await apiClient.get(`/darshan/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user bookings');
    }
  }

  async getDarshanBookingDetails(bookingId) {
    try {
      const response = await apiClient.get(`/darshan/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get booking details');
    }
  }

  async cancelDarshanBooking(bookingId) {
    try {
      const response = await apiClient.post(`/darshan/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  }

  // Aarti APIs
  async getAartiTypes() {
    try {
      const response = await apiClient.get('/aarti/types');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get aarti types');
    }
  }

  async getAartiSchedule(date) {
    try {
      const response = await apiClient.get('/aarti/schedule', { params: { date } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get aarti schedule');
    }
  }

  async getAartiPrices() {
    try {
      const response = await apiClient.get('/aarti/prices');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get aarti prices');
    }
  }

  async bookAarti(bookingData) {
    try {
      const response = await apiClient.post('/aarti/book', bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to book aarti');
    }
  }

  async getUserAartiBookings(userId) {
    try {
      const response = await apiClient.get(`/aarti/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get aarti bookings');
    }
  }

  // Pooja APIs
  async getPoojaTypes() {
    try {
      const response = await apiClient.get('/pooja/types');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get pooja types');
    }
  }

  async bookPooja(userId, bookingData) {
    try {
      const response = await apiClient.post('/pooja/bookings', bookingData, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to book pooja');
    }
  }

  async getUserPoojaBookings(userId) {
    try {
      const response = await apiClient.get(`/pooja/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get pooja bookings');
    }
  }

  // Admin APIs
  async adminLogin(email, password) {
    try {
      const response = await apiClient.post('/admin/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Admin login failed');
    }
  }

  async getAdminStats() {
    try {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get admin stats');
    }
  }

  async getAllUsers() {
    try {
      const response = await apiClient.get('/admin/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get users');
    }
  }

  async getAllDarshanBookings() {
    try {
      const response = await apiClient.get('/admin/bookings/darshan');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get darshan bookings');
    }
  }

  // Admin Darshan Management
  async getAllDarshanTypes() {
    try {
      const response = await apiClient.get('/admin/darshan');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get darshan types');
    }
  }

  async createDarshanType(darshanData) {
    try {
      const response = await apiClient.post('/admin/darshan', darshanData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create darshan type');
    }
  }

  async updateDarshanType(darshanId, darshanData) {
    try {
      const response = await apiClient.put(`/admin/darshan/${darshanId}`, darshanData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update darshan type');
    }
  }

  async deleteDarshanType(darshanId) {
    try {
      const response = await apiClient.delete(`/admin/darshan/${darshanId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete darshan type');
    }
  }

  async getAllDarshanBookings() {
    try {
      const response = await apiClient.get('/admin/bookings/darshan');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get all darshan bookings');
    }
  }

  async getAllUsers() {
    try {
      const response = await apiClient.get('/admin/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get users');
    }
  }

  async getAllAartiBookings() {
    try {
      const response = await apiClient.get('/admin/bookings/aarti');
      return response.data;
    } catch (error) {
      return []; // Return empty array if endpoint doesn't exist
    }
  }

  async getAllPoojaBookings() {
    try {
      const response = await apiClient.get('/admin/bookings/pooja');
      return response.data;
    } catch (error) {
      return []; // Return empty array if endpoint doesn't exist
    }
  }

  // Admin Aarti Management
  async getAllAdminAartiTypes() {
    try {
      const response = await apiClient.get('/admin/aarti');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get aarti types');
    }
  }

  async createAartiType(aartiData) {
    try {
      const response = await apiClient.post('/admin/aarti', aartiData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create aarti type');
    }
  }

  async updateAartiType(aartiId, aartiData) {
    try {
      const response = await apiClient.put(`/admin/aarti/${aartiId}`, aartiData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update aarti type');
    }
  }

  async deleteAartiType(aartiId) {
    try {
      const response = await apiClient.delete(`/admin/aarti/${aartiId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete aarti type');
    }
  }

  // Admin Pooja Management
  async getAllAdminPoojaTypes() {
    try {
      const response = await apiClient.get('/admin/pooja');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get pooja types');
    }
  }

  async createPoojaType(poojaData) {
    try {
      const response = await apiClient.post('/admin/pooja', poojaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create pooja type');
    }
  }

  async updatePoojaType(poojaId, poojaData) {
    try {
      const response = await apiClient.put(`/admin/pooja/${poojaId}`, poojaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update pooja type');
    }
  }

  async deletePoojaType(poojaId) {
    try {
      const response = await apiClient.delete(`/admin/pooja/${poojaId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete pooja type');
    }
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('adminUser');
  }
}

export default new ApiService();