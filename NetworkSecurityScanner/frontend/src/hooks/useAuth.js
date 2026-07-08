import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';

/**
 * Hook for managing session-based authentication.
 * It relies on HTTP-only session cookies and does NOT use localStorage.
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on initial load by fetching user data.
  // A successful request means a valid session cookie exists.
  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (err) {
      // This is expected if the user is not logged in.
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]); // Empty dependency array ensures this runs only once on mount.

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      // The backend sets the session cookie on successful login.
      await authService.login(username, password);
      // After login, fetch user data to update the state.
      await checkAuthStatus();
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
      setUser(null);
      throw err; // Re-throw for the component to handle
    } finally {
      setLoading(false);
    }
  }, [checkAuthStatus]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    // The ProtectedRoute will handle redirection to the login page.
  }, []);

  return { user, loading, error, login, logout, setUser };
};