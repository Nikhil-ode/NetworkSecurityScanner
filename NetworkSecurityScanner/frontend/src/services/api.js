import axios from 'axios';

const API_BASE_URL = ''; // Always use relative URLs to avoid /api prefix duplication in production

export const API_LOGIN = '/api/auth/session-login/';
export const API_LOGOUT = '/api/auth/session-logout/';
export const API_ME = '/api/auth/users/me/';
export const API_REGISTER = '/api/auth/users/';
export const API_PROFILE = '/api/auth/profiles/';
export const API_CSRF = '/api/auth/csrf/';

const getCookie = (name) => {
  const cookieString = document.cookie || '';
  const cookies = cookieString.split(';').map((cookie) => cookie.trim());
  const found = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.split('=')[1]) : null;
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add credentials and CSRF token to all requests
apiClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true;

    const safeMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];
    const method = (config.method || '').toUpperCase();
    if (!safeMethods.includes(method)) {
      const csrfToken = getCookie('csrftoken');
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }

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
    const response = await apiClient.get(API_ME);
    return response.status === 200 || response.status === 401;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

// Utility function to fetch CSRF token
export const fetchCsrfToken = async () => {
  try {
    await apiClient.get(API_CSRF);
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};

export default apiClient;
