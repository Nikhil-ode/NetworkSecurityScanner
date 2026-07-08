import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';
export const API_LOGIN = '/api/auth/auth/session-login/';
export const API_LOGOUT = '/api/auth/auth/session-logout/';
export const API_ME = '/api/auth/users/me/';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - simplified for session auth
apiClient.interceptors.response.use(
  (response) => {
    console.debug('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }

    // Handle 500+ Server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status);
    }

    return Promise.reject(error);
  }
);

// Utility function to check if API is available
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/api/auth/users/me/');
    return response.status === 200 || response.status === 401;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

export default apiClient;
