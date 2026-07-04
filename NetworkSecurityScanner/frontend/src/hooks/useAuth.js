import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setLoading(true);
      authService.getMe()
        .then(data => {
          setUser(data);
          setError(null);
        })
        .catch(err => {
          console.error('Auto fetch user failed', err);
          localStorage.removeItem('authToken');
          setUser(null);
          setError(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(username, password);

      const token = data.access || data.token;
      if (!token) throw new Error('No token received');

      const userName = data.user?.username || data.username || username;
      localStorage.setItem('authToken', token);
      setUser({ username: userName });
    } catch (err) {
      console.error('Login failed', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setError(null);
  }, []);

  return { user, loading, error, login, logout, setUser };
};