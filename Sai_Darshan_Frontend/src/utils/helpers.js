// Authentication utilities
export const authUtils = {
  // Get all users from localStorage
  getUsers: () => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  },

  // Save users to localStorage
  saveUsers: (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  },

  // Check if email exists
  emailExists: (email) => {
    const users = authUtils.getUsers();
    return users.some(user => user.email === email);
  },

  // Validate user credentials
  validateUser: (email, password) => {
    const users = authUtils.getUsers();
    return users.find(user => user.email === email && user.password === password);
  },

  // Register new user
  registerUser: (userData) => {
    const users = authUtils.getUsers();
    const newUser = {
      id: Date.now(),
      ...userData,
      registeredAt: new Date().toISOString()
    };
    users.push(newUser);
    authUtils.saveUsers(users);
    return newUser;
  }
};

// Booking utilities
export const bookingUtils = {
  // Get all bookings from localStorage
  getBookings: () => {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
  },

  // Save bookings to localStorage
  saveBookings: (bookings) => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  },

  // Get user bookings
  getUserBookings: (userId) => {
    const bookings = bookingUtils.getBookings();
    return bookings.filter(booking => booking.userId === userId);
  },

  // Create new booking
  createBooking: (userId, bookingData) => {
    const bookings = bookingUtils.getBookings();
    const newBooking = {
      id: Date.now(),
      userId,
      ...bookingData,
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    bookingUtils.saveBookings(bookings);
    return newBooking;
  }
};

// Date utilities
export const dateUtils = {
  // Format date for display
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Get today's date in YYYY-MM-DD format
  getTodayDate: () => {
    return new Date().toISOString().split('T')[0];
  },

  // Check if date is in the future
  isFutureDate: (dateString) => {
    const today = new Date();
    const inputDate = new Date(dateString);
    return inputDate >= today;
  }
};

// Validation utilities
export const validationUtils = {
  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (Indian format)
  isValidPhone: (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  },

  // Validate password strength
  isValidPassword: (password) => {
    return password.length >= 6;
  },

  // Validate required fields
  validateRequired: (fields) => {
    return Object.values(fields).every(field => field && field.toString().trim() !== '');
  }
};