import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    authService.getMe()
      .then(data => {
        setUser(data);
        setError(null);
      })
      .catch(err => {
        console.error('Auto fetch user failed', err);
        setUser(null);
        setError(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(username, password);
      const userData = await authService.getMe();
      setUser(userData);
    } catch (err) {
      console.error('Login failed', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout failed', err);
    }
    setUser(null);
    setError(null);
  }, []);

  return { user, loading, error, login, logout, setUser };
};