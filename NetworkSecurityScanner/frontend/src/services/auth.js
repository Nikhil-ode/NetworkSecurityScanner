import apiClient, { fetchCsrfToken } from './api';

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Authentication service handling login, logout, registration, and profile management.
 * All methods throw AuthError on failure with relevant status codes.
 */
export const authService = {
  /**
   * Authenticate user with credentials.
   * @param {string} username - Username or email.
   * @param {string} password - User password.
   * @returns {Promise<Object>} Authentication data including tokens.
   * @throws {AuthError} On network or authentication failure.
   */
  login: async (username, password) => {
    await fetchCsrfToken();
    const response = await apiClient.post('/auth/session-login/', {
      username,
      password,
    });
    return response.data;
  },

  /**
   * Clear authentication state and redirect to login.
   */
  logout: async () => {
    await apiClient.post('/api/auth/session-logout/');
  },

  /**
   * Retrieve current authenticated user profile.
   * @returns {Promise<Object>} Current user data.
   * @throws {AuthError} On failure.
   */
  getMe: async () => {
    const response = await apiClient.get('/api/auth/users/me/');
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await apiClient.post('/api/auth/users/', {
      username,
      email,
      password,
    });
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/api/auth/profiles/', data);
    return response.data;
  },
};

export default authService;