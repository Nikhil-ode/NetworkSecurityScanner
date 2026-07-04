import apiClient from './api';

export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post('/auth/jwt/create/', {
      username,
      password,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

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
