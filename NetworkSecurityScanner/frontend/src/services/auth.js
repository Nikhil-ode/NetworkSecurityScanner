import apiClient, {
  fetchCsrfToken,
  API_LOGIN,
  API_LOGOUT,
  API_ME,
  API_REGISTER,
  API_PROFILE,
} from './api';

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
    const response = await apiClient.post(API_LOGIN, {
      username,
      password,
    });
    return response.data;
  },

  /**
   * Clear authentication state and redirect to login.
   */
  logout: async () => {
    await apiClient.post(API_LOGOUT);
  },

  /**
   * Retrieve current authenticated user profile.
   * @returns {Promise<Object>} Current user data.
   * @throws {AuthError} On failure.
   */
  getMe: async () => {
    const response = await apiClient.get(API_ME);
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await apiClient.post(API_REGISTER, {
      username,
      email,
      password,
    });
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put(API_PROFILE, data);
    return response.data;
  },
};

export default authService;