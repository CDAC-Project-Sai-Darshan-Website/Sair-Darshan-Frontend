// API Configuration and Authentication Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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

  // Admin Authentication
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