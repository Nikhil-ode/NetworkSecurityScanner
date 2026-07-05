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
    const response = await apiClient.get('/auth/users/me/');
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await apiClient.post('/auth/users/', {
      username,
      email,
      password,
    });
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/auth/profiles/', data);
    return response.data;
  },
};
