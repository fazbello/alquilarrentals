// Database service that mimics the base44 entity system
class DatabaseService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    this.token = null;
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
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

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }
}

class Entity {
  constructor(name, dbService) {
    this.name = name.toLowerCase();
    this.dbService = dbService;
  }

  async create(data) {
    return await this.dbService.request(`/${this.name}`, {
      method: 'POST',
      body: data,
    });
  }

  async list(orderBy = '-created_date', limit = 100) {
    const params = new URLSearchParams({ orderBy, limit }).toString();
    return await this.dbService.request(`/${this.name}?${params}`);
  }

  async filter(where = {}, orderBy = '-created_date', limit = 100) {
    const params = new URLSearchParams({ 
      ...where, 
      orderBy, 
      limit 
    }).toString();
    return await this.dbService.request(`/${this.name}?${params}`);
  }

  async update(id, data) {
    return await this.dbService.request(`/${this.name}/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(id) {
    return await this.dbService.request(`/${this.name}/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkCreate(dataArray) {
    return await this.dbService.request(`/${this.name}/bulk`, {
      method: 'POST',
      body: { data: dataArray },
    });
  }

  schema() {
    return {};
  }
}

class UserEntity extends Entity {
  constructor(dbService) {
    super('user', dbService);
  }

  async me() {
    return await this.dbService.request('/auth/me');
  }

  async login() {
    window.location.href = '/login';
  }

  async logout() {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  }

  async updateMyUserData(data) {
    const user = await this.me();
    return await this.update(user.id, data);
  }

  async loginWithRedirect(callbackUrl) {
    sessionStorage.setItem('login_redirect', callbackUrl);
    window.location.href = '/login';
  }
}

// Create service instance
const dbService = new DatabaseService();

// Export entity instances that maintain compatibility
export const User = new UserEntity(dbService);
export const Car = new Entity('car', dbService);
export const Booking = new Entity('booking', dbService);
export const Payment = new Entity('payment', dbService);
export const Chat = new Entity('chat', dbService);
export const Message = new Entity('message', dbService);
export const EmailTemplate = new Entity('emailtemplate', dbService);

// Update token when it changes
if (typeof window !== 'undefined') {
  const updateToken = () => {
    const token = localStorage.getItem('auth_token');
    dbService.setToken(token);
  };
  
  window.addEventListener('storage', updateToken);
  updateToken();
}