import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

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
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor - Handle errors and token expiration
apiClient.interceptors.response.use(
  (response) => {
    console.debug('API Response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);

    const originalRequest = error.config;

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Refresh the access token
          const response = await axios.post('/api/auth/jwt/refresh/', {
            refresh: refreshToken
          }, {
            baseURL: API_BASE_URL,
            headers: {
              'Content-Type': 'application/json',
            }
          });

          const newAccessToken = response.data.access;
          
          if (newAccessToken) {
            localStorage.setItem('authToken', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          processQueue(refreshError, null);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          // Redirect to login only if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available
        localStorage.removeItem('authToken');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

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
