// API Service for Netlify deployment
class NetlifyApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || '';
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/.netlify/functions${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    this.setToken(data.token);
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
    this.setToken(data.token);
    return data;
  }

  async me() {
    const data = await this.request('/auth/me');
    return data.user;
  }

  async logout() {
    this.setToken(null);
  }

  // Cars methods
  async getCars(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/cars${queryParams ? `?${queryParams}` : ''}`;
    return await this.request(endpoint);
  }

  async createCar(carData) {
    return await this.request('/cars', {
      method: 'POST',
      body: carData,
    });
  }

  async updateCar(carId, carData) {
    return await this.request(`/cars/${carId}`, {
      method: 'PUT',
      body: carData,
    });
  }

  // Bookings methods
  async getBookings(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/bookings${queryParams ? `?${queryParams}` : ''}`;
    return await this.request(endpoint);
  }

  async createBooking(bookingData) {
    return await this.request('/bookings', {
      method: 'POST',
      body: bookingData,
    });
  }

  async updateBooking(bookingId, bookingData) {
    return await this.request(`/bookings/${bookingId}`, {
      method: 'PUT',
      body: bookingData,
    });
  }

  // Payments methods
  async getPayments(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/payments${queryParams ? `?${queryParams}` : ''}`;
    return await this.request(endpoint);
  }

  async processPayment(paymentData) {
    return await this.request('/payments', {
      method: 'POST',
      body: paymentData,
    });
  }

  // File upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/.netlify/functions/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return await response.json();
  }

  // Email
  async sendEmail(emailData) {
    return await this.request('/email', {
      method: 'POST',
      body: emailData,
    });
  }
}

// Entity-like interface for compatibility with existing code
class NetlifyEntity {
  constructor(name, apiService) {
    this.name = name.toLowerCase();
    this.apiService = apiService;
  }

  async list(sortBy = '-created_at', limit = null) {
    const filters = {};
    if (limit) filters.limit = limit;
    if (sortBy) filters.sortBy = sortBy;
    
    switch (this.name) {
      case 'car':
        return await this.apiService.getCars(filters);
      case 'booking':
        return await this.apiService.getBookings(filters);
      case 'payment':
        return await this.apiService.getPayments(filters);
      default:
        return [];
    }
  }

  async filter(conditions, sortBy = '-created_at', limit = null) {
    const filters = { ...conditions };
    if (limit) filters.limit = limit;
    if (sortBy) filters.sortBy = sortBy;

    switch (this.name) {
      case 'car':
        return await this.apiService.getCars(filters);
      case 'booking':
        return await this.apiService.getBookings(filters);
      case 'payment':
        return await this.apiService.getPayments(filters);
      default:
        return [];
    }
  }

  async create(data) {
    switch (this.name) {
      case 'car':
        return await this.apiService.createCar(data);
      case 'booking':
        return await this.apiService.createBooking(data);
      case 'payment':
        return await this.apiService.processPayment(data);
      default:
        throw new Error(`Create not implemented for ${this.name}`);
    }
  }

  async update(id, data) {
    switch (this.name) {
      case 'car':
        return await this.apiService.updateCar(id, data);
      case 'booking':
        return await this.apiService.updateBooking(id, data);
      default:
        throw new Error(`Update not implemented for ${this.name}`);
    }
  }
}

// User entity with special methods
class NetlifyUser extends NetlifyEntity {
  constructor(apiService) {
    super('user', apiService);
  }

  async me() {
    return await this.apiService.me();
  }

  async login() {
    // This would redirect to login page
    window.location.href = '/login';
  }

  async logout() {
    return await this.apiService.logout();
  }

  async updateMyUserData(data) {
    const user = await this.me();
    return await this.update(user.id, data);
  }

  async loginWithRedirect(callbackUrl) {
    localStorage.setItem('login_callback', callbackUrl);
    window.location.href = '/login';
  }
}

// Create global instances
const apiService = new NetlifyApiService();

export const User = new NetlifyUser(apiService);
export const Car = new NetlifyEntity('car', apiService);
export const Booking = new NetlifyEntity('booking', apiService);
export const Payment = new NetlifyEntity('payment', apiService);
export const Chat = new NetlifyEntity('chat', apiService);
export const Message = new NetlifyEntity('message', apiService);
export const EmailTemplate = new NetlifyEntity('emailtemplate', apiService);

export default apiService;