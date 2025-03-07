import apiConfig from '../config/api-config.json';

class ApiService {
  constructor() {
    this.baseUrl = apiConfig.baseUrl;
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return { data: null, error: data.error || 'An error occurred' };
      }

      return { data, error: null };
    } catch (error) {
      console.error('API request failed:', error);
      return { data: null, error: error.message || 'Network error' };
    }
  }

  // Student enrollment methods
  async enrollNewStudent(studentData) {
    return this.request('/inscriptions', {
      method: 'POST',
      body: JSON.stringify({
        action: 'new',
        nom: studentData.nom,
        prenom: studentData.prenom,
        email: studentData.email,
        telephone: studentData.telephone,
        formation_id: studentData.formation_id
      }),
    });
  }

  async enrollExistingStudent(enrollmentData) {
    return this.request('/inscriptions', {
      method: 'POST',
      body: JSON.stringify({
        etudiant_id: enrollmentData.etudiant_id,
        formation_id: enrollmentData.formation_id,
        user_id: enrollmentData.user_id
      }),
    });
  }

  // Auth methods
  async signUp(credentials) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signInWithPassword(credentials) {
    const result = await this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (result.data && result.data.token) {
      localStorage.setItem('auth_token', result.data.token);
    }
    
    return result;
  }

  async resetPasswordForEmail(email, options = {}) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, redirectTo: options.redirectTo }),
    });
  }

  async updateUser(updates) {
    return this.request('/auth/user', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Database methods
  from(table) {
    return new QueryBuilder(this, table);
  }
}

class QueryBuilder {
  constructor(apiService, table) {
    this.apiService = apiService;
    this.table = table;
    this.filters = [];
    this.selectColumns = '*';
  }

  select(columns) {
    this.selectColumns = columns;
    return this;
  }

  eq(column, value) {
    this.filters.push({ type: 'eq', column, value });
    return this;
  }

  async insert(records) {
    return this.apiService.request(`/${this.table}`, {
      method: 'POST',
      body: JSON.stringify(records),
    });
  }

  async update(updates) {
    const queryParams = this.buildQueryParams();
    return this.apiService.request(`/${this.table}${queryParams}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async delete() {
    const queryParams = this.buildQueryParams();
    return this.apiService.request(`/${this.table}${queryParams}`, {
      method: 'DELETE',
    });
  }

  buildQueryParams() {
    if (this.filters.length === 0) return '';
    
    const params = this.filters.map(filter => {
      if (filter.type === 'eq') {
        return `${filter.column}=${encodeURIComponent(filter.value)}`;
      }
      return '';
    }).filter(Boolean);
    
    return `?${params.join('&')}`;
  }

  async get() {
    const queryParams = this.buildQueryParams();
    const columnsParam = this.selectColumns !== '*' ? `&select=${this.selectColumns}` : '';
    
    return this.apiService.request(`/${this.table}${queryParams}${columnsParam}`);
  }
}

const api = new ApiService();
export default api;